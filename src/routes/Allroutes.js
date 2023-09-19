import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import Github from '../Github'

const Allroutes = () => {
  return (
   <Routes>
     <Route path='/app' element={<App />} />
     <Route path='/' element={<Github />} />
   </Routes>
  )
}

export default Allroutes