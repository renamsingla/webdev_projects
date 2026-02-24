import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import useAuth from './context/authProvider'
import DirectChat from './pages/DirectChat'
import GroupChat from './pages/GroupChat'
import { DashboardProvider } from './context/DashboardProvider'
import Chat from './pages/Chat'


const App = () => {
  const {isLoggedin}= useAuth();

  return (
    <Routes>
      <Route path='/signup' element=
      {!isLoggedin? <Signup/> : <Navigate to='/dashboard'/>} />
      <Route path='/login' element=
      {!isLoggedin?<Login/>: <Navigate to='/dashboard'/>} />

      <Route path='/dashboard' element=
       {isLoggedin?(<DashboardProvider>
              <Dashboard />
            </DashboardProvider>): <Navigate to='/login'/>} />
      <Route path='/directChat'element=
       {isLoggedin?(<DashboardProvider>
              <DirectChat />
            </DashboardProvider>): <Navigate to='/login'/>}/>
      <Route path='/chat'element=
       {isLoggedin?(<DashboardProvider>
              <Chat />
            </DashboardProvider>): <Navigate to='/login'/>}/>
        <Route path='/groupChat' element=
       {isLoggedin?(<DashboardProvider>
              <GroupChat />
            </DashboardProvider>): <Navigate to='/login'/>}/>
      <Route path="*" element={<Navigate to='/signup'/>}/>
    </Routes>
  )
}

export default App
