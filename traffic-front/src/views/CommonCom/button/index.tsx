import Counter from '@/components/Counter'
import React from 'react'

const Button = () => {
    return (
        <div>
            <Counter />
        </div>
    )
}

export default React.memo(Button)
