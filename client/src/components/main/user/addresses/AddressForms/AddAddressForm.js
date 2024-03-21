import { useState } from "react";
import { createAddress, fetchAddressesByUserId } from "../../../../../apis/addresses";
import { useDispatch } from "react-redux";
import AddressDropdown from "./AddressDropdown";
import { fetchUserData } from "../../../../../apis/user";


const AddAddressForm = ({
    setMsg
}) => {
    const [formData, setFormData] = useState({ 
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
    })
    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        setDisabled(false);
    }

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createAddress(formData);

            // display some message later saying its successful
            setMsg("Successfully created new address");

            dispatch(fetchAddressesByUserId()); // To update addresses state
            dispatch(fetchUserData());

        } catch (err) {
            throw err.status;
        }

        // Clear all fields
        setFormData({
            address_line1: "",
            address_line2: "",
            country: "",
            state: "",
            city: "",
            postal_code: ""
        })

        setDisabled(true);
    }
    

    return (
        <div className="add-address-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="address_line1">Address Line 1 </label>
                <input 
                    type="text" 
                    id="address_line1" 
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="address_line2">Address Line 2 </label>
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
                
                <label htmlFor="postal_code">Postal Code </label>
                <input 
                    type="text" 
                    id="postal_code" 
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                />
                <input type="submit" value="Create new address" disabled={disabled} />
            </form>
        </div>
    )
}

export default AddAddressForm;