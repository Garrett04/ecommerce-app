import { useDispatch } from "react-redux";
import { deleteAddress, fetchAddressesByUserId } from "../../../../apis/addresses";
import { useState } from "react";


const DeleteAddressButton = ({ id, setMsg }) => {
    const dispatch = useDispatch();

    const handleAddressDelete = async () => {
        try {
            const deletedAddressMsg = await deleteAddress(id);
        
            dispatch(fetchAddressesByUserId()); // To update the state after address has been deleted

            setMsg(deletedAddressMsg)
        } catch (err) {
            throw err;
        }
    }

    return (
        <>
            <button onClick={handleAddressDelete}>
                &#128465;
            </button>
        </>
    )
}
export default DeleteAddressButton