import { useEffect } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import API from "../../apis/client";

const CheckoutSuccess = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const session_id = searchParams.get('session_id');

    useEffect(() => {
        // when user is redirected to payment success page it will change checkout_status to paid in checkout table
       const updateCheckoutStatus = async () => {
          try {
              const response = await API.put(`cart/${id}/checkout/checkout-success?session_id=${session_id}`, {
                  withCredentials: true
              });
              console.log("check2", response.data);
              return response.data;
          } catch (err) {
              throw err.response;
          }
        }
        updateCheckoutStatus();
    }, [id, session_id])

    return (
      <div className="checkout-success">
          <h2>Payment Successful</h2>
          <Link to="/">Go back to home page</Link>
          <Link to="/orders">Track your order</Link>
      </div>
    )
}

export default CheckoutSuccess