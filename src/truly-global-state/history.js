const defaultKey = 'history';
const emptyHistory = {
    position: 0,
    states: [],
};
let nonPermanentHistory;
function getCurrentState(store, historyConfig) {
    const state = {};
    for (const key in store.state) {
        if (historyConfig && (historyConfig === null || historyConfig === void 0 ? void 0 : historyConfig.keys.includes(key))) {
            state[key] = store.state[key];
        }
    }
    return state;
}
export function saveHistory(store, historyConfig) {
    const history = getOrInitHistory(historyConfig);
    history.states = history.states.slice(0, history.position + 1);
    history.states.push(getCurrentState(store, historyConfig));
    if ((historyConfig === null || historyConfig === void 0 ? void 0 : historyConfig.maxLength) && historyConfig.maxLength < history.states.length) {
        history.states.shift();
    }
    history.position = history.states.length - 1;
    setHistory(historyConfig, history);
}
export function canUndo(historyConfig, history = getOrInitHistory(historyConfig)) {
    return history.position > 0;
}
export function canRedo(historyConfig, history = getOrInitHistory(historyConfig)) {
    return history.position < history.states.length - 1;
}
export function undo(store, historyConfig) {
    const history = getOrInitHistory(historyConfig);
    if (canUndo(historyConfig, history))
        history.position--;
    setHistory(historyConfig, history);
    loadHistory(store, historyConfig);
}
export function redo(store, historyConfig) {
    const history = getOrInitHistory(historyConfig);
    if (canRedo(historyConfig, history))
        history.position++;
    setHistory(historyConfig, history);
    loadHistory(store, historyConfig);
}
export function initHistory(store, historyConfig) {
    const history = getOrInitHistory(historyConfig);
    if (history.states.length <= 0) {
        saveHistory(store, historyConfig);
    }
    else {
        loadHistory(store, historyConfig);
    }
}
function loadHistory(store, historyConfig) {
    const history = getOrInitHistory(historyConfig);
    if (history.states.length <= 0)
        return;
    const state = history.states[history.position];
    for (const key in state) {
        store.state[key] = state[key];
    }
}
function setHistory(historyConfig, history) {
    var _a;
    if (historyConfig.useLocalStorage) {
        localStorage.setItem((_a = historyConfig.localStorageKey) !== null && _a !== void 0 ? _a : defaultKey, JSON.stringify(history));
    }
    else {
        nonPermanentHistory = history;
    }
}
function getOrInitHistory(historyConfig) {
    var _a;
    if (historyConfig.useLocalStorage) {
        const string = localStorage.getItem((_a = historyConfig.localStorageKey) !== null && _a !== void 0 ? _a : defaultKey);
        if (string === null)
            return emptyHistory;
        return JSON.parse(string);
    }
    else {
        if (nonPermanentHistory) {
            return nonPermanentHistory;
        }
        else {
            return emptyHistory;
        }
    }
}
