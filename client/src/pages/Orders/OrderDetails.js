import { useDispatch, useSelector } from "react-redux";
import { getOrderError, getOrderStatus, selectOrder } from "../../features/orders/orderSlice";
import { useEffect } from "react";
import { fetchOrderById } from "../../apis/orders";
import { Link, useParams } from "react-router-dom";


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
                Product name: {product_name}
                Price: {product_price}
                Quantity: {product_quantity}
                <Link to={`/product/${product_id}`}>View Product</Link>
            </div>
        ))
    }

    let content;
    let total_amount;
    let order_status;
    if (orderStatus === 'pending') {
        content = 'Loading...'
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
            <h2>Order Status: {order_status}</h2>
            <h2>Total Amount: {total_amount}</h2>
            {content}
        </div>
    )
}
export default OrderDetails