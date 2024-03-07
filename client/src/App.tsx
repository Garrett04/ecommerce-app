import Root from './pages/Root';

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';

const router = createBrowserRouter( createRoutesFromElements(
  <>
    <Route path="/" element={ <Root/> }>

    </Route>
  </>
))

function App() {
  return (
    <RouterProvider router={ router } />
  );
}

export default App;
