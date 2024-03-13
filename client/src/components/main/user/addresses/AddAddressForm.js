import { useState } from "react";
import { createAddress, fetchAddressesByUserId } from "../../../../apis/addresses";
import { Country, State, City } from "country-state-city";
import { useDispatch } from "react-redux";


const AddAddressForm = () => {
    const [formData, setFormData] = useState({ 
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
    })

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newAddress = await createAddress(formData);

            // display some message later saying its successful
            console.log(newAddress);

            dispatch(fetchAddressesByUserId()); // To update addresses state

        } catch (err) {
            throw err.status;
        }
    }

    const renderAllCountryOptions = () => {
        const countries = Country.getAllCountries();
        return countries.map(country => (
            <option key={country.isoCode} value={country.name}>
                {country.name}
            </option>
        ))
    }

    const renderAllStateOptions = () => {
        // if form field for country has been selected in then do this
        if (formData.country) {
            // finds the isoCode from the formData.country which has the name of the country 
            // and if it is equal to the country name then return it and access the isoCode property
            // finally store it in countryCode
            const countryCode = Country.getAllCountries().find(country => formData.country === country.name).isoCode;
            const states = State.getStatesOfCountry(countryCode);

            return states.map(state => (
                <option key={state.isoCode} value={state.name}>
                    {state.name}
                </option>
            ))
        }
    }

    const renderAllCityOptions = () => {
        // if form field for country and state have been selected then do this
        if (formData.country && formData.state) {
            const countryCode = Country.getAllCountries().find(country => formData.country === country.name).isoCode;
            // finds the isoCode from the formData.state which has the name of the state 
            // and if it is equal to the state name then return it and access the isoCode property
            // finally store it in stateCode
            const stateCode = State.getAllStates().find(state => formData.state === state.name).isoCode;

            const cities = City.getCitiesOfState(countryCode, stateCode);

            return cities.map(city => (
                <option key={city.name} value={city.name}>
                    {city.name}
                </option>
            ))
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
                <label htmlFor="country">Country: </label>
                <select  
                    id="country" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>Select country</option>
                    {renderAllCountryOptions()}
                </select>
                <label htmlFor="state">State: </label>
                <select 
                    id="state" 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>Select state</option>
                    {renderAllStateOptions()}
                </select>
                <label htmlFor="city">City: </label>
                <select 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>Select city</option>
                    {renderAllCityOptions()}
                </select>
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
        </div>
    )
}

export default AddAddressForm;