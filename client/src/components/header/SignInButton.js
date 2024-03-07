import accountIcon from "../../resources/images/account.svg";

const SignInButton = () => {
  return (
    <div className="signIn">
        <button title="Sign in">
            <img src={accountIcon} alt="Sign In Icon" />
        </button>
    </div>
  )
}
export default SignInButton;