import React from 'react'
import {Routes, Route} from 'react-router-dom'

//Sageevan
//Common
import Home from './pages/Home.jsx';

//Product
import IndexProduct from './pages/products/IndexProduct.jsx';
import CreateProduct from './pages/products/CreateProduct.jsx';
import ViewProduct from './pages/products/ViewProduct.jsx';
import EditProduct from './pages/products/EditProduct.jsx';
import DeleteProduct from './pages/products/DeleteProduct.jsx';

//Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Profile from './pages/auth/Profile.jsx';
import AuthSuccess from './pages/auth/AuthSuccess.jsx';
import EditProfile from './pages/auth/EditProfile.jsx';

//Isuru

//Gihan

//Dimuthu

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/** Product */}
      <Route path="/product" element={<IndexProduct />} />
      <Route path="/product/create" element={<CreateProduct />} />
      <Route path="/product/detail/:id" element={<ViewProduct />} />
      <Route path="/product/edit/:id" element={<EditProduct />} />
      <Route path="/product/delete/:id" element={<DeleteProduct />} />

      {/** Sageevan */}
      {/** Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

      {/** Isuru */}

      {/** Gihan */}

      {/** Dimuthu */}

      
    </Routes>
  )
}

export default App
