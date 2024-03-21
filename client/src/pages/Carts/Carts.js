import { useEffect, useState } from "react"
import { createCart, fetchCarts } from "../../apis/cart";
import { useDispatch, useSelector } from "react-redux";
import { getCartsError, getCartsStatus, selectCarts } from "../../features/carts/cartsSlice";
import { Link } from "react-router-dom";
import { LineWave } from "react-loader-spinner";
import GoBackButton from "../../components/GoBackButton";

const Carts = () => {
    const carts = useSelector(selectCarts);
    const cartsStatus = useSelector(getCartsStatus);
    const cartsError = useSelector(getCartsError);
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleChange = (e) => {
      setTitle(e.target.value);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        await createCart({title});

        dispatch(fetchCarts()); // Once created it will dispatch fetchCarts again to update state
      } catch (err) {
        setErrMsg(err);
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
      content = <LineWave />;
    } else if (cartsStatus === 'fulfilled') {
      content = renderCarts();
    } else if (cartsStatus === 'rejected') {
      content = cartsError;
    }

    return (
      <>
        <div className="carts">
          <h2>All Carts</h2>
          {content}
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Cart Title: </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={title} 
              onChange={handleChange}
              placeholder="Cart Title"
              required
            />
            <input type="submit" value="Create Cart"/>
          </form>
          {errMsg}
        </div>
        <GoBackButton/>
      </>
    )
}
export default Carts