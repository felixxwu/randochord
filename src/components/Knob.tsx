import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { useEvents } from '../helpers/useEvents'
import { getTheme } from '../utils/store'
import consts from '../utils/consts'

const dragSensitivity = 0.3
const maxAngle = 130
let currentActiveKnob: SVGSVGElement | null = null
let currentPointerY: number | null = null

export function Knob(props: {
    text: string
    divisions: number
    scrollStep: number
    value: number
    onTurn: (value: number) => void
}) {
    const knobRef = useRef<SVGSVGElement>(null)
    const [value, setValue] = useState(props.value)

    useEvents(window.document.body, [
        { type: 'pointerdown', handler: handlePointerDown },
        { type: 'pointermove', handler: handlePointerMove },
        { type: 'pointerup', handler: handlePointerUp },
        { type: 'pointercancel', handler: handlePointerUp },
        { type: 'pointerleave', handler: handlePointerUp },
    ])

    useEffect(() => {
        if (Math.round(value) === Math.round(props.value)) return
        props.onTurn(Math.round(value))
    }, [value])

    useEffect(() => {
        setTimeout(() => {
            if (Math.round(value) === Math.round(props.value)) return
            setValue(props.value)
        })
    }, [props.value])

    return (
        <KnobDiv>
            <svg style={svgStyle()} onWheel={handleWheel} ref={knobRef} viewBox='0 0 100 100' width='80px'>
                <KnobCircle cx='50' cy='50' r='30' fill={getTheme().knobColour} stroke={getTheme().knobLineColour} />
                <KnobLine x1='50' y1='35' x2='50' y2='22' stroke={getTheme().knobLineColour} />
            </svg>
            {props.text}
        </KnobDiv>
    )

    function svgStyle(): React.CSSProperties {
        return {
            transform: `rotate(${-maxAngle + (Math.round(value) / props.divisions) * (maxAngle * 2)}deg)`,
        }
    }

    function handlePointerDown(this: HTMLElement, event: PointerEvent) {
        if (knobRef.current === null) return
        if (!(event.target instanceof Element)) return
        if (knobRef.current.contains(event.target)) {
            currentActiveKnob = knobRef.current
        }
    }

    function handlePointerMove(this: HTMLElement, event: PointerEvent) {
        if (currentActiveKnob === knobRef.current) {
            if (currentPointerY === null) currentPointerY = event.clientY
            const diff = event.clientY - currentPointerY
            currentPointerY = event.clientY
            addToValue(diff * dragSensitivity * (props.divisions / 100))
        }
    }

    function handlePointerUp(this: HTMLElement) {
        if (currentActiveKnob === knobRef.current) {
            currentActiveKnob = null
            currentPointerY = null
        }
    }

    function handleWheel(event: React.WheelEvent<SVGSVGElement>) {
        addToValue(event.deltaY > 0 ? props.scrollStep : -props.scrollStep)
    }

    function addToValue(diff: number) {
        setValue(v => Math.max(0, Math.min(v - diff, props.divisions)))
    }
}

const KnobDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: s-resize;
    max-height: ${consts.buttonHeight}px;
`

const KnobCircle = styled.circle`
    transition: ${consts.transition}ms;
    stroke-width: 3px;
`

const KnobLine = styled.line`
    stroke-width: 3px;
    stroke-linecap: round;
    transition: ${consts.transition}ms;
`
