import { HistoryConfig, StorageConfig, Store } from './types';
export declare function createStore<Config, K extends (keyof Config)[]>(config: Config, features?: {
    localStorage?: StorageConfig<Config>;
    undoRedo?: HistoryConfig<Config>;
}): Store<Config>;
