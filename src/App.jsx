import React from 'react'
import {Routes, Route} from 'react-router-dom'

//Sageevan
//Common
import Home from './pages/Home.jsx';

//Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Profile from './pages/auth/Profile.jsx';
import AuthSuccess from './pages/auth/AuthSuccess.jsx';
import EditProfile from './pages/auth/EditProfile.jsx';


const App = () => {
  return (
    <Routes>
      {/** Sageevan */}
      {/** Common */}
      <Route path="/" element={<Home />} />

      {/** Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

    </Routes>
  )
}

export default App
