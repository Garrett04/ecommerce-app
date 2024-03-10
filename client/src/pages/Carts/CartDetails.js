import { useDispatch, useSelector } from "react-redux";
import { getCartError, getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect } from "react";
import { fetchCartById } from "../../apis/cart";
import { useParams } from "react-router-dom";
import { setAuthToken } from "../../apis/client";


const CartDetails = () => {
    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);
    const cartError = useSelector(getCartError);

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      setAuthToken();
      dispatch(fetchCartById(id));
    }, [dispatch, id])

    const renderCart = () => {
      return cart.map(item => (
        <div key={item.product_id} className="cart-product">
          <h3>{item.product_name}</h3>
          <p>{item.product_price}</p>
          <p>{item.product_quantity}</p>
        </div>
      ));
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
        <h2>{cartStatus === 'fulfilled' ? cart[0].cart_title : null}</h2>
        {content}
      </div>
    )
}
export default CartDetails