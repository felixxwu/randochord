import React from 'react'
import consts from '../utils/consts'
import { store } from '../utils/store'

export function Icon(props: { src: string; alt: string; size: 'large' | 'small' }) {
    return <img src={props.src} alt={props.alt} style={style()} />

    function style(): React.CSSProperties {
        return {
            width: props.size === 'large' ? consts.iconLarge : consts.iconSmall,
            filter: `invert(1) brightness(${store.state.theme.textLightness / 100})`,
            transition: `${consts.transition}ms`,
        }
    }
}
