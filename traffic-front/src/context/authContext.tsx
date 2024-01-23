import { useSessionStorage } from '@/hooks/useSessionStorage'
import { createContext, useContext, useMemo, useState } from 'react'

interface AuthContextType {
    user: any
    role?: string
    signin: (user: string, callback: VoidFunction) => void
    signout?: (callback: VoidFunction) => void
}
const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useSessionStorage('user', null)
    const [role, setRole] = useSessionStorage('role', null)
    const signin = (newUser: string, callback?: VoidFunction) => {
        setUser(newUser)
        newUser === 'admin' ? setRole('admin') : setRole('user')
        // return fakeAuthProvider.signin(() => {
        //     setUser(newUser)
        //     // 模拟管理员登录
        //     newUser === 'admin' ? setRole('admin') : setRole('user')
        //     callback()
        // })
    }

    const signout = (callback?: VoidFunction) => {
        setUser(null)
        setRole(null)
        // return fakeAuthProvider.signout(() => {
        //     setUser(null)
        //     setRole(null)
        //     callback()
        // })
    }
    const value = useMemo(() => ({ user, role, signin, signout }), [role, user])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthProvider')
    }
    return context
}
