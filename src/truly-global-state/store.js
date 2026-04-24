import { useState } from 'react';
import { saveHistory as _saveHistory, undo as _undo, redo as _redo, canUndo as _canUndo, canRedo as _canRedo, initHistory } from './history';
import { getFromLocalStorage, saveToLocalStorage } from './storage';
const proxyObject = {};
const subscribers = {};
const storeNotInitialised = 'Store was not initialised before use! Make sure to call store.init() in your top-level component.';
const historyNotInialised = 'Undo/redo features were used without enabling them, please configure the store to use these features.';
function constructNewObject(target, key, value) {
    if (Array.isArray(target)) {
        const newObject = target.slice();
        newObject[key] = value;
        return newObject;
    }
    else {
        return Object.assign(Object.assign({}, target), { [key]: value });
    }
}
function reactiveObject(object, setter) {
    if (typeof object === 'object' && object !== null) {
        return new Proxy(object, {
            get(_, key) {
                return reactiveObject(object[key], (value) => {
                    const newObject = constructNewObject(object, key, value);
                    object = newObject;
                    setter(newObject);
                });
            },
            set(_, key, value) {
                const newObject = constructNewObject(object, key, value);
                object = newObject;
                setter(newObject);
                return true;
            },
        });
    }
    else {
        return object;
    }
}
export function createStore(config, features) {
    for (const key of Object.keys(config)) {
        const initValue = getFromLocalStorage(key, config[key], features === null || features === void 0 ? void 0 : features.localStorage);
        subscribers[key] = [];
        if (typeof initValue === 'function') {
            proxyObject[key] = { get: initValue, set: () => { } };
        }
        else {
            const setValue = (v) => {
                proxyObject[key].get = v;
                for (const updateFunction of subscribers[key]) {
                    updateFunction((count) => count + 1);
                }
            };
            proxyObject[key] = { get: initValue, set: setValue };
        }
    }
    const store = {
        state: new Proxy(config, {
            get(_, key) {
                const storeValue = proxyObject[key];
                if (storeValue === undefined)
                    throw new Error(`${storeNotInitialised} (Trying to get ${key})`);
                return reactiveObject(storeValue.get, storeValue.set);
            },
            set(_, key, value) {
                const storeValue = proxyObject[key];
                if (storeValue === undefined)
                    throw new Error(`${storeNotInitialised} (Trying to set ${key})`);
                proxyObject[key].set(value);
                if (features === null || features === void 0 ? void 0 : features.localStorage)
                    saveToLocalStorage(key, value, features === null || features === void 0 ? void 0 : features.localStorage);
                return true;
            },
        }),
        subscribeTo(keys) {
            for (const key of keys) {
                const [_, setCount] = useState(0);
                if (!subscribers[key].includes(setCount)) {
                    subscribers[key].push(setCount);
                }
            }
        },
        subscribeToAll() {
            this.subscribeTo(Object.keys(config));
        },
        saveHistory() {
            if (features === null || features === void 0 ? void 0 : features.undoRedo) {
                _saveHistory(store, features === null || features === void 0 ? void 0 : features.undoRedo);
            }
            else {
                console.error(historyNotInialised);
            }
        },
        undo() {
            if (features === null || features === void 0 ? void 0 : features.undoRedo) {
                _undo(store, features === null || features === void 0 ? void 0 : features.undoRedo);
            }
            else {
                console.error(historyNotInialised);
            }
        },
        redo() {
            if (features === null || features === void 0 ? void 0 : features.undoRedo) {
                _redo(store, features === null || features === void 0 ? void 0 : features.undoRedo);
            }
            else {
                console.error(historyNotInialised);
            }
        },
        canUndo() {
            if (features === null || features === void 0 ? void 0 : features.undoRedo) {
                return _canUndo(features === null || features === void 0 ? void 0 : features.undoRedo);
            }
            else {
                console.error(historyNotInialised);
                return false;
            }
        },
        canRedo() {
            if (features === null || features === void 0 ? void 0 : features.undoRedo) {
                return _canRedo(features === null || features === void 0 ? void 0 : features.undoRedo);
            }
            else {
                console.error(historyNotInialised);
                return false;
            }
        },
    };
    if (features === null || features === void 0 ? void 0 : features.undoRedo) {
        initHistory(store, features === null || features === void 0 ? void 0 : features.undoRedo);
    }
    return store;
}
