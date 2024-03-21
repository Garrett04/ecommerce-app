import Logout from "./LogoutButton"
import ViewOrdersButton from "./ViewOrdersButton"
import ViewCartsButton from "./ViewCartsButton"
import ViewAccountButton from "./ViewAccountButton"

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
        <ViewCartsButton />
        <ViewOrdersButton />
        <ViewAccountButton />
        <Logout />
      </div>
    </div>
  )
}
export default Header