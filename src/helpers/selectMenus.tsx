import { Select } from '../components/Select'
import { getNoteLabelAndNames } from './getNoteName'

export function SelectAlgorithm() {
    return (
        <Select
            title={'Algorithm'}
            storeKey={'algorithm'}
            options={[
                { title: 'Diatonic', value: 'diatonic' },
                { title: 'Chord Planing', value: 'chord planing' },
                // { title: 'AI (n-gram)', value: 'ngram' },
                { title: 'Random', value: 'random' },
            ]}
        />
    )
}

export function SelectKey() {
    return (
        <Select
            title={'Key'}
            storeKey={'diatonicKey'}
            options={getNoteLabelAndNames().map(x => ({ title: x.label, value: x.name }))}
        />
    )
}

export function SelectMode() {
    return (
        <Select
            title={'Mode'}
            storeKey={'diatonicMode'}
            options={[
                { title: 'Major (I)', value: '1' },
                { title: 'Minor (VI)', value: '6' },
                { title: 'Dorian (II)', value: '2' },
                { title: 'Phrygian (III)', value: '3' },
                { title: 'Lydian (IV)', value: '4' },
                { title: 'Mixolydian (V)', value: '5' },
                { title: 'Locrian (VII)', value: '7' },
            ]}
        />
    )
}

export function SelectRandomNoteCount() {
    return (
        <Select
            title={'Note Count'}
            storeKey={'randomNoteCount'}
            options={[
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
                { title: '6', value: '6' },
            ]}
        />
    )
}

export function SelectRandomNoteFilterKey() {
    return (
        <Select
            title={'Filter Notes'}
            storeKey={'randomFilterKey'}
            options={[
                { title: 'No filter', value: '' },
                ...getNoteLabelAndNames().map(x => ({ title: x.label, value: x.name })),
            ]}
        />
    )
}

export function SelectPlayback() {
    return (
        <Select
            title={'Playback'}
            storeKey={'playback'}
            options={[
                { title: 'Chord', value: 'chords' },
                { title: 'Arpeggio', value: 'arpeggio' },
            ]}
        />
    )
}

export function SelectChordRhythm() {
    return (
        <Select
            title={'Rhythm'}
            storeKey={'chordRhythm'}
            options={[
                { title: 'Every 4 Beats', value: 'every4' },
                { title: 'Every 2 Beats', value: 'every2' },
                { title: 'Every Beat', value: 'every' },
                { title: 'Twice Every Beat', value: 'twice every' },
                { title: 'Dotted', value: 'dotted' },
            ]}
        />
    )
}

export function SelectArpType() {
    return (
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
    )
}

export function SelectArpSpeed() {
    return (
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
    )
}

export function SelectExtensions() {
    return (
        <Select
            title={'Extensions'}
            storeKey={'extensions'}
            options={[
                { title: 'None', value: 'none' },
                { title: 'Simple', value: 'simple' },
                { title: 'Complex', value: 'complex' },
                // { title: 'Complex with Alterations', value: 'complex+alterations' },
            ]}
        />
    )
}

export function SelectChordPlaningType() {
    return (
        <Select
            title={'Chord'}
            storeKey={'chordPlaningType'}
            options={[
                { title: 'Copy First', value: 'copy' },
                { title: 'Minor', value: 'min' },
                { title: 'Minor 7th', value: 'min7' },
                { title: 'Minor 9th', value: 'min9' },
                { title: 'Minor 11th', value: 'min11' },
                { title: 'Major', value: 'maj' },
                { title: 'Major 7th', value: 'maj7' },
                { title: 'Major 9th', value: 'maj9' },
                { title: 'Major 11th', value: 'maj11' },
            ]}
        />
    )
}

export function SelectChordLength() {
    return (
        <Select
            title={'Chord Length'}
            storeKey={'chordLength'}
            options={[
                { title: '1 Beat', value: '1' },
                { title: '2 Beats', value: '2' },
                { title: '3 Beats', value: '3' },
                { title: '4 Beats', value: '4' },
                { title: '5 Beats', value: '5' },
                { title: '6 Beats', value: '6' },
                { title: '7 Beats', value: '7' },
                { title: '8 Beats', value: '8' },
            ]}
        />
    )
}
