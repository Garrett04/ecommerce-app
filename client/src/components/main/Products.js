import { useEffect } from "react";
import { fetchProducts } from "../../apis/products";
import { useDispatch, useSelector } from "react-redux";
import { getProductsError, getProductsStatus, selectAllProducts } from "../../features/productsSlice";

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
        <div key={product.id}>
          <img src={`${process.env.PUBLIC_URL}/images/products/${product.image}`}/>
          <h3>{product.name}</h3>
          <h4>{product.price}</h4>
        </div>
      ))
    }

    let content;
    if (productsStatus === 'pending') {
      content = 'Loading...';
    } else if (productsStatus === 'fulfilled') {
      console.log(products);
      content = renderProducts();
    } else if (productsStatus === 'rejected') {
      content = productsErr;
    }

    return (
      <div className="products">
          <h2>Products</h2>
          <div className="container">
            {content}
          </div>
      </div>
    )
}

export default Products;