import { getTheme } from './theme'

export default {
    // colours
    lightTheme: getTheme('light'),
    darkTheme: getTheme('dark'),

    // lengths
    shadowBlur: 50,
    borderRadius: 10,
    midiNoteBorderRadius: 3,
    trayPositions: [40, 350],
    iconLarge: 30,
    iconSmall: 15,
    margin: 16,
    buttonWidth: 100,
    buttonHeight: 100,
    smallButtonHeight: 30,
    buttonBorderWidth: 3,
    tabBorderWidth: 1,
    tabHeight: 25,
    titleSpacing: 10,
    spinnerWidth: 70,
    get panelHeight() {
        return this.buttonHeight * 2 + this.smallButtonHeight * 2 + this.margin * 5
    },
    get trayHeight() {
        return this.trayPositions[1] - this.trayPositions[0]
    },
    get tabSwitcherHeight() {
        return this.tabHeight + 2 * this.margin
    },
    get trayContentHeight() {
        return this.trayHeight - this.tabSwitcherHeight
    },
    get maxPanelWidth() {
        return 8 * (this.buttonWidth + this.margin) + this.margin
    },

    // times
    transition: 500,
    shortTransition: 200,
    chordPreviewDuration: 0.2,

    // numbers
    maxMasterVolume: 100,
    minBpm: 50,
    maxBpm: 250,
    chordDuration: 0.95, // % of bar length
    minBodyWidth: 4,
    maxBodyWidth: 8,
    numNotes: 24,
    lowestNote: 36,
    defaultBpm: 120,
    metronomeVolume: 0.5, // % of master volume
    metronomeUpbeatVolume: 0.5, // & of metronome volume
}
