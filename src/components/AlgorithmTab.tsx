import { store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'
import {
    SelectAlgorithm,
    SelectArpSpeed,
    SelectArpType,
    SelectChordLength,
    SelectChordPlaningType,
    SelectChordRhythm,
    SelectExtensions,
    SelectKey,
    SelectMode,
    SelectPlayback,
    SelectRandomNoteCount,
    SelectRandomNoteFilterKey,
} from '../helpers/selectMenus'

export function AlgorithmTab() {
    return (
        <AlgorithmTabDiv>
            <Row>
                <SelectAlgorithm />
                {store.state.algorithm === 'diatonic' && (
                    <>
                        <SelectKey />
                        <SelectMode />
                        <SelectExtensions />
                    </>
                )}
                {store.state.algorithm === 'random' && (
                    <>
                        <SelectRandomNoteCount />
                        <SelectRandomNoteFilterKey />
                        {store.state.randomFilterKey !== '' && <SelectMode />}
                    </>
                )}
                {store.state.algorithm === 'chord planing' && (
                    <>
                        <SelectChordPlaningType />
                    </>
                )}
            </Row>
            <Row>
                {/*<SelectPlayback />*/}
                {/*{store.state.playback === 'chords' && <SelectChordRhythm />}*/}
                {/*{store.state.playback === 'arpeggio' && [<SelectArpType key={1} />, <SelectArpSpeed key={2} />]}*/}
                <SelectChordLength />
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
