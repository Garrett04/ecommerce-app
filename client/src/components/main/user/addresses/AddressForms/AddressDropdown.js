import { Country } from "country-state-city";

const AddressDropdown = ({
    formData,
    handleChange
}) => {

    const renderAllCountryOptions = () => {
        const countries = Country.getAllCountries();
        return countries.map(country => (
            <option key={country.isoCode} value={country.name}>
                {country.name}
            </option>
        ))
    }

    return (
        <>
            <label htmlFor="country">Country</label>
            <select  
                id="country" 
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
            >
                <option value="" disabled hidden>Select Country</option>
                {renderAllCountryOptions()}
            </select>
            <label htmlFor="state">State</label>
            <input 
            type="text"
                id="state" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                maxLength="100"
            />
            <label htmlFor="city">City</label>
            <input 
                type="text"
                id="city" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                maxLength="100"
            />
        </>
    )
}

export default AddressDropdown