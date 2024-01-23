import { decrement, increment, incrementAsync } from '@/state/counter/counterSlice'
import { AppDispatch, RootState } from '@/state/store'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <>
            <div>{count}</div>
            <Button onClick={() => dispatch(increment())}>increment</Button>
            <Button onClick={() => dispatch(decrement())}>decrement</Button>
            <Button onClick={() => dispatch(incrementAsync(10))}>add many</Button>
        </>
    )
}

export default Counter
