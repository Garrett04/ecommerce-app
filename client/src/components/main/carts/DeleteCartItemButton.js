import { useDispatch } from "react-redux";
import { fetchCartById, removeProduct } from "../../../apis/cart";
import { useParams } from "react-router-dom";
import { fetchAddressesByUserId } from "../../../apis/addresses";
import { fetchUserData } from "../../../apis/user";

const DeleteCartItemButton = ({
    product_id,
    setDeletedCartItemMsg
}) => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const handleDelete = async () => {
        try {
            await removeProduct(id, product_id);

            // Update redux states
            dispatch(fetchCartById(id));
            dispatch(fetchAddressesByUserId());
            dispatch(fetchUserData());
            // console.log("Deleted cart item successfully");
            setDeletedCartItemMsg("Cart item removed successfully");
        } catch (err) {
            throw err;
        }
    }

    return (
        <button title="Remove cart item" className="delete-cart-item" onClick={handleDelete}>
            &#x1F5D1;
        </button>
    )
}

export default DeleteCartItemButton;