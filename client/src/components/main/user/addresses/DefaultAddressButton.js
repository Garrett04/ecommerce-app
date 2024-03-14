import { useDispatch } from "react-redux";
import { fetchAddressesByUserId, updateDefaultAddress } from "../../../../apis/addresses";
import { fetchUserData } from "../../../../apis/user";


const DefaultAddressButton = ({
    children,
    id, // address id
    name // This holds the name attribute of the button
}) => {
    const dispatch = useDispatch();

    const handleDefaultAddressUpdate = async (e) => {
        try {
            // Passing in an id and option property which has a value of name
            // name is either default-shipping-address or default-billing-address 
            const updatedDefaultAddress = await updateDefaultAddress(id, { option: name });

            console.log(updatedDefaultAddress);

            // To update user data state so that it rerenders the user's default addresses
            dispatch(fetchUserData());

        } catch (err) {
            throw err;
        }
    }

    return (
        <button name={name} onClick={handleDefaultAddressUpdate}>{children}</button>
    )
}
export default DefaultAddressButton