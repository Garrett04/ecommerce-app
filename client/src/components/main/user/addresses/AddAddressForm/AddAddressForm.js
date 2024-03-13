import { useState } from "react";
import { createAddress, fetchAddressesByUserId } from "../../../../../apis/addresses";
import { useDispatch } from "react-redux";
import AddressDropdown from "./AddressDropdown";


const AddAddressForm = () => {
    const [formData, setFormData] = useState({ 
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
    })

    const [msg, setMsg] = useState();

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newAddress = await createAddress(formData);

            // display some message later saying its successful
            setMsg("Successfully created new address");

            dispatch(fetchAddressesByUserId()); // To update addresses state

        } catch (err) {
            throw err.status;
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'address_line1') setFormData({ ...formData, address_line1: e.target.value })
        else if (e.target.name === 'address_line2') setFormData({ ...formData, address_line2: e.target.value });
        else if (e.target.name === 'city') setFormData({ ...formData, city: e.target.value });
        else if (e.target.name === 'state') setFormData({ ...formData, state: e.target.value });
        else if (e.target.name === 'postal_code') setFormData({ ...formData, postal_code: e.target.value });
        else if (e.target.name === 'country') setFormData({ ...formData, country: e.target.value });
    }

    return (
        <div className="add-address-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="address_line1">Address Line 1: </label>
                <input 
                    type="text" 
                    id="address_line1" 
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="address_line2">Address Line 2: </label>
                <input 
                    type="text" 
                    id="address_line2" 
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    required
                />
                
                <AddressDropdown 
                    formData={formData}
                    handleChange={handleChange} 
                />
                
                <label htmlFor="postal_code">Postal Code: </label>
                <input 
                    type="text" 
                    id="postal_code" 
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                />
                <input type="submit" value="Create new address"/>
            </form>
            {msg}
        </div>
    )
}

export default AddAddressForm;