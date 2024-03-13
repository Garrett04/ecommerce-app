import { useDispatch, useSelector } from "react-redux";
import { getAddressesError, getAddressesStatus, selectAddresses } from "../../../../features/user/addressesSlice";
import { useEffect } from "react";
import { fetchAddressesByUserId } from "../../../../apis/addresses";
import { setAuthToken } from "../../../../apis/client";
import AddAddressForm from "./AddAddressForm";


const Addresses = () => {
    const addresses = useSelector(selectAddresses);
    const addressesStatus = useSelector(getAddressesStatus);
    const addressesError = useSelector(getAddressesError);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAddressesByUserId());
    }, [dispatch])

    const renderAddresses = () => {
        return addresses.map(({
            id,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country
        }) => (
            <li key={id}>
                {address_line1}
                {address_line2}
                {city}
                {state}
                {postal_code}
                {country}
            </li>
        ))
    }

    let content;
    if (addressesStatus === 'pending') {
        content = 'Loading...';
    } else if (addressesStatus === 'fulfilled') {
        content = renderAddresses();
    } else if (addressesStatus === 'rejected') {
        content = addressesError;
    }

    return (
        <div className="addresses">
            <ul>
                {content}
            </ul>
            <AddAddressForm />
        </div>
    )
}
export default Addresses