import { useSelector } from "react-redux";
import { getOrderError, getOrderStatus, selectOrder } from "../../../features/orders/orderSlice";
import { Link } from "react-router-dom";
import { LineWave } from "react-loader-spinner";


const OrderDetailsView = () => {
    const order = useSelector(selectOrder);
    const orderStatus = useSelector(getOrderStatus);
    const orderError = useSelector(getOrderError);

    const renderOrderDetails = () => {
        // console.log(order);
        return order.data.map(({
            product_name,
            product_price,
            product_quantity,
            product_id
        }) => (
            <div key={product_id}>
                <p>
                    <span>Product name:</span> {product_name}
                </p>
                <p>
                    <span>Price:</span> {product_price}
                </p>
                <p>
                    <span>Quantity:</span> {product_quantity}
                </p>
                <Link to={`/product/${product_id}`}>View Product</Link>
            </div>
        ))
    }

    let productList;
    let total_amount;
    let order_status;
    if (orderStatus === 'pending') {
        productList = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />
    }
    if (orderStatus === 'fulfilled') {
        productList = renderOrderDetails();
        total_amount = order.total_amount;
        // Since all will be equal to the same value
        order_status = order.order_status;
    } else if (orderStatus === 'rejected') {
        productList = orderError;
    }

    return (
        <>
            <h2 className="order-status">Order Status: {order_status}</h2>
            <h2>Cart Title: {orderStatus === 'fulfilled' && order.cart_title}</h2>
            <h2>Total Amount: {total_amount}</h2>
            <div className="product-list">
                {productList}
            </div>
        </>
    )
}
export default OrderDetailsView