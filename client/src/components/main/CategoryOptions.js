import { useDispatch, useSelector } from "react-redux";
import { getCategoriesError, getCategoriesStatus, selectCategories } from "../../features/categories/categoriesSlice";
import { useEffect } from "react";
import { fetchCategories } from "../../apis/categories";
import { fetchProducts, fetchProductsByCategory } from "../../apis/products";
import { DNA } from "react-loader-spinner";


const CategoryOptions = () => {
    const categories = useSelector(selectCategories);
    const categoriesStatus = useSelector(getCategoriesStatus);
    const categoriesError = useSelector(getCategoriesError);
    const dispatch = useDispatch();

    useEffect(() => {
      if (categoriesStatus === 'idle') {
        dispatch(fetchCategories());
      }
    }, [categoriesStatus, dispatch]);

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
      content = <DNA wrapperStyle={{ margin: 'auto', marginTop: '-1rem' }} />;
    } else if (categoriesStatus === 'fulfilled') {
      content = renderCategories();
    } else if (categoriesStatus === 'rejected') {
      content = categoriesError;
    }

    return (
      <ul className="categories">
        {categoriesStatus === 'fulfilled'
          && 
        <li className="category">
          <button onClick={() => dispatch(fetchProducts())}>All Products</button>
        </li>}
        {content}
      </ul>    
    );
}

export default CategoryOptions