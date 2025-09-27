import { useEffect, useState } from "react"
import ProductItem from '../ProductItem/ProductItem.jsx'
import "./ProductDisplay.css"
import axios from "axios"
import { snake_case_string } from '../../function/camelCaseToSnakeCase.js'

const ProductDisplay = function() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Make GET request to fetch data
        axios
            .get(import.meta.env.VITE_API_DOMAIN + "/api/productItems")
            .then((response) => {
            setData(response.data);
          });
  }, []);

  return (
    <div className="productContainer">
      {data.map((product) => {
        const img_url = import.meta.env.VITE_API_DOMAIN + '/' + 'assets' + '/' + 'products' + '/' + snake_case_string(product.p_name) + '.jpg';
        const key = product.p_id;
        const id = product.p_id;
        const name = product.p_name;
        const price = product.p_price;
        const remainingItem = product.remaining_item;
        return <ProductItem key={key} p_id={id} p_name={name} p_price={price} remainingItem={remainingItem} img_url={img_url}/>
      })}
    </div>
  )
}

export default ProductDisplay;