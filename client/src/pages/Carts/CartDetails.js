import { useDispatch, useSelector } from "react-redux";
import { getCartError, getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect } from "react";
import { fetchCartById } from "../../apis/cart";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken } from "../../apis/client";
import { createCheckoutSession } from "../../apis/checkout";


const CartDetails = () => {
    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);
    const cartError = useSelector(getCartError);
    const navigate = useNavigate();

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchCartById(id));
    }, [dispatch, id])

    const renderCart = () => {
      return cart.data.map(({
        product_id, 
        product_name, 
        product_price, 
        product_quantity
      }) => (
        <div key={product_id} className="cart-product">
          <h3>{product_name}</h3>
          <p>Price: {product_price}</p>
          <p>Quantity: {product_quantity}</p>
        </div>
      ));
    }

    const handleCheckout = async () => {
      try {
        const url = await createCheckoutSession(id);

        // Redirect to stripe payment page
        window.location.href = url;
      } catch (err) {
        throw err.status;
      }
    }

    let content;
    if (cartStatus === 'pending') {
      content = 'Loading...'
    } else if (cartStatus === 'fulfilled') {
      content = renderCart();
    } else if (cartStatus === 'rejected') {
      content = cartError;
    }

    return (
      <div className="cart">
        <h2>{cartStatus === 'fulfilled' ? cart.data[0].cart_title : null}</h2>
        {content}
        {cart.subtotal ? <h4>Subtotal: {cart.subtotal}</h4> : null}
        <button onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    )
}
export default CartDetails