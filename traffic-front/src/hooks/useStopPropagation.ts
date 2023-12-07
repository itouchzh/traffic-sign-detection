/**
 * @description stop event propagation
 */
import { useCallback } from 'react'

const useStopPropagation = (callback: Function, ...args: any[]) => {
    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation()
            callback(args)
        },
        [callback]
    )

    return handleClick
}

export default useStopPropagation
