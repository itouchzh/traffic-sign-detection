// useClickAction.ts
import { useCallback } from 'react';

type ActionCallback = () => void;

const useClickAction = (callback: ActionCallback) => {
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
            e.stopPropagation();
            callback();
        },
        [callback]
    );

    return handleClick;
};

export default useClickAction;
