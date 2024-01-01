import React from 'react'
import consts from '../utils/consts'
import { compute } from '../utils/store'

export function Icon(props: { src: string; alt: string; size: 'large' | 'small' }) {
  const size = props.size === 'large' ? consts.iconLarge : consts.iconSmall

  return <img src={props.src} alt={props.alt} style={style()} width={size} height={size} />

  function style(): React.CSSProperties {
    return {
      filter: `invert(1) brightness(${compute.theme.textLightness / 100})`,
      transition: `${consts.transition}ms`,
    }
  }
}
