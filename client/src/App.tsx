import Carts from './pages/Carts/Carts';
import Login from './pages/Login';
import Register from './pages/Register';
import Root from './pages/Root';

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import User from './pages/User';
import Product from './pages/ProductDetails';
import Main from './components/main/Main';
import CartDetails from './pages/Carts/CartDetails';
import PrivateRoutes from './utils/PrivateRoutes';

const router = createBrowserRouter( createRoutesFromElements(
  <>
    <Route path="/" element={ <Root/> }>
      <Route index path="/" element={ <Main/> }/>
      <Route element={<PrivateRoutes/>}>
        <Route path="/carts" element={ <Carts/> }/>
        <Route path="/carts/:id" element={ <CartDetails/> }/>
      </Route>
      <Route path="/user" element={ <User/> }/>
      <Route path="/product/:id" element={ <Product/> }/>
    </Route>
    <Route path="register" element={ <Register/> }/>
    <Route path="login" element={ <Login/> }/>
  </>
))

function App() {
  return (
    <RouterProvider router={ router } />
  );
}

export default App;
