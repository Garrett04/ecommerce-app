import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../apis/products";
import { getProductDetailsStatus, selectProductDetails } from "../features/products/productDetailsSlice";
import { getProductsError } from "../features/products/productsSlice";
import { addProduct, fetchCarts } from "../apis/cart";
import { selectCarts } from "../features/carts/cartsSlice";
import { isAuthenticated, setAuthToken } from "../apis/client";


const Product = () => {
    const carts = useSelector(selectCarts);
    const product = useSelector(selectProductDetails);
    const productDetailsStatus = useSelector(getProductDetailsStatus);
    const productDetailsError = useSelector(getProductsError);

    const [quantity, setQuantity] = useState(1);
    const [cartId, setCartId] = useState();
    const [msg, setMsg] = useState("");

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
      setAuthToken();
      dispatch(fetchProductById(id));
    }, [dispatch, id])

    const renderProduct = () => {
      return (
        <div key={product.id}>
          <img src={`${process.env.PUBLIC_URL}/images/products/${product.image}`}/>
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
      console.log(product);
      content = renderProduct();
    } else if (productDetailsStatus === 'rejected') {
      content = productDetailsError;
    }

    useEffect(() => {
      dispatch(fetchCarts()); // Update carts state to display carts
      setCartId(carts[0].id); // Defaults the select dropdown to the first cart id
    }, [dispatch])

    const handleChange = (e) => {
      if (e.target.name === 'quantity') {
        setQuantity(e.target.value)
      } else if (e.target.name === 'cart-title') {
        setCartId(e.target.value)
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        console.log(cartId, id, quantity)
        const cart = await addProduct(cartId, { productId: id, quantity });
        setMsg("Product added to cart!");
      } catch (err) {
        setMsg(err.response.msg);
      }
    }

    const renderCartsOptions = () => {
      return carts.map(cart => (
        <option key={cart.id} value={cart.id}>
          {cart.title}
        </option>
      ))
    }

    const renderForm = () => {
      if (isAuthenticated()) {
        return (
          <form action={`/api/cart/${cartId}`} method="POST" onSubmit={handleSubmit}>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={quantity}
              onChange={handleChange}
              min="0"
              required
            />
            <select id="cart-title" name='cart-title' value={cartId} onChange={handleChange}>
              <option value="default" disabled>Select your cart</option>
              {renderCartsOptions()}
            </select>
            <input type="submit" value="Add to cart" />
          </form>
        )
      }
    }

    return (
      <div className="product">
        {content}
        {renderForm()}
        {msg}
      </div>
    )
}

export default Product;