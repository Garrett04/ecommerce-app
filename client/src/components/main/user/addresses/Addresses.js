import { useDispatch, useSelector } from "react-redux";
import { getAddressesError, getAddressesStatus, selectAddresses } from "../../../../features/user/addressesSlice";
import { useEffect, useState } from "react";
import { fetchAddressesByUserId, updateAddress } from "../../../../apis/addresses";
import AddAddressForm from "./AddressForms/AddAddressForm";
import { Link, NavLink } from "react-router-dom";
import DeleteAddressButton from "./DeleteAddressButton";


const Addresses = () => {
    const addresses = useSelector(selectAddresses);
    const addressesStatus = useSelector(getAddressesStatus);
    const addressesError = useSelector(getAddressesError);
    const [msg, setMsg] = useState("");

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
                <NavLink to={`edit-address/${id}`}>Edit Address</NavLink>
                <DeleteAddressButton id={id} setMsg={setMsg} />
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
            <h2>Addresses</h2>
            <ul>
                {content}
            </ul>
            <AddAddressForm setMsg={setMsg} />
            {msg}
        </div>
    )
}
export default Addresses