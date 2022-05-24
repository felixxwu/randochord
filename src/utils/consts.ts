type Theme = {
    bgColour: string
    frontPanelColour: string
    trayColour: string
    textLightness: number
    textColour: string
    toolbarColour: string
    buttonColour: string
    buttonHighlightColour: string
    buttonPlaybackColour: string
    shadowColour: string
    knobColour: string
    knobLineColour: string
    highlight: string
}

export default {
    // colours
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    get lightTheme(): Theme {
        return {
            bgColour: '#e6e6e6',
            frontPanelColour: '#fbfbfb',
            trayColour: '#f2f2f2',
            textLightness: 40,
            get textColour() {
                return `hsl(0, 0%, ${this.textLightness}%)`
            },
            toolbarColour: '#f2f2f2',
            buttonColour: '#d9f7ff',
            shadowColour: 'rgba(0, 0, 0, 0.1)',
            knobColour: '#f2f2f2',
            knobLineColour: '#666666',
            highlight: 'rgba(0, 0, 0, 0.03)',
            buttonHighlightColour: '#fbfbfb',
            buttonPlaybackColour: '#fbfbfb',
        }
    },
    get darkTheme(): Theme {
        return {
            bgColour: '#262626',
            frontPanelColour: '#4d4d4d',
            trayColour: '#404040',
            textLightness: 75,
            get textColour() {
                return `hsl(0, 0%, ${this.textLightness}%)`
            },
            toolbarColour: '#404040',
            buttonColour: '#adc5cc',
            shadowColour: 'rgba(0, 0, 0, 0.4)',
            knobColour: '#404040',
            knobLineColour: '#bfbfbf',
            highlight: 'rgba(0, 0, 0, 0.15)',
            buttonHighlightColour: '#e6e6e6',
            buttonPlaybackColour: '#e6e6e6',
        }
    },

    // lengths
    shadowBlur: 50,
    borderRadius: 10,
    trayPositions: [50, 300],
    iconLarge: 30,
    iconSmall: 15,
    margin: 20,
    buttonWidth: 100,
    buttonHeight: 100,
    smallButtonHeight: 35,
    buttonBorderWidth: 3,
    tabBorderWidth: 1,
    tabHeight: 25,
    maxMobileWidth: 1000,
    titleSpacing: 10,
    get panelHeight() {
        return this.buttonHeight * 2 + this.smallButtonHeight * 2 + this.margin * 5
    },

    // times
    transition: 500,
    shortTransition: 200,
    chordPreviewDuration: 0.3,

    // numbers
    maxMasterVolume: 100,
    minBpm: 50,
    maxBpm: 250,
    chordDuration: 0.9, // % of bar length
    minBodyWidth: 4,
    maxBodyWidth: 8,
    numNotes: 24,
    lowestNote: 36,
}
