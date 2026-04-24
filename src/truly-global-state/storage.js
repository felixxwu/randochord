export function saveToLocalStorage(key, value, storageConfig) {
    var _a;
    if (storageConfig.keys.includes(key)) {
        localStorage.setItem(((_a = storageConfig.localStoragePrefix) !== null && _a !== void 0 ? _a : '') + key, JSON.stringify(value));
    }
}
export function getFromLocalStorage(key, init, storageConfig) {
    var _a;
    if (!storageConfig)
        return init;
    if (storageConfig.keys.includes(key)) {
        const valueString = localStorage.getItem(((_a = storageConfig.localStoragePrefix) !== null && _a !== void 0 ? _a : '') + key);
        if (valueString !== null) {
            return JSON.parse(valueString);
        }
    }
    return init;
}
