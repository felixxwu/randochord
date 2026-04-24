import { HistoryConfig, Store } from './types';
declare type History<T> = {
    position: number;
    states: Partial<T>[];
};
export declare function saveHistory<Config>(store: Store<Config>, historyConfig: HistoryConfig<Config>): void;
export declare function canUndo<Config>(historyConfig: HistoryConfig<Config>, history?: History<Config>): boolean;
export declare function canRedo<Config>(historyConfig: HistoryConfig<Config>, history?: History<Config>): boolean;
export declare function undo<Config>(store: Store<Config>, historyConfig: HistoryConfig<Config>): void;
export declare function redo<Config>(store: Store<Config>, historyConfig: HistoryConfig<Config>): void;
export declare function initHistory<Config>(store: Store<Config>, historyConfig: HistoryConfig<Config>): void;
export {};
