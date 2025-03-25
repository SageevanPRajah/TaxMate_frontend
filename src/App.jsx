
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

//taxReliefCalculation
import TaxReliefCalculation from './pages/tax_relief_and_calculation/taxReliefCalculation.jsx';
import AddTaxRelief from './pages/tax_relief_and_calculation/addTaxrelief.jsx';
import EditTaxRelief from './pages/tax_relief_and_calculation/editTaxRelife.jsx';
import DeleteTaxRelief from './pages/tax_relief_and_calculation/deleteTaxRelief.jsx';

//TaxRate
import AddTaxRate from './pages/taxRate/addTaxRate.jsx';
import EditTaxRate from './pages/taxRate/editTaxRate.jsx';
import DeleteTaxRate from './pages/taxRate/deleteTaxRate.jsx';

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


      {/** taxReliefCalculation */}
      <Route path="/taxRelief" element={<TaxReliefCalculation />} />
      <Route path="/taxRelief/addTaxRelief" element={<AddTaxRelief />} />
      <Route path="/taxRelief/editTaxRelief/:id" element={<EditTaxRelief />} />
      <Route path="/taxRelief/deleteTaxRelief/:id" element={<DeleteTaxRelief />} />
      
      {/** TaxRate */}
      <Route path="/taxRelief/addTaxRate" element={<AddTaxRate />} />   
      <Route path="/taxRelief/editTaxRate/:id" element={<EditTaxRate />} />
      <Route path="/taxRelief/deleteTaxRate/:id" element={<DeleteTaxRate />} />

    </Routes>
  )
}

export default App
