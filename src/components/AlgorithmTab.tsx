import { store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'
import {
    SelectAlgorithm,
    SelectArpSpeed,
    SelectArpType,
    SelectChordRhythm,
    SelectExtensions,
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
                {store.state.algorithm === 'diatonic' && [
                    <SelectKey key={1} />,
                    <SelectMode key={2} />,
                    <SelectExtensions key={3} />,
                ]}
                {store.state.algorithm === 'random' && <SelectRandomNoteCount />}
            </Row>
            <Row>
                <SelectPlayback />
                {store.state.playback === 'chords' && <SelectChordRhythm />}
                {store.state.playback === 'arpeggio' && [<SelectArpType key={1} />, <SelectArpSpeed key={2} />]}
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
