export declare type HistoryConfig<Config> = {
    keys: (keyof Config)[];
    useLocalStorage?: boolean;
    localStorageKey?: string;
    maxLength?: number;
};
export declare type StorageConfig<Config> = {
    keys: (keyof Config)[];
    localStoragePrefix?: string;
};
export declare type Store<Config> = {
    state: Config;
    subscribeTo(keys: (keyof Config)[]): void;
    subscribeToAll(): void;
    saveHistory(): void;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
};
