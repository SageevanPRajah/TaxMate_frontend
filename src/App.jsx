import React from 'react'
import {Routes, Route} from 'react-router-dom'

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

//Income
import CreateIncome from './pages/income/CreateIncome.jsx';
import IndexIncome from './pages/income/IndexIncome.jsx';
import EditIncome from './pages/income/EditIncome.jsx';
import DeleteIncome from './pages/income/DeleteIncome.jsx';
import ViewIncome from './pages/income/ViewIncome.jsx';


//Expense
import CreateExpense from './pages/expense/CreateExpense.jsx';
import IndexExpense from './pages/expense/IndexExpense.jsx';
import EditExpense from './pages/expense/EditExpense.jsx';
import DeleteExpense from './pages/expense/DeleteExpense.jsx';
import ViewExpense from './pages/expense/ViewExpense.jsx';


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
     

      {/** Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

      {/** Income */}
      <Route path="/income/create" element={<CreateIncome />} />
      <Route path="/income" element={<IndexIncome />} />
      <Route path="/income/edit/:id" element={<EditIncome />} />
      <Route path="/income/delete/:id" element={<DeleteIncome />} />
      <Route path="/income/detail/:id" element={<ViewIncome/>} />

      {/** Expense */}
      <Route path="/expense/create" element={<CreateExpense />} />
      <Route path="/expense" element={<IndexExpense />} />
      <Route path="/expense/edit/:id" element={<EditExpense />} />
      <Route path="/expense/delete/:id" element={<DeleteExpense />} />
      <Route path="/expense/detail/:id" element={<ViewExpense/>} />
      
      
    </Routes>
  )
}

export default App
