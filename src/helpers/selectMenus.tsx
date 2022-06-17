import { Select } from '../components/Select'
import { getNoteLabelAndNames } from './getNoteName'

export function SelectAlgorithm() {
    return (
        <Select
            title={'Algorithm'}
            storeKey={'algorithm'}
            options={[
                { title: 'Diatonic', value: 'diatonic' },
                // { title: 'Chord Planing', value: 'chord planing' },
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
            title={'Note count'}
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
            title={'Filter notes'}
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
                { title: 'Full Bar', value: 'full' },
                { title: 'Twice Per Bar', value: 'twice' },
                { title: '4x Per Bar', value: 'four' },
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
