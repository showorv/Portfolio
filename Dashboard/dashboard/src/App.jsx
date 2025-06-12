import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login'
import { ForgotPass } from './pages/ForgotPass'
import { ResetPass } from './pages/ResetPass'
import { ManageTimeline } from './pages/ManageTimeline'
import { ManageSkill } from './pages/ManageSkill'
import { ManageProject } from './pages/ManageProject'
import { SingleProject } from './pages/SingleProject'
import { UpdateProject } from './pages/UpdateProject'
import NotFound from './pages/NotFound' 
import {Toaster} from "sonner"

function App() {
  return(
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/password/forgot' element={<ForgotPass/>}/>
        <Route path='/password/reset/:token' element={<ResetPass/>}/>
        <Route path='/manage/timeline' element={<ManageTimeline/>}/>
        <Route path='/manage/skill' element={<ManageSkill/>}/>
        <Route path='/manage/project' element={<ManageProject/>}/>
        <Route path='/view/project/:id' element={<SingleProject/>}/>
        <Route path='/update/project/:id' element={<UpdateProject/>}/>

        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster position='top-right'/>
   </BrowserRouter>
  )
}

export default App
