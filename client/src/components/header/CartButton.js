import { NavLink } from 'react-router-dom';
import shoppingCart from '../../resources/images/shopping-cart.svg';

const Cart = () => {
  return (
    <div className='cart'>
        <NavLink to="/carts" title="Your carts" className="cartBtn">
            <img src={shoppingCart} alt="Cart Icon"/>
        </NavLink>
    </div>
  )
}

export default Cart