import { StorageConfig } from "./types";
export declare function saveToLocalStorage<Config>(key: keyof Config, value: any, storageConfig: StorageConfig<Config>): void;
export declare function getFromLocalStorage<Config>(key: keyof Config, init: any, storageConfig?: StorageConfig<Config>): any;
