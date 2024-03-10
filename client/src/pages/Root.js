import Header from '../components/header/Header';
import CategoryOptions from '../components/CategoryOptions';
import { Outlet } from 'react-router-dom';


const Root = () => {
  return (
    <div>
      <Header />
      <CategoryOptions />
      <Outlet />
    </div>
  )
}

export default Root