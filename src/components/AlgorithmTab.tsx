import { Select } from './Select'
import { store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'
import { getNoteLabelAndNames } from '../helpers/getNoteName'

export function AlgorithmTab() {
    return (
        <AlgorithmTabDiv>
            <Row>
                <Select
                    title={'Algorithm'}
                    storeKey={'algorithm'}
                    options={[
                        { title: 'Diatonic', value: 'diatonic' },
                        { title: 'Chord Planing', value: 'chord planing' },
                        { title: 'AI (n-gram)', value: 'ngram' },
                        { title: 'Pure Random', value: 'random' },
                    ]}
                />
                {store.state.algorithm === 'diatonic' && (
                    <>
                        <Select
                            title={'Key'}
                            storeKey={'diatonicKey'}
                            options={getNoteLabelAndNames().map(x => ({ title: x.label, value: x.name }))}
                        />
                        <Select
                            title={'Mode'}
                            storeKey={'diatonicMode'}
                            options={[
                                { title: 'Minor', value: 'min' },
                                { title: 'Major', value: 'maj' },
                            ]}
                        />
                    </>
                )}
            </Row>
            <Row>
                <Select
                    title={'Playback'}
                    storeKey={'playback'}
                    options={[
                        { title: 'Chord', value: 'chords' },
                        { title: 'Arpeggio', value: 'arpeggio' },
                    ]}
                />
                {store.state.playback === 'chords' && (
                    <Select
                        title={'Rhythm'}
                        storeKey={'chordRhythm'}
                        options={[
                            { title: 'Full Bar', value: 'full' },
                            { title: 'Twice Per Bar', value: 'twice' },
                            { title: '4x Per Bar', value: 'four' },
                            { title: 'Dotted', value: 'dotted' },
                        ]}
                    />
                )}
                {store.state.playback === 'arpeggio' && (
                    <>
                        <Select
                            title={'Pattern'}
                            storeKey={'arpeggioType'}
                            options={[
                                { title: 'Rise', value: 'rise' },
                                { title: 'Fall', value: 'fall' },
                                { title: 'Rise & Fall', value: 'rise and fall' },
                                { title: 'Random', value: 'random' },
                            ]}
                        />
                        <Select
                            title={'Note Length'}
                            storeKey={'arpeggioSpeed'}
                            options={[
                                { title: 'Quarter', value: 'quarter' },
                                { title: 'Eighth', value: 'eighth' },
                                { title: 'Sixteenth', value: 'sixteenth' },
                                { title: 'Triplets', value: 'triplet' },
                            ]}
                        />
                    </>
                )}
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
