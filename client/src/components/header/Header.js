import Cart from "./CartButton"
import SearchBar from "./SearchBar"
import SignInButton from "./AccountButton"

const Header = () => {
  return (
    <div className="header">
      <h1><span>S</span>hop<span>W</span>ise</h1>
      <SearchBar />
      <div className="right">
        <Cart />
        <SignInButton />
      </div>
    </div>
  )
}
export default Header