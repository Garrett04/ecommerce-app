import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../apis/products";
import { getProductDetailsStatus, selectProductDetails } from "../features/products/productDetailsSlice";
import { getProductsError } from "../features/products/productsSlice";
import { addProduct, fetchCartById, fetchCarts } from "../apis/cart";
import { getCartsStatus, selectCarts } from "../features/carts/cartsSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import GoBackButton from "../components/GoBackButton";


const Product = () => {
    const carts = useSelector(selectCarts);
    const cartsStatus = useSelector(getCartsStatus);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const product = useSelector(selectProductDetails);
    const productDetailsStatus = useSelector(getProductDetailsStatus);
    const productDetailsError = useSelector(getProductsError);

    const [quantity, setQuantity] = useState(1);
    const [cartId, setCartId] = useState();
    const [msg, setMsg] = useState("");

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
      // setAuthToken();
      dispatch(fetchProductById(id));
      dispatch(fetchCarts()); // Update carts state to display carts
    }, [dispatch, id])

    const renderProduct = () => {
      return (
        <div key={product.id}>
          <img src={`${process.env.PUBLIC_URL}/images/products/${product.image}`} alt={product.image}/>
          <h2>{product.name}</h2>
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
        </div>
      )
    }

    let content;
    if (productDetailsStatus === 'pending') {
      content = 'Loading...';
    } else if (productDetailsStatus === 'fulfilled') {
      // console.log(product);
      content = renderProduct();
    } else if (productDetailsStatus === 'rejected') {
      content = productDetailsError;
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'quantity') {
        setQuantity(value)
      } else if (name === 'cart-title') {
        setCartId(value)
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // console.log(cartId, id, quantity)
        await addProduct(cartId, { productId: id, quantity });
        setMsg("Product added to cart!");
        
        dispatch(fetchCarts()); // To update cart options again
        dispatch(fetchCartById(cartId)); // To update cart state
        setCartId(""); // To update the select dropdown value

      } catch (err) {
        setMsg(err.response.msg);
      }
    }

    const renderCartsOptions = () => {
      // If productsDetailsStatus and cartsStatus has been fulfilled then do this
      if (cartsStatus === 'fulfilled') {
        return carts.map((cart) => {
          // checks if cart.product_ids array has the same product_id as the current product id
          const productExists = cart.product_ids.some(product_id => product_id === id);
          // console.log(productExists);

          // if its true then return option element with disabled as true 
          // so that the user can't add the same product to the cart again
          if (productExists) {
            return (
              <option 
                key={cart.id} 
                value={cart.id} 
                disabled={true}
              >
                {cart.title}
              </option>
            )
            // Else return option element with disabled as false 
            // so that user can add the product to their cart.
          } else {
            return (
              <option 
                key={cart.id} 
                value={cart.id} 
                disabled={false}
              >
                {cart.title}
              </option>
            )
          }
        })
      }
    }

    const renderForm = () => {
      if (isAuthenticated) {
        return (
          <form onSubmit={handleSubmit}>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={quantity}
              onChange={handleChange}
              min="1"
              required
            />
            <select 
              id="cart-title" 
              defaultValue="" 
              name='cart-title' 
              value={cartId} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled hidden>Select your cart</option>
              {renderCartsOptions()}
            </select>
            {msg}
            <input type="submit" value="Add to cart" />
          </form>
        )
      }
    }

    return (
      <div className="product">
        {content}
        {renderForm()}
        <GoBackButton />
      </div>
    )
}

export default Product;