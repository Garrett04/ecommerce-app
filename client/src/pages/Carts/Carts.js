import { useEffect, useState } from "react"
import { createCart, fetchCarts } from "../../apis/cart";
import { useDispatch, useSelector } from "react-redux";
import { getCartsError, getCartsStatus, selectCarts } from "../../features/carts/cartsSlice";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, setAuthToken } from "../../apis/client";

const Carts = () => {
    const carts = useSelector(selectCarts);
    const cartsStatus = useSelector(getCartsStatus);
    const cartsError = useSelector(getCartsError);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [err, setErrMsg] = useState("");

    const handleChange = (e) => {
      setTitle(e.target.value);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const newCart = await createCart({title});
        console.log(newCart);

        dispatch(fetchCarts()); // Once created it will dispatch fetchCarts again to update state
      } catch (err) {
        if (err.status === 404) {
          setErrMsg(err.data.msg);
        }
      }
    }

    useEffect(() => {
      dispatch(fetchCarts());
    }, [dispatch])

    const renderCarts = () => {
      if (cartsStatus === 'fulfilled') {
        return carts.map(cart => (
          <div key={cart.id}>
            <h3>{cart.title}</h3>
            <Link to={`/carts/${cart.id}`}>View cart</Link>
          </div>
        ))
      }
    }

    let content;
    if (cartsStatus === 'pending') {
      content = 'Loading...';
    } else if (cartsStatus === 'fulfilled') {
      content = renderCarts();
    } else if (cartsStatus === 'rejected') {
      content = cartsError;
    }

    return (
      <div className="carts">
        <h2>All Carts</h2>
        {cartsStatus === 'fulfilled' ? content : null}
        <form action="/api/cart/" method="POST" onSubmit={handleSubmit}>
          <label htmlFor="title">Cart Title: </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={title} 
            onChange={handleChange}
            placeholder="Cart Title"
          />
          <input type="submit" value="Create Cart"/>
        </form>
      </div>
    )
}
export default Carts