import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import userReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storageLocation from 'redux-persist/lib/storage'
const persistConfig = {
    key: 'root',
    storage: storageLocation,
}

const persistedReduer = persistReducer(persistConfig, combineReducers({ userReducer }))
const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: persistedReduer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

const persisstore = persistStore(store)
export { store, persisstore }
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
