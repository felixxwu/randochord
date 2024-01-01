// prettier-ignore
const themes = {
    textLightness:         { light: 40,                    dark: 75 },
    bgColour:              { light: 'hsl(0,0%,90%)',       dark: 'hsl(0,0%,15%)' },
    frontPanelColour:      { light: 'hsl(0,0%,98%)',       dark: 'hsl(0,0%,30%)' },
    trayColour:            { light: 'hsl(0,0%,95%)',       dark: 'hsl(0,0%,25%)' },
    textColour:            { light: 'hsl(0,0%,40%)',       dark: 'hsl(0,0%,75%)' },
    toolbarColour:         { light: 'hsl(0,0%,95%)',       dark: 'hsl(0,0%,25%)' },
    buttonColour:          { light: '#d9f7ff',             dark: '#b8d1d9' },
    shadowColour:          { light: 'rgba(0, 0, 0, 0.1)',  dark: 'rgba(0, 0, 0, 0.4)' },
    knobColour:            { light: 'hsl(0,0%,95%)',       dark: 'hsl(0,0%,25%)' },
    knobLineColour:        { light: 'hsl(0,0%,40%)',       dark: 'hsl(0,0%,75%)' },
    highlight:             { light: 'rgba(0, 0, 0, 0.03)', dark: 'rgba(0, 0, 0, 0.15)' },
    buttonHighlightColour: { light: 'hsl(0,0%,98%)',       dark: 'hsl(0,0%,90%)' },
    buttonPlaybackColour:  { light: 'hsl(0,0%,98%)',       dark: 'hsl(0,0%,90%)' },
    blackKey:              { light: 'hsl(0,0%,40%)',       dark: 'hsl(0,0%,25%)' },
    whiteKey:              { light: 'hsl(0,0%,95%)',       dark: 'hsl(0,0%,75%)' },
    keyboardOutline:       { light: 'hsl(0,0%,40%)',       dark: 'hsl(0,0%,75%)' },
    pianoRollWhite:        { light: 'hsl(0,0%,95%)',       dark: 'hsl(0,0%,25%)' },
    pianoRollBlack:        { light: 'hsl(0,0%,90%)',       dark: 'hsl(0,0%,20%)' },
    midiNoteColour:        { light: '#97bf9f',             dark: '#b5e6be' },
} as const

type Theme<T extends 'dark' | 'light'> = { [key in keyof typeof themes]: typeof themes[key][T] }

export function getTheme<T extends 'dark' | 'light'>(type: T): Theme<T> {
  const theme = {} as any
  for (const key in themes) {
    theme[key] = themes[key as keyof typeof themes][type]
  }
  return theme
}

export function getThemeVar(name: keyof typeof themes) {
  return `var(--${name})`
}
