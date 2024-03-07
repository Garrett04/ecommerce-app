import { useCallback, useState } from "react";

const SearchBar = () => {
    const [term, setTerm] = useState("");

    const handleChange = useCallback((e) => setTerm(e.target.value));

    return (
        <div className="searchBar">
            <input type="text" name="term" value={term} onChange={handleChange} />
        </div>
    )
}
export default SearchBar