import { useDispatch, useSelector } from "react-redux";
import { getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect, useState } from "react";
import { fetchCartById } from "../../apis/cart";
import { Link, useParams } from "react-router-dom";
import { getUserStatus } from "../../features/user/userSlice";
import { fetchUserData } from "../../apis/user";
import { fetchAddressesByUserId } from "../../apis/addresses";
import DefaultAddresses from "../../components/main/user/addresses/DefaultAddresses";
import CheckoutButton from "../../components/main/carts/CheckoutButton";
import CartItems from "../../components/main/carts/CartItems";


const CartDetails = () => {
    const userStatus = useSelector(getUserStatus);

    const [noCartItemsMsg, setNoCartItemsMsg] = useState("");

    const [deletedCartItemMsg, setDeletedCartItemMsg] = useState("");
    const [disabled, setDisabled] = useState(false);

    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchCartById(id));
      dispatch(fetchUserData());
      dispatch(fetchAddressesByUserId());
    }, [dispatch, id])
  
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
        <h2>{(cartStatus === 'fulfilled' && cart) && cart.data[0].cart_title}</h2>
        <CartItems setDeletedCartItemMsg={setDeletedCartItemMsg} />
        {deletedCartItemMsg}
        <div className="cart-details-bottom">
          {(cartStatus === 'fulfilled' && cart.subtotal) && <h4>Subtotal: {cart.subtotal}</h4>}
          {noCartItemsMsg}
          {userStatus === 'fulfilled' && <DefaultAddresses page={"CartDetails"} setDisabled={setDisabled} />}
          <CheckoutButton id={id} disabled={disabled} />
        </div>
      </div>
    )
}

export default CartDetails;