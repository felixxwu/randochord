import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import { store } from '../utils/store'

export function Menu(props: { menu: { text: string; callback: () => void }[]; closeMenu: () => void }) {
    const [menuHeight, setMenuHeight] = useState(0)
    const [transition, setTransition] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setMenuHeight(500)
            setTransition(consts.transition)
        }, 50)
    }, [])

    const menuItems = (props.menu ?? []).map((item, index) => (
        <MenuItem onClick={item.callback} key={index}>
            {item.text}
        </MenuItem>
    ))

    return (
        <MenuCloser onClick={handleClose}>
            <MenuDiv style={style()}>{menuItems}</MenuDiv>
        </MenuCloser>
    )

    function style(): React.CSSProperties {
        return {
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${store.state.theme.shadowColour}`,
            maxHeight: `${menuHeight}px`,
            transition: `${transition}ms linear`,
            backgroundColor: store.state.theme.frontPanelColour,
        }
    }

    function handleClose() {
        setMenuHeight(0)
        setTransition(0)
        props.closeMenu()
    }
}

const MenuCloser = styled.div`
    position: fixed;
    z-index: 1;
    width: 200vw;
    height: 200vh;
    transform: translateY(-100vh) translateX(-100vw);
`

const MenuDiv = styled.div`
    width: max-content;
    transform: translateY(calc(100vh - 100% - ${consts.margin}px)) translateX(100vw);
    border-radius: ${consts.borderRadius}px;
    cursor: pointer;
    overflow: hidden;
`

const MenuItem = styled.div`
    padding: ${consts.margin}px;
    min-width: 100px;
    box-sizing: border-box;

    &:hover {
        background-color: var(--highlight);
    }
`
