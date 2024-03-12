import CategoryOptions from "./CategoryOptions"
import Banner from "./Banner"
import Products from "./Products"
import { useDispatch} from "react-redux";
import { useEffect } from "react";
import { fetchGoogleUser } from "../../apis/auth";

const Main = () => {
  const dispatch = useDispatch();

  // dispatch fetchGoogleUser once user is redirected to home page
  useEffect(() => {
    dispatch(fetchGoogleUser());
  }, [dispatch]);

  return (
    <div className="main">
        <CategoryOptions />
        <Banner />
        <Products />
    </div>
  )
}
export default Main;