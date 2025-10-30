import "./ProductsTablePopUp.css"
import { useState } from 'react';
import axios from "axios";

const addProduct = async function(product_id, product_name, product_category, product_price){
  const response = await axios.post(import.meta.env.VITE_API_DOMAIN + "/api/product/",
    {
      "product_id": product_id,
      "product_name": product_name,
      "product_category": product_category,
      "product_price": product_price
    },
    {
      withCredentials: true
    }
  );
  console.log(response);
  return response;
}

const ProductsTablePopUp = function({onClose, onRefresh}) {
  const [productId, setProductId] = useState();
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const handleAddProduct = async() => {
    try {
      const response = await addProduct(productId, productName, productCategory, productPrice);
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.log(error);
      alert("Unexpected Error: Please try again.")
      onRefresh();
      onClose();
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="textfield-input-container">
          <p>
            <label htmlFor="productId">Product ID:</label>
                <input
                  id="productId"
                  type="number"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="textfield-input"
            />
          </p>

          <p>
            <label htmlFor="productName">Product Name:</label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="textfield-input"
            />
          </p>

          <p>
            <label htmlFor="productId">Product Category:</label>
                <input
                  id="productCategory"
                  type="text"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="textfield-input"
            />
          </p>

          <p>
            <label htmlFor="productId">Product Price:</label>
                <input
                  id="productPrice"
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="textfield-input"
            />
          </p>

        <p className="center">
          <button 
            type="button"
            className="resend-payment-slip-btn big-font-btn"
            onClick={handleAddProduct}>
            Add Product
          </button>
        </p>

        </div>
      </div>
    </div>
  )
}

export default ProductsTablePopUp
