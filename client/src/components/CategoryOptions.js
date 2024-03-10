import { useDispatch, useSelector } from "react-redux";
import { getCategoriesError, getCategoriesStatus, selectCategories } from "../features/categories/categoriesSlice";
import { useEffect } from "react";
import { fetchCategories } from "../apis/categories";


const CategoryOptions = () => {
    const categories = useSelector(selectCategories);
    const categoriesStatus = useSelector(getCategoriesStatus);
    const categoriesError = useSelector(getCategoriesError);
    const dispatch = useDispatch();

    useEffect(() => {
      if (categoriesStatus === 'idle') {
        dispatch(fetchCategories());
      }
    }, [dispatch]);

    const renderCategories = () => {
      return categories.map(category => (
        <li key={category.id} className="category">
          {category.name}
        </li>
      ))
    }

    let content;
    if (categoriesStatus === 'pending') {
      content = 'Loading...';
    } else if (categoriesStatus === 'fulfilled') {
      content = renderCategories();
    } else if (categoriesStatus === 'rejected') {
      content = categoriesError;
    }

    return (
      <ul className="categories">
        {content}
      </ul>    
    );
}

export default CategoryOptions