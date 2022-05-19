type Theme = {
    bgColour: string
    frontPanelColour: string
    trayColour: string
    textLightness: number
    textColour: string
    toolbarColour: string
    buttonColour: string
    shadowColour: string
    knobColour: string
    knobLineColour: string
}

export default {
    // colours
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    get lightTheme(): Theme {
        return {
            bgColour: '#ededed',
            frontPanelColour: '#fbfbfb',
            trayColour: '#fff0f0',
            textLightness: 40,
            get textColour() {
                return `hsl(0, 0%, ${this.textLightness}%)`
            },
            toolbarColour: '#fff0f0',
            buttonColour: '#e6f9ff',
            shadowColour: 'rgba(0, 0, 0, 0.1)',
            knobColour: '#ccb8b8',
            knobLineColour: '#ffffff',
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
            toolbarColour: '#454545',
            buttonColour: '#9bc1cc',
            shadowColour: 'rgba(0, 0, 0, 0.4)',
            knobColour: '#807373',
            knobLineColour: '#454545',
        }
    },

    // lengths
    shadowBlur: 50,
    borderRadius: 10,
    trayPositions: [50, 200],
    iconLarge: 30,
    iconSmall: 15,
    margin: 20,
    buttonWidth: 100,
    buttonHeight: 100,
    smallButtonHeight: 35,
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
    maxBpm: 300,
    chordDuration: 0.9, // % of bar length
    minBodyWidth: 4,
    maxBodyWidth: 8,
}
