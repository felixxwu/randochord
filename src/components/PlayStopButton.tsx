import { store } from '../utils/store'
import stop from '../images/stop.svg'
import { playChords, stopChords } from '../helpers/playChords'
import { Button } from './Button'
import React from 'react'
import play from '../images/play.svg'

export function PlayStopButton() {
    if (store.state.currentlyPlayingChord === null) {
        return <Button icon={play} small={false} onClick={playChords} />
    } else {
        return <Button icon={stop} small={false} onClick={stopChords} />
    }
}
