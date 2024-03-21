import { useDispatch, useSelector } from "react-redux";
import { getAddressesError, getAddressesStatus, selectAddresses } from "../../../../features/user/addressesSlice";
import { useEffect, useState } from "react";
import { fetchAddressesByUserId } from "../../../../apis/addresses";
import AddAddressForm from "./AddressForms/AddAddressForm";
import { NavLink } from "react-router-dom";
import DeleteAddressButton from "./DeleteAddressButton";
import DefaultAddressButton from "./DefaultAddressButton";
import { getUserStatus, selectUser } from "../../../../features/user/userSlice";
import DefaultAddresses from "./DefaultAddresses";
import { LineWave } from "react-loader-spinner";


const Addresses = () => {
    const user = useSelector(selectUser);
    const userStatus = useSelector(getUserStatus);

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
                <p>
                    Address Line 1: {address_line1}
                    <br/>
                    Address Line 2: {address_line2}
                    <br/>
                    City: {city}
                    <br/>
                    State: {state}
                    <br/>
                    Postal Code: {postal_code}
                    <br/>
                    Country: {country}
                </p>
                <div>
                    <DefaultAddressButton 
                        name={"default-shipping-address"} 
                        id={id}
                    >
                        Add Default Shipping Address
                    </DefaultAddressButton>
                    <DefaultAddressButton 
                        name={"default-billing-address"}
                        id={id}
                    >
                        Add Default Billing Address
                    </DefaultAddressButton>
                    <DeleteAddressButton id={id} setMsg={setMsg} />
                    <NavLink 
                        title="Edit Address" 
                        className="address-edit-button" 
                        to={`edit-address/${id}`}
                    >
                        &#128393;
                    </NavLink>
                </div>
            </li>
        ))
    }

    let addressesList;
    if (addressesStatus === 'pending') {
        addressesList = <LineWave />;
    } else if (addressesStatus === 'fulfilled') {
        addressesList = renderAddresses();
    } else if (addressesStatus === 'rejected') {
        addressesList = addressesError;
    }

    return (
        <div className="addresses">
            <h2>Addresses</h2>
            {addressesStatus === 'fulfilled' && userStatus === 'fulfilled' && <DefaultAddresses />}
            <ul className="addresses-list">
                {addressesList}
            </ul>
            <p className="addresses-msg">{msg}</p>
            <AddAddressForm setMsg={setMsg} />
        </div>
    )
}
export default Addresses