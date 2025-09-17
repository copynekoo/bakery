import React, { useEffect, useState } from "react"
import axios from "axios";

// const getProducts = function() {
//   axios.get('http://localhost:3000/api/product')
//     .then(function (response) {
//       // handle success
//       console.log(response);
//       return response;
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
//     .finally(function () {
//       // always executed
//     });
// }

// getProducts();

const ProductItem = function() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Make GET request to fetch data
        axios
            .get("http://localhost:3000/api/product")
            .then((response) => {
            setData(response.data);
          });
  }, []);

  return (
    <ul>
      {data.map((product) => {
        return <li key={product.p_id}>{product.p_name}</li>
      })}
    </ul>
  )
}

export default ProductItem;