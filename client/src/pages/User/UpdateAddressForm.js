import { useEffect, useState } from "react";
import { fetchAddressesByUserId, updateAddress } from "../../apis/addresses";
import { useDispatch, useSelector } from "react-redux";
import { getAddressesStatus, selectAddresses } from "../../features/user/addressesSlice";
import { useParams } from "react-router-dom";
import AddressDropdown from "../../components/main/user/addresses/AddressForms/AddressDropdown";
import GoBackButton from "../../components/GoBackButton";


const UpdateAddressForm = () => {
    const addresses = useSelector(selectAddresses);
    const addressesStatus = useSelector(getAddressesStatus);
    const [disabled, setDisabled] = useState(true);

    const [formData, setFormData] = useState({
        address_line1: "",
        address_line2: "",
        country: "",
        state: "",
        city: "",
        postal_code: ""
    })

    const dispatch = useDispatch();

    const [msg, setMsg] = useState("");

    const { id } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value })

        // for now just be able to set the disabled attribute of submit input to false.
        setDisabled(false);
    }

    useEffect(() => {
        dispatch(fetchAddressesByUserId());
    }, [dispatch])

    useEffect(() => {
        let address;
        if (addressesStatus === 'fulfilled') {
            address = addresses.find(addressToFind => addressToFind.id === parseInt(id));
            // console.log(address)
            setFormData(address);
        }
    }, [id, addresses, addressesStatus])

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateAddress(id, formData)
            setMsg("Address Updated Successfully")

            // console.log(updatedAddress);
        } catch (err) {
            throw err.status;
        }
    }

    if (addressesStatus === 'fulfilled' && addresses) {
        return (
            <>
                <form onSubmit={handleAddressUpdate} className="address-update-form">
                    <label htmlFor="address_line1">Address Line 1</label>
                    <input 
                        type="text"
                        id="address_line1"
                        name="address_line1"
                        value={formData.address_line1} 
                        onChange={handleChange} 
                    />
                    <label htmlFor="address_line2">Address Line 2</label>
                    <input 
                        type="text" 
                        id="address_line2"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleChange} 
                    />

                    <AddressDropdown
                        formData={formData}
                        handleChange={handleChange}
                    />

                    <label htmlFor="postal_code">Postal-code</label>
                    <input 
                        type="text"
                        id="postal_code"
                        name="postal_code" 
                        value={formData.postal_code} 
                        onChange={handleChange}
                    />
                    {msg}
                    <input type="submit" value="Edit Address" disabled={disabled} />
                </form>
                <GoBackButton />
            </>
        )
    }
}

export default UpdateAddressForm;