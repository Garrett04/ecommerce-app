import { useDispatch, useSelector } from "react-redux";
import { getOrderError, getOrderStatus, selectOrder } from "../../features/orders/orderSlice";
import { useEffect } from "react";
import { fetchOrderById } from "../../apis/orders";
import { Link, useParams } from "react-router-dom";
import { LineWave } from "react-loader-spinner";


const OrderDetails = () => {
    const order = useSelector(selectOrder);
    const orderStatus = useSelector(getOrderStatus);
    const orderError = useSelector(getOrderError);
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchOrderById(id))
    }, [dispatch, id])

    const renderOrderDetails = () => {
        console.log(order);

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

    let content;
    let total_amount;
    let order_status;
    if (orderStatus === 'pending') {
        content = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />
    }
    if (orderStatus === 'fulfilled') {
        content = renderOrderDetails();
        total_amount = order.total_amount;
        // Since all will be equal to the same value
        order_status = order.order_status;
    } else if (orderStatus === 'rejected') {
        content = orderError;
    }

    return (
        <div className="order-details">
            <h2 className="order-status">Order Status: {order_status}</h2>
            <h2>Cart Title: {orderStatus === 'fulfilled' && order.data[0].cart_title}</h2>
            <h2>Total Amount: {total_amount}</h2>
            <div className="product-list">
                {content}
            </div>
        </div>
    )
}
export default OrderDetails