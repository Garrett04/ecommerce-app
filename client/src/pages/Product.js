import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchProductById } from "../apis/products";
import { getProductDetailsStatus, selectProductDetails } from "../features/products/productDetailsSlice";
import { getProductsError } from "../features/products/productsSlice";


const Product = () => {
    const product = useSelector(selectProductDetails);
    const productDetailsStatus = useSelector(getProductDetailsStatus);
    const productDetailsError = useSelector(getProductsError);

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
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

    return (
      <div className="product">
        {content}
      </div>    
    )
}

export default Product;