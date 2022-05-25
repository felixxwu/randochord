import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import consts from '../utils/consts'
import { compute } from '../utils/store'
import { Menu } from './Menu'

export function Button(props: {
    text?: string
    icon?: string
    onDrag?: (amount: number) => void
    onClick?: () => void
    small: boolean
    onPointerDown?: () => void
    onPointerUp?: () => void
    highlighted?: boolean
    outline?: boolean
    menu?: { text: string; callback: () => void }[]
    title?: string
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [textScale, setTextScale] = useState(1)
    const text = useRef<HTMLDivElement>(null)

    useEffect(() => {
        updateScale()
    }, [props])

    return (
        <div>
            {menuOpen && props.menu ? <Menu menu={props.menu} closeMenu={closeMenu} /> : null}
            <ButtonDiv
                onClick={props.onClick}
                style={style()}
                onPointerDown={props.onPointerDown}
                onPointerUp={props.onPointerUp}
                onPointerCancel={props.onPointerUp}
                onPointerLeave={props.onPointerUp}
                onPointerOut={props.onPointerUp}
                onContextMenu={handleContextMenu}
                title={props.title}
            >
                {content()}
            </ButtonDiv>
        </div>
    )

    function content() {
        return props.icon ? (
            <img
                src={props.icon}
                alt='icon'
                draggable={false}
                width={props.small ? consts.iconSmall : consts.iconLarge}
                style={{ filter: `invert(1) brightness(${consts.lightTheme.textLightness / 100})` }}
            />
        ) : (
            <span style={{ transform: `scale(${textScale})` }} ref={text}>
                {props.text}
            </span>
        )
    }

    function style(): React.CSSProperties {
        return {
            backgroundColor: props.highlighted ? compute.theme.buttonPlaybackColour : undefined,
            height: `${props.small ? consts.smallButtonHeight : consts.buttonHeight}px`,
            boxShadow: `inset 0 0 20px 0 ${compute.theme.shadowColour}`,
            outline: props.outline ? `dashed ${consts.buttonBorderWidth}px` : 'none',
        }
    }

    function handleContextMenu(event: React.MouseEvent) {
        if (props.menu && props.menu.length > 0) {
            event.preventDefault()
            setMenuOpen(true)
            return false
        }
    }

    function closeMenu() {
        setMenuOpen(false)
    }

    function updateScale() {
        if (text.current === null) return
        const newScale = consts.buttonWidth / (text.current.clientWidth + consts.margin)
        setTextScale(Math.min(newScale, 1))
    }
}

const ButtonDiv = styled.div`
    color: ${consts.lightTheme.textColour};
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${consts.buttonWidth}px;
    border-radius: ${consts.borderRadius}px;
    cursor: pointer;
    transition: ${consts.shortTransition}ms;
    overflow: hidden;
    background-color: var(--buttonColour);
    box-sizing: border-box;
    outline-offset: -${consts.buttonBorderWidth}px;

    &:hover {
        background-color: var(--buttonHighlightColour);
    }
`
