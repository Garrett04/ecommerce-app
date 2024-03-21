import Cart from "./CartButton"
import SearchBar from "./SearchBar"
import SignInButton from "./AccountButton"
import Logout from "./LogoutButton"
import { Link } from "react-router-dom"
import ViewOrdersButton from "./ViewOrdersButton"

const Header = () => {
  return (
    <div className="header">
      <h1 className="desktop">
        <a href="/">
          <span className="logo">S</span>hop<span className="logo">W</span>ise
        </a>
      </h1>
      <div className="mobile">
        <a href="/">
          <h1>SW</h1>
          <span className="logo">S</span>hop<span className="logo">W</span>ise
        </a>
      </div>
      {/* <SearchBar /> Component has been deprecated */}
      <div className="right">
        <Cart />
        <ViewOrdersButton />
        <SignInButton />
        <Logout />
      </div>
    </div>
  )
}
export default Header