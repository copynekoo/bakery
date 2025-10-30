import { useEffect, useMemo, useState } from "react"
import ProductItem from '../ProductItem/ProductItem.jsx'
import "./ProductDisplay.css"
import axios from "axios"

const ProductDisplay = function() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    // Make GET request to fetch data
        axios
            .get(import.meta.env.VITE_API_DOMAIN + "/api/productItems?on_sale=true")
            .then((response) => {
            setData(response.data);
          });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/product/categories")
      .then((response) => {
        const fetchedCategories = response.data
          .map((category) => category.p_category)
          .filter((category) => Boolean(category));
        const uniqueCategories = [...new Set(fetchedCategories)];
        setCategories(uniqueCategories);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return data.filter((product) => {
      const matchesCategory =
        categoryFilter === 'all' ? true : product.p_category === categoryFilter;
      return matchesCategory;
    });
  }, [data, categoryFilter]);

  return (
    <>
      <div className="productFilters">
        <div className="productFilter">
          <label htmlFor="categoryFilter">Category:</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="productContainer">
        {filteredProducts.map((product) => {
          const img_url = import.meta.env.VITE_API_DOMAIN + '/' + 'assets' + '/' + 'products' + '/' + product.p_id + '.jpg';
          const key = product.p_id;
          const id = product.p_id;
          const name = product.p_name;
          const price = product.p_price;
          const remainingItem = product.remaining_item;
          return <ProductItem key={key} p_id={id} p_name={name} p_price={price} remainingItem={remainingItem} img_url={img_url}/>;
        })}
      </div>
    </>
  )
}

export default ProductDisplay;
