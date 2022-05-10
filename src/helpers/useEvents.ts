import { useEffect } from 'react'

export function useEvents(
    target: HTMLElement,
    events: {
        type: keyof HTMLElementEventMap
        handler: (this: HTMLElement, ev: any) => any
    }[]
) {
    useEffect(() => {
        for (const event of events) {
            target.addEventListener(event.type, event.handler)
        }

        return () => {
            for (const event of events) {
                target.removeEventListener(event.type, event.handler)
            }
        }
    }, [])
}
