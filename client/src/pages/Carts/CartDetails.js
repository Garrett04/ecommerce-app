import { useDispatch, useSelector } from "react-redux";
import { getCartError, getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect, useState } from "react";
import { fetchCartById } from "../../apis/cart";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken } from "../../apis/client";
import { createCheckoutSession } from "../../apis/checkout";
import { getUserStatus, selectUser } from "../../features/user/userSlice";
import { fetchUserData } from "../../apis/user";


const CartDetails = () => {
    const user = useSelector(selectUser);
    const userStatus = useSelector(getUserStatus);

    const [msg, setMsg] = useState("");
    const [disabled, setDisabled] = useState(false);

    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);
    const cartError = useSelector(getCartError);
    const navigate = useNavigate();

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchCartById(id));
    }, [dispatch, id])

    useEffect(() => {
      dispatch(fetchUserData());
    }, [dispatch]);

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
        const checkoutSession = await createCheckoutSession(id);

        // Redirect to stripe payment page
        window.location.href = checkoutSession.url;
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

    useEffect(() => {
      // If user's default billing and shipping address are not set
      // then display a message
      // and disable the checkout button
      if (userStatus === 'fulfilled' && (!user.default_billing_address_id && !user.default_shipping_address_id)) {
        setMsg("Please set default billing address and shipping address.");
        setDisabled(true);
      }
    }, [userStatus, user.default_billing_address_id, user.default_shipping_address_id])

    return (
      <div className="cart">
        <h2>{cartStatus === 'fulfilled' ? cart.data[0].cart_title : null}</h2>
        {content}
        {cart.subtotal ? <h4>Subtotal: {cart.subtotal}</h4> : null}
        {msg}
        <button onClick={handleCheckout} disabled={disabled}>
          Checkout
        </button>
      </div>
    )
}

export default CartDetails;