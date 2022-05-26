import { store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'
import {
    SelectAlgorithm,
    SelectArpSpeed,
    SelectArpType,
    SelectChordRhythm,
    SelectKey,
    SelectMode,
    SelectPlayback,
    SelectRandomNoteCount,
} from '../helpers/selectMenus'

export function AlgorithmTab() {
    return (
        <AlgorithmTabDiv>
            <Row>
                <SelectAlgorithm />
                {store.state.algorithm === 'diatonic' && [<SelectKey />, <SelectMode />]}
                {store.state.algorithm === 'random' && <SelectRandomNoteCount />}
            </Row>
            <Row>
                <SelectPlayback />
                {store.state.playback === 'chords' && <SelectChordRhythm />}
                {store.state.playback === 'arpeggio' && [<SelectArpType />, <SelectArpSpeed />]}
            </Row>
        </AlgorithmTabDiv>
    )
}

const AlgorithmTabDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${consts.margin}px;
    height: 100%;
    padding: 0 ${consts.margin}px;
`

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${consts.margin}px;
    justify-content: center;
    align-items: center;
`
