import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchOrderById } from "../../apis/orders";
import { useParams } from "react-router-dom";
import OrderDetailsView from "../../components/main/orders/OrderDetailsView";

const OrderDetails = () => {
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchOrderById(id))
    }, [dispatch, id])
    

    return (
        <div className="order-details">
            <OrderDetailsView />
        </div>
    )
}
export default OrderDetails