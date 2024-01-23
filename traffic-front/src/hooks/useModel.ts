import { useState } from 'react'

const resolveValue = (e: any) => {
    return e?.target?.value ?? e?.value ?? e
}

export default function useModel<T>(init: T) {
    const [value, setValue] = useState(init)
    const bindValue = {
        value,
        onInput: (e: any) => setValue(resolveValue(e)),
        onChange: (e: any) => setValue(resolveValue(e)),
    }
    return [value, bindValue, setValue] as const
}
