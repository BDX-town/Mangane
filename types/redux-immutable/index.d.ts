// Type definitions for redux-immutable v4.0.0
// Project: https://github.com/gajus/redux-immutable
// Definitions by: Sebastian Sebald <https://github.com/sebald>
//                 Gavin Gregory <https://github.com/gavingregory>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare module 'redux-immutable' {
  import { Collection, Record } from 'immutable';
  import { ReducersMapObject, Reducer, Action } from 'redux';

  export function combineReducers<S, A extends Action, T>(reducers: ReducersMapObject<S, A>, getDefaultState?: () => Collection.Keyed<T, S>): Reducer<S, A>;
  export function combineReducers<S, A extends Action>(reducers: ReducersMapObject<S, A>, getDefaultState?: () => Collection.Indexed<S>): Reducer<S, A>;
  export function combineReducers<S>(reducers: ReducersMapObject<S, any>, getDefaultState?: () => Collection.Indexed<S>): Reducer<S>;
  export function combineReducers<S extends object, T extends object>(reducers: ReducersMapObject<S, any>, getDefaultState?: Record.Factory<T>): Reducer<ReturnType<Record.Factory<S>>>;
}
