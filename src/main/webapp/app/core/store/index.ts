import { Observable } from 'rxjs/Observable';
import * as fromRouter from '@ngrx/router-store';
import { localStorageSync } from 'ngrx-store-localstorage';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/combineLatest';

import { Article } from './article/article.model';
import { Author } from './author/author.model';
import { Book } from './book/book.model';
import { Claim } from './claim/claim.model';
import { Comment } from './comment/comment.model';
import { Crisis } from './crisis/crisis.model';
import { ClaimRebuttal } from './claim-rebuttal/claim-rebuttal.model';
import { Contact } from './contact/contact.model';
import { Counter } from './counter/counter.model';
import { Hero } from './hero/hero.model';
import { Layout } from './layout/layout.model';
import { Note } from './note/note.model';
import { Rebuttal } from './rebuttal/rebuttal.model';
import { Session } from './session/session.model';
import { User } from './user/user.model';
import { TagList } from './tag-list/tag-list.model';
import { BlogPageLayout } from '../../features/blog/blog.layout';
import { Talk } from './talk/talk.model';

import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    compose,
    ActionReducer,
    combineReducers,
    Action,
    ActionReducerFactory,
    MetaReducer
} from '@ngrx/store';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromArticles from './article/article.reducer';
import * as fromAuthors from './author/author.reducer';
import * as fromBooks from './book/book.reducer';
import * as fromClaimRebuttals from './claim-rebuttal/claim-rebuttal.reducer';
import * as fromClaims from './claim/claim.reducer';
import * as fromCollection from './collection/collection.reducer';
import * as fromComments from './comment/comment.reducer';
import * as fromContacts from './contact/contact.reducer';
import * as fromCounter from './counter/counter.reducer';
import * as fromCrises from './crisis/crisis.reducer';
import * as fromGames from './game/game.reducer';
import * as fromHeroes from './hero/hero.reducer';
import * as fromLayout from './layout/layout.reducer';
import * as fromMessages from './message/message.reducer';
import * as fromNotes from './note/note.reducer';
import * as fromRebuttals from './rebuttal/rebuttal.reducer';
import * as fromSearch from './search/search.reducer';
import * as fromSession from './session/session.reducer';
import * as fromTagList from './tag-list/tag-list.reducer';
import * as fromTalks from './talk/talk.reducer';
import { gameReducer, gamesReducer, p2pGameReducer } from './game/game.reducer';
import { Entities } from './entity/entity.model';
import { IDs } from './id/id.model';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface RootState {
    book: Entities<Book>;
    article: Entities<Article>;
    author: Entities<Author>;
    claimRebuttal: Entities<ClaimRebuttal>;
    claim: Entities<Claim>;
    collection: IDs;
    comment: Entities<Comment>;
    contact: Entities<Contact>;
    counter: Counter;
    crisis: Entities<Crisis>;
    game;
    games;
    hero: Entities<Hero>;
    layout: Layout;
    message: any;
    note: Entities<Note>;
    p2pGame;
    rebuttal: Entities<Rebuttal>;
    router: fromRouter.RouterReducerState;
    search: IDs;
    session: Session;
    tagList: TagList;
    talk: Entities<Talk>;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const reducers: ActionReducerMap<RootState> = {
    // ngrx ones
    book: fromBooks.reducer,
    article: fromArticles.reducer,
    author: fromAuthors.reducer,
    claim: fromClaims.reducer,
    claimRebuttal: fromClaimRebuttals.reducer,
    contact: fromContacts.reducer,
    collection: fromCollection.reducer,
    counter: fromCounter.reducer,
    crisis: fromCrises.reducer,
    game: fromGames.gameReducer,
    games: gamesReducer,
    hero: fromHeroes.reducer,
    layout: fromLayout.reducer,
    message: fromMessages.reducer,
    note: fromNotes.reducer,
    p2pGame: p2pGameReducer,
    rebuttal: fromRebuttals.reducer,
    router: fromRouter.routerReducer,
    search: fromSearch.reducer,
    session: fromSession.reducer,
    comment: fromComments.reducer,
    talk: fromTalks.reducer,
    tagList: fromTagList.reducer
};

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
// export const metaReducers: ActionReducer<any, any>[] = process.env.NODE_ENV === 'dev'
//     ? [logger]
//     : [];

export const metaReducers: MetaReducer<RootState>[] = process.env.NODE_ENV === 'dev'
    ? [logger]
    : [];

// console.log all actions
function logger(reducer: ActionReducer<RootState>) {
    return function (state: RootState, action: any) {
        console.log('state', state);
        console.log('action', action);

        return reducer(state, action);
    }
}

const developmentReducer = compose(
    // reduxThunk,                // Thunk middleware for Redux
    // reduxMulti,                // Dispatch multiple actions
    // reduxPromiseMiddleware(),
    // storeFreeze,
    localStorageSync({ keys: ['session'] }),
    combineReducers)(reducers);
const productionReducer = compose(
    // reduxThunk,               // Thunk middleware for Redux
    // reduxMulti,               // Dispatch multiple actions
    // reduxPromiseMiddleware(),
    localStorageSync({ keys: ['session'] }),
    combineReducers)(reducers);

export function reducer(state: any, action: any) {
    if (process.env.NODE_ENV === 'prod') {
        return productionReducer(state, action);
    } else {
        return developmentReducer(state, action);
    }
}

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose the root meta-reducer.
 * To add more meta-reducers, provide a custom reducer factory.
 */
export const developmentReducerFactory: ActionReducerFactory<RootState, Action> = compose(logger, combineReducers);

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 * ```
 */

/**
  * The createFeatureSelector function selects a piece of state from the root of the state object.
  * This is used for selecting feature states that are loaded eagerly or lazily.
*/

// const developmentReducer = compose(
//     // reduxThunk,                // Thunk middleware for Redux
//     // reduxMulti,                // Dispatch multiple actions
//     // reduxPromiseMiddleware(),
//     // storeFreeze,
//     localStorageSync({ keys: ['session'] }),
//     combineReducers)(reducers);
// const productionReducer = compose(
//     // reduxThunk,               // Thunk middleware for Redux
//     // reduxMulti,               // Dispatch multiple actions
//     // reduxPromiseMiddleware(),
//     localStorageSync({ keys: ['session'] }),
//     combineReducers)(reducers);

// export function reducer(state: any, action: any) {
//     if (process.env === 'prod') {
//         return productionReducer(state, action);
//     } else {
//         return developmentReducer(state, action);
//     }
// }

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<RootState>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 *
 * ```
 *
 */
export const getBooksState = (state: RootState) => state.book;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * Once again our createSelector function comes in handy. From right to left, we
 * first select the books state then we pass the state to the book
 * reducer's getBooks selector, finally returning an observable
 * of search results.
 *
 * Share memoizes the selector functions and published the result. This means
 * every time you call the selector, you will get back the same result
 * observable. Each subscription to the resultant observable
 * is shared across all subscribers.
 */
export const getBookEntities = createSelector(getBooksState, fromBooks.getEntities);
export const getBookIds = createSelector(getBooksState, fromBooks.getIds);
export const getSelectedBookId = createSelector(getBooksState, fromBooks.getSelectedId);
export const getSelectedBook = createSelector(getBooksState, fromBooks.getSelected);

/**
 * Just like with the books selectors, we also have to createSelector the search
 * reducer's and collection reducer's selectors.
 */
export const getSearchState = (state: RootState) => state.search;
export const getSearchBookIds = createSelector(getSearchState, fromSearch.getIds);
export const getSearchLoading = createSelector(getSearchState, fromSearch.getLoading);

/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */
export const getSearchResults = createSelector(getBookEntities, getSearchBookIds, (books, searchIds) => {
    return searchIds.map((id) => books[id]);
});

export const getCollectionState = (state: RootState) => state.collection;
export const getCollectionLoaded = createSelector(getCollectionState, fromCollection.getLoaded);
export const getCollectionLoading = createSelector(getCollectionState, fromCollection.getLoading);
export const getCollectionBookIds = createSelector(getCollectionState, fromCollection.getIds);
export const getBookCollection = createSelector(getBookEntities, getCollectionBookIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const isSelectedBookInCollection = createSelector(getCollectionBookIds, getSelectedBookId, (ids, selected) => {
    return ids.indexOf(selected) > -1;
});

/**
 * Layout Selectors
 */
export const getLayoutState = (state: RootState) => state.layout;
export const getMsg = createSelector(getLayoutState, fromLayout.getMsg);
export const getBerniePageState = createSelector(getLayoutState, fromLayout.getBerniePageState);
export const getHeroSearchTerm = createSelector(getLayoutState, fromLayout.getHeroSearchTerm);
export const getSearchQuery = createSelector(getLayoutState, fromLayout.getQuery);
export const getBernieSearchTerm = createSelector(getLayoutState, fromLayout.getBernieSearchTerm);
export const getBlogPageLayout = createSelector(getLayoutState, fromLayout.getBlogPageState);
export const getTalksPageFilters = createSelector(getLayoutState, fromLayout.getTalksPageFilters);

/**
 * Session Selectors
 */
export const getSessionState = (state: RootState) => state.session;
export const hasError = createSelector(getSessionState, fromSession.hasError);
export const isLoading = createSelector(getSessionState, fromSession.isLoading);
export const loggedIn = createSelector(getSessionState, fromSession.loggedIn);
export const loggedOut = createSelector(getSessionState, fromSession.loggedOut);
export const getFirstName = createSelector(getSessionState, fromSession.getFirstName);
export const getLastName = createSelector(getSessionState, fromSession.getLastName);
export const getUserState = createSelector(getSessionState, fromSession.getUser);

/**
 * Notes Selectors
 */
export const getNotesState = (state: RootState) => state.note;
export const getNoteEntities = createSelector(getNotesState, fromNotes.getEntities);
export const getNoteIds = createSelector(getNotesState, fromNotes.getIds);
export const getNotes = createSelector(getNoteEntities, getNoteIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});

/**
 * Claims Selectors
 */
export const getClaimsState = (state: RootState): Entities<Claim> => state.claim;
export const getClaimEntities = createSelector(getClaimsState, fromClaims.getEntities);
export const getClaimIds = createSelector(getClaimsState, fromClaims.getIds);
export const getClaims = createSelector(getClaimEntities, getClaimIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
// export const getBerniePage = createSelector(getBerniePageState, getClaims, (berniePage, claims) => {

//     let _dirty = false;
//     claims.forEach((claim) => {
//         claim.rebuttals.forEach((rebuttal) => {
//             if (rebuttal && rebuttal.dirty) {
//                 _dirty = true;
//             }
//         });
//     });

//     return Object.assign({}, berniePage, { dirty: _dirty });

// });

/**
 * Rebuttal Selectors
 */
export const getRebuttalsState = (state: RootState): Entities<Rebuttal> => state.rebuttal;
export const getRebuttalEntities = createSelector(getRebuttalsState, fromRebuttals.getEntities);
export const getRebuttalIds = createSelector(getRebuttalsState, fromRebuttals.getIds);
export const getRebuttals = createSelector(getRebuttalEntities, getRebuttalIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});

/**
 * ClaimRebuttal Selectors
 */
export const getClaimRebuttalsState = (state: RootState): Entities<ClaimRebuttal> => state.claimRebuttal;
export const getClaimRebuttalEntities = createSelector(getClaimRebuttalsState, fromClaimRebuttals.getEntities);
export const getClaimRebuttalIds = createSelector(getClaimRebuttalsState, fromClaimRebuttals.getIds);
export const getClaimRebuttals = createSelector(getClaimRebuttalEntities, getClaimRebuttalIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const getDeepClaimRebuttals = createSelector(getClaimRebuttals, getRebuttals, (claimRebuttals, rebuttals) => {
    return claimRebuttals.map((cr) => {
        return {
            claimId: cr.claimId,
            sortOrder: cr.sortOrder,
            rebuttal: rebuttals.filter((rebuttal) => rebuttal.id === cr.rebuttalId)[0]
        }
    })
});

export const getDeepClaims = createSelector(getClaims, getDeepClaimRebuttals, getBernieSearchTerm, (claims, deepClaimRebuttals, bernieSearchTerm) => {
    return claims.map((claim) => {
        return Object.assign({}, claim, {
            rebuttals: deepClaimRebuttals
                .filter((dcr) => dcr.claimId === claim.id)
                .sort((a, b) => a.sortOrder < b.sortOrder ? -1 : 1)
                .map((dcr) => dcr.rebuttal)
        })
    }
    )
        .filter((dc) => bernieSearchTerm === '' || dc.name.toLowerCase().indexOf(bernieSearchTerm.toLowerCase()) > -1)
        .sort((a, b) => a.sortOrder < b.sortOrder ? -1 : 1)
});

/**
 * Counter Selectors
 */
export const getCounterState = (state: RootState) => state.counter;
export const getCounterValue = createSelector(getCounterState, fromCounter.getValue);

/**
 * Crises Selectors
 */
export const getCrisesState = (state: RootState): Entities<Crisis> => state.crisis;
export const getCrisisEntities = createSelector(getCrisesState, fromCrises.getEntities);
export const getCrisisIds = createSelector(getCrisesState, fromCrises.getIds);
export const getSelectedCrisis = createSelector(getCrisesState, fromCrises.getSelected);
export const getCrises = createSelector(getCrisisEntities, getCrisisIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
// A selector that takes a parameter (id)
export const getCrisis = (id) => createSelector(getCrisesState, (crisisList) => {
    // return crisisList.filter(c => c.id === id);
    return crisisList.ids.map((crisisId) => crisisList.entities[crisisId]).filter((c) => c.id === id);
});

/**
 * Contacts Selectors
 */

export const getContactsState = (state: RootState): Entities<Contact> => state.contact;
export const getContactEntities = createSelector(getContactsState, fromContacts.getEntities);
export const getContactIds = createSelector(getContactsState, fromContacts.getIds);
export const getSelectedContact = createSelector(getContactsState, fromContacts.getSelected);
export const getContacts = createSelector(getContactEntities, getContactIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const getContact = createSelector(getContactsState, fromContacts.getSelected);

/**
 * Heroes Selectors
 */
export const getHeroesState = (state: RootState): Entities<Hero> => state.hero;
export const getHeroEntities = createSelector(getHeroesState, fromHeroes.getEntities);
export const getHeroIds = createSelector(getHeroesState, fromHeroes.getIds);
export const getSelectedHero = createSelector(getHeroesState, fromHeroes.getSelected);
export const getHeroes = createSelector(getHeroEntities, getHeroIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const getHeroesForSearchTerm = createSelector(getHeroes, getHeroSearchTerm, (heroes, searchTerm) => {
    return heroes.filter((hero) => hero.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
});

/**
 * Messages Selectors
 */
export const getMessagesState = (state: RootState) => state.message;
export const getMessageEntities = createSelector(getMessagesState, fromMessages.getEntities);
export const getMessageIds = createSelector(getMessagesState, fromMessages.getIds);
export const getSelectedMessage = createSelector(getMessagesState, fromMessages.getSelected);
export const getMessages = createSelector(getMessageEntities, getMessageIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const getMessage = createSelector(getMessagesState, fromMessages.getSelected);

/**
 * Comments Selectors
 */
export const getCommentsState = (state: RootState): Entities<Comment> => state.comment;
export const getCommentEntities = createSelector(getCommentsState, fromComments.getEntities);
export const getCommentIds = createSelector(getCommentsState, fromComments.getIds);
export const getComments = createSelector(getCommentEntities, getCommentIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});

/**
 * Authors Selectors
 */
export const getAuthorsState = (state: RootState): Entities<Author> => state.author;
export const getAuthorEntities = createSelector(getAuthorsState, fromAuthors.getEntities);
export const getAuthorIds = createSelector(getAuthorsState, fromAuthors.getIds);
export const getAuthors = createSelector(getAuthorEntities, getAuthorIds, (entities, ids) => {
    return ids.map((id) => {
        return entities[id];
        // const following = false;
        // entities[id].followers.some((follower) => follower.login === currentUser.login)
        // return { ...entities[id], following };
    });
});

/**
 * TagList Selectors
 */
export const getTags = (state: RootState): string[] => state.tagList.tags;

/**
 * Articles Selectors
 */
export const getArticlesState = (state: RootState): Entities<Article> => state.article;
export const getArticleEntities = createSelector(getArticlesState, fromArticles.getEntities);
export const getArticleIds = createSelector(getArticlesState, fromArticles.getIds);
export const getSelectedArticleId = createSelector(getArticlesState, fromArticles.getSelectedId);
export const getSelectedArticle = createSelector(getArticlesState, fromArticles.getSelected);
export const getTempArticle = createSelector(getArticlesState, fromArticles.getTemp);
export const getArticles = createSelector(getArticleEntities, getArticleIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
export const getArticlesForQuery = createSelector(getArticles, getBlogPageLayout, getAuthors,
    (articles: Article[], blogPageLayout: BlogPageLayout, authors: Author[]) => {
        return articles.filter((article) => {
            return !blogPageLayout.filters.author || blogPageLayout.filters.author === article.author.username &&
                !blogPageLayout.filters.tag || article.tagList.some((tag) => tag === blogPageLayout.filters.tag);
        });
    });

export const getCommentsForSelectedArticle = createSelector(getComments, getSelectedArticleId, (comments, articleId) => {
    return comments.filter((comment) => comment.articleId === articleId);
});

/**
 * Talks Selectors
 */
export const getTalksState = (state: RootState) => state.talk;
export const getTalkEntities = createSelector(getTalksState, fromTalks.getEntities);
export const getTalkIds = createSelector(getTalksState, fromTalks.getIds);
export const getTalks = createSelector(getTalkEntities, getTalkIds, (entities, ids) => {
    return ids.map((id) => entities[id]);
});
