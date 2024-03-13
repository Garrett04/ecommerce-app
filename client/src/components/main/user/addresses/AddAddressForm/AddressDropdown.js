import { City, Country, State } from "country-state-city";



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

    const renderAllStateOptions = () => {
        // if form field for country has been selected in then do this
        if (formData.country) {
            // finds the isoCode from the formData.country which has the name of the country 
            // and if it is equal to the country name then return it and access the isoCode property
            // finally store it in countryCode
            const countryCode = Country.getAllCountries().find(country => formData.country === country.name).isoCode;
            const states = State.getStatesOfCountry(countryCode);

            if (states.length > 0) {
                return states.map(state => (
                    <option key={state.isoCode} value={state.name}>
                        {state.name}
                    </option>
                ))
            }
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
            const citiesOfCountry = City.getCitiesOfCountry(countryCode);

            if (cities.length > 0) {
                return cities.map(city => (
                    <option key={city.name} value={city.name}>
                        {city.name}
                    </option>
                ))
            } else {
                // handling cases where the country has a city but no state
                return citiesOfCountry.map(city => (
                    <option key={city.name} value={city.name}>
                        {city.name}
                    </option>
                ))
            }
        }
    }

    return (
        <>
            <label htmlFor="country">Country: </label>
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
            <label htmlFor="city">State: </label>
            <select 
                id="state" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                required={renderAllStateOptions() ? true : false}
            >
                <option value="" disabled hidden>Select State</option>
                {renderAllStateOptions()}
            </select>
            <label htmlFor="city">City: </label>
            <select 
                id="city" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required={renderAllCityOptions() ? true : false}
            >
                <option value="" disabled hidden>Select City</option>
                {renderAllCityOptions()}
            </select>
        </>
    )
}

export default AddressDropdown