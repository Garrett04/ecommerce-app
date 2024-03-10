import { useEffect } from "react";
import { fetchProducts } from "../../apis/products";
import { useDispatch, useSelector } from "react-redux";
import { getProductsError, getProductsStatus, selectAllProducts } from "../../features/products/productsSlice";
import { Link } from "react-router-dom";

const Products = () => {
    const products = useSelector(selectAllProducts);
    const productsStatus = useSelector(getProductsStatus);
    const productsErr = useSelector(getProductsError);
    const dispatch = useDispatch();

    useEffect(() => {
      if (productsStatus === 'idle') {
        dispatch(fetchProducts());
      }
    }, [productsStatus, dispatch])

    const renderProducts = () => {
      return products.map((product) => (
        <div className="productCard" key={product.id}>
          <div className="container">
            <img src={`${process.env.PUBLIC_URL}/images/products/${product.image}`}/>
          </div>
          <h3>{product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}</h3>
          <h4>{product.price}</h4>
          <Link to={`/product/${product.id}`}>View more</Link>
        </div>
      ))
    }

    let content;
    if (productsStatus === 'pending') {
      content = 'Loading...';
    } else if (productsStatus === 'fulfilled') {
      // console.log(products);
      content = renderProducts();
    } else if (productsStatus === 'rejected') {
      content = productsErr;
    }

    return (
      <div className="products">
          <h2>Products</h2>
          <div className="productCards">
            {content}
          </div>
      </div>
    )
}

export default Products;