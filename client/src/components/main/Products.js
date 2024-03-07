import { useEffect, useState } from "react";
import { getProducts } from "../../apis/products";


const Products = () => {
    const [products, setProducts] = useState([]);
    const [errMsg, setErrMsg] = useState();

    useEffect(() => {
      const allProducts = async () => {
        try {
          const allProducts = await getProducts();
          console.log(allProducts);
          setProducts(allProducts);
        } catch (err) {
          if (err.status === 404) {
            setErrMsg(err.data.msg);
          }
        }
      }
      
      allProducts();
    }, [])

    const renderProducts =  () => {
      console.log(products);
      return products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
        </div>
      ))
    }

    return (
      <div className="products">
          <h2>Products</h2>
          <div className="container">
            {renderProducts()}
          </div>
          {errMsg}
      </div>
    )
}

export default Products;