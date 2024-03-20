import { NavLink } from "react-router-dom"

import orderIcon from '../../resources/images/order.svg'

const ViewOrdersButton = () => {
    return (
        <div className="view-orders">
            <NavLink className="view-orders-button" to={`orders`}>
                <img src={orderIcon} alt="order icon" />
            </NavLink>
        </div>
    )
}
export default ViewOrdersButton