import { useDispatch } from "react-redux";
import { deleteAddress, fetchAddressesByUserId } from "../../../../apis/addresses";
import { useState } from "react";
import { fetchUserData } from "../../../../apis/user";


const DeleteAddressButton = ({ id, setMsg }) => {
    const dispatch = useDispatch();

    const handleAddressDelete = async () => {
        try {
            const deletedAddressMsg = await deleteAddress(id);
        
            dispatch(fetchAddressesByUserId()); // To update the state after address has been deleted
            // To update the state after address has been deleted. 
            // So that it shows the message that default address is not provided
            dispatch(fetchUserData()); 

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