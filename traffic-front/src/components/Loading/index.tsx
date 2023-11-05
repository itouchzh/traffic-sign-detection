import React, { useRef, useCallback } from 'react'

export interface SearchProps {
    onSubmit: (val: string) => void
    placeholder?: string
}

const Loading: React.FC = () => {
    return (
        <>
            <div>Hello World</div>
        </>
    )
}

export default React.memo(Loading)
