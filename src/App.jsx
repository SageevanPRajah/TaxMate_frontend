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

//assets
import IndexAssets  from './pages/assets/IndexAssets.jsx';  
import CreateAssets from './pages/assets/CreateAssets.jsx';
import ViewAssets from './pages/assets/ViewAssets.jsx';
import EditAssets from './pages/assets/EditAssets.jsx';


// liabilities
import IndexLiabilities from './pages/liabilities/IndexLiabilities.jsx';
import CreateLiabilities from './pages/liabilities/CreateLiability.jsx';
import ViewLiabilities from './pages/liabilities/ViewLiabilities.jsx';
import EditLiabilities from './pages/liabilities/EditLiabilities.jsx';
import DeleteLiabilities from './pages/liabilities/DeleteLiabilities.jsx';



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
       
      {/** Assets */}
      <Route path="/assets" element={<IndexAssets />} />
      <Route path="/assets/create" element={<CreateAssets />} />
      <Route path="/assets/detail/:id" element={<ViewAssets />} />
      <Route path="/assets/edit/:id" element={<EditAssets />} />

       {/** Liabilities */}    
      <Route path="/liabilities" element={<IndexLiabilities />} />
      <Route path="/liabilities/create" element={<CreateLiabilities />} />
      { <Route path="/liabilities/detail/:id" element={<ViewLiabilities />} />}
      <Route path="/liabilities/edit/:id" element={<EditLiabilities />} />
      { <Route path="/liabilities/delete/:id" element={<DeleteLiabilities />} /> }

      
    </Routes>
  )
}

export default App


