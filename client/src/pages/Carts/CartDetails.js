import { useDispatch, useSelector } from "react-redux";
import { getCartError, getCartStatus, selectCart } from "../../features/carts/cartSlice";
import { useEffect, useState } from "react";
import { fetchCartById } from "../../apis/cart";
import { useParams } from "react-router-dom";
import { getUserStatus } from "../../features/user/userSlice";
import { fetchUserData } from "../../apis/user";
import { fetchAddressesByUserId } from "../../apis/addresses";
import DefaultAddresses from "../../components/main/user/addresses/DefaultAddresses";
import CheckoutButton from "../../components/main/carts/CheckoutButton";
import CartItems from "../../components/main/carts/CartItems";
import GoBackButton from "../../components/GoBackButton";

const CartDetails = () => {
    const userStatus = useSelector(getUserStatus);

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

    // Handing case where cartId is invalid uuid
    if (cartError === 'Invalid uuid') {
      return <p>{cartError}</p>;
    } else {
      return (
        <>
          <div className="cart-details">
            <h2>{(cartStatus === 'fulfilled' && cart) && cart.data[0].cart_title}</h2>
            <CartItems setDeletedCartItemMsg={setDeletedCartItemMsg} />
            {deletedCartItemMsg}
            <div className="cart-details-bottom">
              {(cartStatus === 'fulfilled' && cart.subtotal) && <h4>Subtotal: {cart.subtotal}</h4>}
              {userStatus === 'fulfilled' && <DefaultAddresses page={"CartDetails"} setDisabled={setDisabled} />}
              <CheckoutButton id={id} disabled={disabled} />
            </div>
          </div>
          <GoBackButton/>
        </>
      )
    }
}

export default CartDetails;