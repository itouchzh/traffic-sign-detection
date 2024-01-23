import AuthContextProvider from './authContext'
import SelectItemContextProvider from './useSelectItem'

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    return (
        // <AuthContextProvider>
        //     <SelectItemContextProvider>{children}</SelectItemContextProvider>
        // </AuthContextProvider>
        <SelectItemContextProvider>{children}</SelectItemContextProvider>
    )
}
