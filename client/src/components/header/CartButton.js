import shoppingCart from '../../resources/images/shopping-cart.svg';

const Cart = () => {
  return (
    <div className='cart'>
        <button title="Your carts">
            <img src={shoppingCart} alt="Cart Icon"/>
        </button>
    </div>
  )
}

export default Cart