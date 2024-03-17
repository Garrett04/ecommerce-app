import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../features/user/userSlice";
import { selectAddresses } from "../../../../features/user/addressesSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserData } from "../../../../apis/user";


const DefaultAddresses = ({
    page,
    setDisabled
}) => {
    const user = useSelector(selectUser);
    const addresses = useSelector(selectAddresses);
    const dispatch = useDispatch();

    const [msg, setMsg] = useState();

    const [defaultShippingAddressMsg, setDefaultShippingAddressMsg] = useState();
    const [defaultBillingAddressMsg, setDefaultBillingAddressMsg] = useState();

    useEffect(() => {
        // console.log(user.data);
        if (!user.data) {
            if (!user.default_shipping_address_id && !user.default_billing_address_id) {
                if (page === 'CartDetails') {
                    console.log('check1');
                    setMsg(
                        <p>
                            No default billing and shipping address provided. Please add them. Go to <Link to="/user">User page</Link>
                        </p>
                    );
                    setDisabled(true);
                } else {
                    setMsg(<p>No default billing and shipping address provided. Please add them.</p>);
                }
            } else if (!user.default_shipping_address_id) {
                if (page === 'CartDetails') {
                    console.log('check2');
                    setDefaultShippingAddressMsg(
                        <p>
                            No default Shipping Address added. Please add one. Go to <Link to="/user">User page</Link>
                        </p>
                    );
                    setDisabled(true)    
                } else {
                    setDefaultShippingAddressMsg(<p>No default Shipping Address added. Please add one.</p>);
                }  
            } else if (!user.default_billing_address_id) {
                if (page === 'CartDetails') {
                    console.log('check3');
                    setDefaultBillingAddressMsg(
                        <p>
                            No default Billing Address added. Please add one. Go to <Link to="/user">User page</Link>
                        </p>
                    )
                    setDisabled(true);
                } else {
                    setDefaultBillingAddressMsg(<p>No default Billing Address added. Please add one.</p>)
                }
            }
        }
    }, [
        setMsg, 
        setDisabled, 
        page,
        user.default_shipping_address_id, 
        user.default_billing_address_id
    ])

    // A function to render a default address based on an option
    // option can be either 'shipping' or 'billing'
    const renderDefaultAddress = (option) => {
        const default_shipping_address = addresses.filter(address => address.id === user.default_shipping_address_id);
        const default_billing_address = addresses.filter(address => address.id === user.default_billing_address_id);

        // console.log(user);
        // console.log(default_shipping_address);

        if (option === 'shipping') {
            return default_shipping_address.map(({
                id,
                address_line_1,
                address_line_2,
                country,
                state,
                city,
                postal_code,
            }) => {

                return (
                    <div key={`shippingAddressId-${id}`}>
                        <h3>Default Shipping Address: </h3>
                        <li>
                            {address_line_1}
                            {address_line_2}
                            {country}
                            {state}
                            {city}
                            {postal_code}
                        </li>
                    </div>
                )
            })
        } else if (option === 'billing') {
            return default_billing_address.map(({
                id,
                address_line_1,
                address_line_2,
                country,
                state,
                city,
                postal_code,
            }) => {
                return (
                    <div key={`billingAddressId-${id}`}>
                        <h3>Default Billing Address: </h3>
                        <li>
                            {address_line_1}
                            {address_line_2}
                            {country}
                            {state}
                            {city}
                            {postal_code}
                        </li>
                    </div>
                )
            })
        }
    }

    return (
        <>
            {msg}
            <ul>
                {defaultShippingAddressMsg}
                {renderDefaultAddress('shipping')}
            </ul>
            <ul>
                {defaultBillingAddressMsg}
                {renderDefaultAddress('billing')}
            </ul>
        </>
    )

    // if (!user.default_shipping_address_id && !user.default_billing_address_id) {
    //     return (
    //         <>
    //             <h3>Default Shipping Address:</h3> 
    //             <ul>
    //                 No default Shipping Address added. Please add one.
    //             </ul>
    //             <h3>Default Billing Address:</h3> 
    //             <ul>
    //                 No default Billing Address added. Please add one.
    //             </ul>
    //         </>
    //     )
    // } else if (!user.default_billing_address_id) {
    //     return (
    //         <>
    //             <h3>Default Shipping Address:</h3> 
    //             <ul>
    //                 {renderDefaultAddress('shipping')}
    //             </ul>
    //             <h3>Default Billing Address:</h3> 
    //             <ul>
    //                 No default Billing Address added. Please add one. 
    //             </ul>
    //         </>
    //     )
    // } else {
    //     return (
    //         <>
    //             <h3>Default Shipping Address:</h3> 
    //             <ul>
    //                 {renderDefaultAddress('shipping')}
    //             </ul>
    //             <h3>Default Billing Address:</h3> 
    //             <ul>
    //                 {renderDefaultAddress('billing')}
    //             </ul>
    //         </>
    //     )
    // }
}
export default DefaultAddresses