import { useSelector } from "react-redux";
import { getOrdersStatus, selectOrders } from "../../../features/orders/ordersSlice";
import { LineWave } from "react-loader-spinner";
import { Link } from "react-router-dom";


const OrdersList = () => {
    const orders = useSelector(selectOrders);
    const ordersStatus = useSelector(getOrdersStatus);

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

    let ordersList;
    if (ordersStatus === 'pending') {
        ordersList = <LineWave wrapperStyle={{ display: 'flex', margin: 'auto' }} />;
    } else if (ordersStatus === 'fulfilled') {
        ordersList = renderOrders();
    } else if (ordersStatus === 'rejected') {
        ordersList = <p>No orders found</p>;
    }

    return (
        <ul className="orders-list">
            {ordersList}
        </ul>
    )
}
export default OrdersList