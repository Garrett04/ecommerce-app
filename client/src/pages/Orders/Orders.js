import { useDispatch, useSelector } from "react-redux"
import { getOrdersError, getOrdersStatus, selectOrders } from "../../features/orders/ordersSlice"
import { useEffect } from "react";
import { fetchOrders } from "../../apis/orders";
import { Link } from "react-router-dom";
import { LineWave } from "react-loader-spinner";


const Orders = () => {
    const orders = useSelector(selectOrders);
    const ordersStatus = useSelector(getOrdersStatus);
    const ordersError = useSelector(getOrdersError);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch])

    const renderOrders = () => {
        // console.log(orders);
        return orders.map(({
            id,
            order_date,
            order_status,
            cart_details,
            total_amount
        }) => (
            <li key={id}>
                <div>
                    <p className="order-status">
                        Status: {order_status}
                    </p> 
                    <p>
                        Order Date: {order_date}
                    </p>
                </div>
                <p>Cart Title: {cart_details.cart_title}</p>
                <p>Total amount: {total_amount}</p>
                <Link to={`${id}`}>View order</Link>
            </li>
        ))
    }

    let content;
    if (ordersStatus === 'pending') {
        content = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />;
    } else if (ordersStatus === 'fulfilled') {
        content = renderOrders();
    } else if (ordersStatus === 'rejected') {
        content = ordersError;
    }

    return (
        <div className="orders">
            <h2>Orders</h2>
            <ul className="orders-list">
                {content}
            </ul>
        </div>
    )
}

export default Orders;