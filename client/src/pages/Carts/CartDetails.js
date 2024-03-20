import { useDispatch, useSelector } from "react-redux";
import { getCartError, getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect, useState } from "react";
import { fetchCartById } from "../../apis/cart";
import { Link, useParams } from "react-router-dom";
import { createCheckoutSession } from "../../apis/checkout";
import { getUserStatus } from "../../features/user/userSlice";
import { fetchUserData } from "../../apis/user";
import { fetchAddressesByUserId } from "../../apis/addresses";
import DeleteCartItemButton from "../../components/main/carts/DeleteCartItemButton";
import DefaultAddresses from "../../components/main/user/addresses/DefaultAddresses";
import { LineWave } from "react-loader-spinner";


const CartDetails = () => {
    const userStatus = useSelector(getUserStatus);

    const [noCartItemsMsg, setNoCartItemsMsg] = useState("");

    const [deletedCartItemMsg, setDeletedCartItemMsg] = useState("");
    const [disabled, setDisabled] = useState(false);

    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);
    const cartError = useSelector(getCartError);

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchCartById(id));
      dispatch(fetchUserData());
      dispatch(fetchAddressesByUserId());
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
          <DeleteCartItemButton 
            product_id={product_id}
            setDeletedCartItemMsg={setDeletedCartItemMsg} 
          />
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
      content = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />;
    } else if (cartStatus === 'fulfilled') {
      content = renderCart();
    } else if (cartStatus === 'rejected') {
      content = cartError;
    }
  
    useEffect(() => {
      // Handling case where there's nothing in cart then disable checkout button
      if (cartStatus === 'rejected') {
        setNoCartItemsMsg(
          <p>
            Please add items to cart. Go to <Link to={'/'}>Home page</Link>
          </p>
        );
        setDisabled(true);
      }
    }, [
      cartStatus
    ])

    return (
      <div className="cart-details">
        <h2>{cartStatus === 'fulfilled' && cart ? cart.data[0].cart_title : null}</h2>
        {content}
        {deletedCartItemMsg}
        <div className="cart-details-bottom">
          {cartStatus === 'fulfilled' && cart.subtotal ? <h4>Subtotal: {cart.subtotal}</h4> : null}
          {noCartItemsMsg}
          {userStatus === 'fulfilled' ? <DefaultAddresses page={"CartDetails"} setDisabled={setDisabled} /> : null}
          <button onClick={handleCheckout} disabled={disabled}>
            Checkout
          </button>
        </div>
      </div>
    )
}

export default CartDetails;