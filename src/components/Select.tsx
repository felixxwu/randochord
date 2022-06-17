import React from 'react'
import { compute, store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'
import { getThemeVar } from '../utils/theme'

export function Select<K extends keyof typeof store.state, V extends string & typeof store.state[K]>(props: {
    title: string
    storeKey: K
    options: { title: string; value: V }[]
}) {
    return (
        <div>
            <Title>{props.title}</Title>
            <SelectMenu
                value={store.state[props.storeKey] as V}
                onChange={handleChange}
                onWheel={handleWheel}
                style={style()}
            >
                {props.options.map((option, i) => (
                    <option value={option.value} key={i}>
                        {option.title}
                    </option>
                ))}
            </SelectMenu>
        </div>
    )

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const option = props.options.find(option => option.value === event.target.value)
        if (option === undefined) return
        store.state[props.storeKey] = option.value
    }

    function handleWheel(event: React.WheelEvent<HTMLSelectElement>) {
        const index = props.options.findIndex(option => option.value === store.state[props.storeKey])
        try {
            // up
            if (event.deltaY < 0) {
                store.state[props.storeKey] = props.options[index - 1].value
            }
            // down
            if (event.deltaY > 0) {
                store.state[props.storeKey] = props.options[index + 1].value
            }
        } catch (e) {}
    }

    function style(): React.CSSProperties {
        return {
            color: compute.theme.textColour,
        }
    }
}

const SelectMenu = styled.select`
    height: ${consts.smallButtonHeight}px;
    outline: none;
    border: none;
    border-radius: ${consts.midiNoteBorderRadius}px;
    cursor: pointer;
    font-size: 14px;
    background-color: ${getThemeVar('frontPanelColour')};
    min-width: 100%;
`

const Title = styled.div`
    font-size: 12px;
    margin-left: 4px;
`
