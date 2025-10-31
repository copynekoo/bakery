import "./ProductsTablePopUp.css"
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();
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
      if (error.response.status === 401) {
        alert("Unauthorized Access")
        navigate({to: "/employees"})
      }
    const handleEditProduct = async() => {
    try {
      const response = await editProduct(productId, productName, productCategory, productPrice, productOnSale);
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        alert("Unauthorized Access")
        navigate({to: "/employees"})
      }
      onRefresh();
      onClose();
    }
  }
      onRefresh();
      onClose();
    }
  }

  return (
    <div className="products-table-modal">
      <div className="products-table-modal-content">
        <span className="products-table-close" onClick={onClose}>&times;</span>
        <div className="products-table-textfield-input-container">
          <p>
            <label htmlFor="productId">Product ID:</label>
                <input
                  id="productId"
                  type="number"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="products-table-textfield-input"
                  min="1"
            />
          </p>

          <p>
            <label htmlFor="productName">Product Name:</label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="products-table-textfield-input"
            />
          </p>

          <p>
            <label htmlFor="productId">Product Category:</label>
                <input
                  id="productCategory"
                  type="text"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="products-table-textfield-input"
            />
          </p>

          <p>
            <label htmlFor="productId">Product Price:</label>
                <input
                  id="productPrice"
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="products-table-textfield-input"
            />
          </p>

        <p className="products-table-center">
          <button 
            type="button"
            className="products-table-resend-payment-slip-btn big-font-btn"
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