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

//Isuru
//taxReliefCalculation
import TaxReliefCalculation from './pages/tax_relief_and_calculation/taxReliefCalculation.jsx';
import AddTaxRelief from './pages/tax_relief_and_calculation/addTaxrelief.jsx';
import EditTaxRelief from './pages/tax_relief_and_calculation/editTaxRelife.jsx';
import DeleteTaxRelief from './pages/tax_relief_and_calculation/deleteTaxRelief.jsx';

//TaxRate
import AddTaxRate from './pages/taxRate/addTaxRate.jsx';
import EditTaxRate from './pages/taxRate/editTaxRate.jsx';
import DeleteTaxRate from './pages/taxRate/deleteTaxRate.jsx';

//Gihan  
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

//Dimuthu 
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
      {/** Sageevan */}
      <Route path="/" element={<Home />} />
        
      {/** Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />


      {/** Isuru */}
      {/** taxReliefCalculation */}
      <Route path="/taxRelief" element={<TaxReliefCalculation />} />
      <Route path="/taxRelief/addTaxRelief" element={<AddTaxRelief />} />
      <Route path="/taxRelief/editTaxRelief/:id" element={<EditTaxRelief />} />
      <Route path="/taxRelief/deleteTaxRelief/:id" element={<DeleteTaxRelief />} />
        
      {/** TaxRate */}
      <Route path="/taxRelief/addTaxRate" element={<AddTaxRate />} />   
      <Route path="/taxRelief/editTaxRate/:id" element={<EditTaxRate />} />
      <Route path="/taxRelief/deleteTaxRate/:id" element={<DeleteTaxRate />} />  

      {/** Gihan */}
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
       
       {/** Dimuthu */} 
       {/** Assets */}
      <Route path="/assets" element={<IndexAssets />} />
      <Route path="/assets/create" element={<CreateAssets />} />
      <Route path="/assets/detail/:id" element={<ViewAssets />} />
      <Route path="/assets/edit/:id" element={<EditAssets />} />

       {/** Liabilities */}    
      <Route path="/liabilities" element={<IndexLiabilities />} />
      <Route path="/liabilities/create" element={<CreateLiabilities />} />
      <Route path="/liabilities/detail/:id" element={<ViewLiabilities />} />
      <Route path="/liabilities/edit/:id" element={<EditLiabilities />} />
      <Route path="/liabilities/delete/:id" element={<DeleteLiabilities />} /> 

    </Routes>
  )
}

export default App


