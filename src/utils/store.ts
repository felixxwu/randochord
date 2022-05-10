import { createStore } from 'truly-global-state'
import consts from './consts'

export const store = createStore({
    trayOpen: false,
    getTrayPosition() {
        return consts.trayPositions[this.trayOpen ? 1 : 0]
    },
})
