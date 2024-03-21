import { useNavigate } from "react-router-dom"


const GoBackButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (
      <button title="Go back" className="go-back-button" onClick={handleClick}>
        &#10154;
      </button>
    )
}
export default GoBackButton