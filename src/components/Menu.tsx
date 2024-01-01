import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'
import { getThemeVar } from '../utils/theme'
import { MenuList } from '../utils/types'

export function Menu(props: { menu: MenuList; closeMenu: () => void; position: { x: number; y: number } }) {
  const [menuHeight, setMenuHeight] = useState(0)
  const [transition, setTransition] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setMenuHeight(500)
      setTransition(consts.transition)
    }, 50)
  }, [])

  return (
    <MenuCloser onClick={handleClose} onContextMenu={handleContextMenu}>
      <MenuDiv style={style()}>
        {(props.menu ?? []).map(
          (item, index) =>
            item !== null && (
              <MenuItem onClick={item.callback} key={index}>
                {item.text}
              </MenuItem>
            )
        )}
      </MenuDiv>
    </MenuCloser>
  )

  function style(): React.CSSProperties {
    return {
      boxShadow: `0 0 ${consts.shadowBlur}px 0 ${compute.theme.shadowColour}`,
      maxHeight: `${menuHeight}px`,
      transition: `${transition}ms linear`,
      backgroundColor: compute.theme.frontPanelColour,
      left: `${props.position.x}px`,
      top: `${props.position.y}px`,
    }
  }

  function handleClose() {
    setMenuHeight(0)
    setTransition(0)
    props.closeMenu()
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault()
    handleClose()
  }
}

const MenuCloser = styled.div`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
`

const MenuDiv = styled.div`
  position: fixed;
  width: max-content;
  border-radius: ${consts.borderRadius}px;
  cursor: pointer;
  overflow: hidden;
`

const MenuItem = styled.div`
  padding: ${consts.margin / 2}px;
  min-width: 100px;
  box-sizing: border-box;

  &:hover {
    background-color: ${getThemeVar('highlight')};
  }
`
