import Cart from "./CartButton"
import SearchBar from "./SearchBar"
import SignInButton from "./AccountButton"
import Logout from "./LogoutButton"
import { Link } from "react-router-dom"
import ViewOrdersButton from "./ViewOrdersButton"

const Header = () => {
  return (
    <div className="header">
      <h1><a href="/"><span>S</span>hop<span>W</span>ise</a></h1>
      {/* <SearchBar /> */}
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