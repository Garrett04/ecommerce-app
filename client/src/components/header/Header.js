import Cart from "./CartButton"
import SearchBar from "./SearchBar"
import SignInButton from "./SignInButton"

const Header = () => {
  return (
    <div className="header">
      <h1><span>S</span>hop<span>W</span>ise</h1>
      <SearchBar />
      <Cart />
      <SignInButton />
    </div>
  )
}
export default Header