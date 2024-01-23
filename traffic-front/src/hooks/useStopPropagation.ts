/**
 * @description stop event propagation
 */
import { useCallback } from 'react'

type CallbackFunction = (...args: any[]) => void

const useStopPropagation = (callback: CallbackFunction) => {
    const handleClick = useCallback(
        (...args: any[]) =>
            (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation()
                if (args.length > 0) {
                    callback(...args)
                } else {
                    callback()
                }
            },
        [callback]
    )

    return handleClick
}

export default useStopPropagation
