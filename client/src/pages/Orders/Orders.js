import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { fetchOrders } from "../../apis/orders";
import OrdersList from "../../components/main/orders/OrdersList";
import GoBackButton from "../../components/GoBackButton";


const Orders = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch])
    
    return (
        <>
            <div className="orders">
                <h2>Orders</h2>
                <OrdersList />
            </div>
            <GoBackButton/>
        </>
    )
}

export default Orders;