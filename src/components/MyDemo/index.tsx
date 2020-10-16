import React, { useState } from 'react'
import './style/MyDemo.module.scss'

const MyDemo = () => {
  const [count, setCount] = useState(0)
  const handleCount = () => {
    setCount(count + 1)
  }
  return (
    <div className='d'>
      MyDemo:{count}
      <button onClick={handleCount}>+1</button>
    </div>
  )
}
export { MyDemo }
