import { useDispatch, useSelector } from "react-redux"
import { getOrdersError, getOrdersStatus, selectOrders } from "../../features/orders/ordersSlice"
import { useEffect } from "react";
import { fetchOrders } from "../../apis/orders";
import { Link } from "react-router-dom";


const Orders = () => {
    const orders = useSelector(selectOrders);
    const ordersStatus = useSelector(getOrdersStatus);
    const ordersError = useSelector(getOrdersError);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch])

    const renderOrders = () => {
        console.log(orders);
        return orders.map(({
            id,
            order_date,
            order_status,
            cart_title,
        }) => (
            <li key={id}>
                Status: {order_status} Order Date: {order_date}
                Cart Title: {cart_title}
                <Link to={`${id}`}>View order</Link>
            </li>
        ))
    }

    let content;
    if (ordersStatus === 'pending') {
        content = 'Loading...';
    } else if (ordersStatus === 'fulfilled') {
        content = renderOrders();
    } else if (ordersStatus === 'rejected') {
        content = ordersError;
    }

    return (
        <ul className="orders">
            {content}
        </ul>
    )
}

export default Orders;