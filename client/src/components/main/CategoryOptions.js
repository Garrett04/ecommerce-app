import { useDispatch, useSelector } from "react-redux";
import { getCategoriesError, getCategoriesStatus, selectCategories } from "../../features/categories/categoriesSlice";
import { useEffect } from "react";
import { fetchCategories } from "../../apis/categories";
import { fetchProducts, fetchProductsByCategory } from "../../apis/products";


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

    const handleClick = async (categoryId) => {
      try {
        dispatch(fetchProductsByCategory(categoryId));
      } catch (err) {
        throw err.status;
      }
    }

    const renderCategories = () => {
      return categories.map(category => (
        <li key={category.id} className="category">
          <button onClick={() => handleClick(category.id)}>
            {category.name}
          </button>
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
        {categoriesStatus 
          ? <li className="category"><button onClick={() => dispatch(fetchProducts())}>All Products</button></li>
          : null}
        {content}
      </ul>    
    );
}

export default CategoryOptions