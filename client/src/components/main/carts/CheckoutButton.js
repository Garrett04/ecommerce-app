import { createCheckoutSession } from "../../../apis/checkout";

const CheckoutButton = ({
    id, // cart id
    disabled
}) => {
    const handleCheckout = async () => {
        try {
          const checkoutSession = await createCheckoutSession(id);

          // Redirect to stripe payment page
          window.location.href = checkoutSession.url;
        } catch (err) {
          throw err.status;
        }
      }

    return (
        <button onClick={handleCheckout} disabled={disabled}>
            Checkout
        </button>
    )
}

export default CheckoutButton;