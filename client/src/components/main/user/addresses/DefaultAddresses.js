import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/user/userSlice";
import { selectAddresses } from "../../../../features/user/addressesSlice";
import { useEffect, useState } from "react";


const DefaultAddresses = () => {
    const user = useSelector(selectUser);
    const addresses = useSelector(selectAddresses);

    const [msg, setMsg] = useState({
        defaultShippingAddress: "",
        defaultBillingAddress: "",
    });

    useEffect(() => {
        if (!user.default_shipping_address_id && !user.default_billing_address_id) {
            setMsg({ 
                ...msg, 
                defaultBillingAddress: "No default Billing Address added. Please add one.", 
                defaultShippingAddress: "No default Shipping Address added. Please add one."
            });
        } else if (!user.default_shipping_address_id) {
            setMsg({
                ...msg, 
                defaultShippingAddress: "No default Shipping Address added. Please add one."
            })
        } else if (!user.default_billing_address_id) {
            setMsg({ 
                ...msg, 
                defaultBillingAddress: "No default Billing Address added. Please add one."
            })
        }
    }, [setMsg, user.default_shipping_address_id, user.default_billing_address_id])

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
            }) => (
                <li key={id}>
                    {address_line_1}
                    {address_line_2}
                    {country}
                    {state}
                    {city}
                    {postal_code}
                </li>
            ))
        } else if (option === 'billing') {
            return default_billing_address.map(({
                id,
                address_line_1,
                address_line_2,
                country,
                state,
                city,
                postal_code,
            }) => (
                <li key={id}>
                    {address_line_1}
                    {address_line_2}
                    {country}
                    {state}
                    {city}
                    {postal_code}
                </li>
            ))
        }
    }

    return (
        <>
            <h3>Default Shipping Address:</h3> 
            <ul>
                {msg.defaultShippingAddress}
                {renderDefaultAddress('shipping')}
            </ul>
            <h3>Default Billing Address:</h3> 
            <ul>
                {msg.defaultBillingAddress}
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