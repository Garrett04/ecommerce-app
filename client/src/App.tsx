import Carts from './pages/Carts';
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
import Product from './pages/Product';
import Main from './components/main/Main';

const router = createBrowserRouter( createRoutesFromElements(
  <>
    <Route path="/" element={ <Root/> }>
      <Route path="/" element={ <Main/> }/>
      <Route path="/carts" element={ <Carts/> }/>
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
