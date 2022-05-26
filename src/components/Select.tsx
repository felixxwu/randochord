import React from 'react'
import { compute, store } from '../utils/store'
import styled from 'styled-components'
import consts from '../utils/consts'

export function Select<K extends keyof typeof store.state, V extends string & typeof store.state[K]>(props: {
    title: string
    storeKey: K
    options: { title: string; value: V }[]
}) {
    return (
        <div>
            <Title>{props.title}</Title>
            <SelectMenu value={store.state[props.storeKey] as V} onChange={handleChange} style={style()}>
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
    background-color: var(--frontPanelColour);
`

const Title = styled.div`
    font-size: 12px;
    margin-left: 4px;
`
