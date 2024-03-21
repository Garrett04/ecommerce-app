import { useSelector } from "react-redux";
import { getCartStatus, selectCart } from "../../../features/carts/cartSlice";
import DeleteCartItemButton from "./DeleteCartItemButton";
import { LineWave } from "react-loader-spinner";
import { Link } from "react-router-dom";

const CartItems = ({
    setDeletedCartItemMsg
}) => {
    const cart = useSelector(selectCart);
    const cartStatus = useSelector(getCartStatus);

    const renderCartItems = () => {
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

    let cart_items;
    if (cartStatus === 'pending') {
      cart_items = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />;
    } else if (cartStatus === 'fulfilled') {
      cart_items = renderCartItems();
    } else if (cartStatus === 'rejected') {
      // Handling case where there's nothing in cart then disable checkout button
      cart_items = <p>Please add items to cart. Go to <Link to={'/'}>Home page</Link></p>;
    }

    return (
        <div>
            {cart_items}
        </div>
    )
}
export default CartItems