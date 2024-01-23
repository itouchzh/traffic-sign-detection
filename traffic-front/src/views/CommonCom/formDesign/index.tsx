import FormDesign from '@/components/FormDesign'
import SelectItemContextProvider from '@/context/useSelectItem'
import React from 'react'

export default function FormDesignPage() {
    return (
        <>
            <SelectItemContextProvider>
                <FormDesign />
            </SelectItemContextProvider>
        </>
    )
}
