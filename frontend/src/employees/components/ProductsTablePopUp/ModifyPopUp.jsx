import "./ModifyPopUp.css"
import { useState, useRef } from 'react';
import axios from "axios";

const editProduct = async function(product_id, product_name, product_category, product_price, product_active_sale){
  const response = await axios.put(import.meta.env.VITE_API_DOMAIN + "/api/product/",
    {
      "product_id": product_id,
      "product_name": product_name,
      "product_category": product_category,
      "product_price": product_price,
      "product_active_sale": product_active_sale
    },
    {
      withCredentials: true
    }
  );
  return response;
}

const deleteProduct = async function(product_id){
  const response = await axios.delete(import.meta.env.VITE_API_DOMAIN + `/api/product/?product_id=${product_id}`,
    {
      withCredentials: true
    }
  );

  console.log(response);
  return response;
}

const ModifyPopUp = function({onClose, onRefresh, product}) {
  const [productId, setProductId] = useState(product.p_id);
  const [productName, setProductName] = useState(product.p_name);
  const [productCategory, setProductCategory] = useState(product.p_category);
  const [productPrice, setProductPrice] = useState(product.p_price);
  const [productOnSale, setProductOnSale] = useState(product.active_sale);
  const fileInputRef = useRef(null);
  
  const upload = async function(p_id, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios({
      method: "put",
      url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'product' + '/' + 'photo' + '/' + p_id,
      withCredentials: true,
      data: formData,
      })
    .then(res => {
      alert("Succesfully upload photo")
    })
    .catch(er => console.log(er))
  }

  const handleButtonClick = (productId) => {
    fileInputRef.current?.setAttribute('data-product-id', productId);
    fileInputRef.current?.click();
  };

  const handleFileChange = function(event) {
    const productId = event.target.getAttribute('data-product-id');
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      upload(productId, file);
    }
  };

  const handleEditProduct = async() => {
    try {
      const response = await editProduct(productId, productName, productCategory, productPrice, productOnSale);
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      alert("Unexpected Error: Please try again.")
      onRefresh();
      onClose();
    }
  }

  const handleDeleteProduct = async() => {
    if (confirm("Are you sure to delete this product?") == true) {
      try {
      const response = await deleteProduct(productId);
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
      } catch (error) {
        alert("Unexpected Error: This item might be in use and cannot be deleted.")
        onRefresh();
        onClose();
      }
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
                  type="text"
                  value={productId}
                  disabled
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

          <p>

            <p className="on-sale-container">
              <div className="on-sale-item">
                <label htmlFor="onSale" className="inlineOnSale">On Sale</label>
              </div>
              <div className="on-sale-item">
                <div className="checkbox-wrapper-2">
                  <input type="checkbox" id="onSale" checked={productOnSale} onChange={(e) => setProductOnSale(e.target.checked)} className="sc-gJwTLC ikxBAC"/>
                </div>
              </div>
            </p>

            <input
              type="file"
              accept="image/jpg"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <a className="upload-photo" onClick={() => handleButtonClick(productId)}>Upload product photo</a>
            <p>
              <a className="delete-item" onClick={handleDeleteProduct}>Delete product item</a>
            </p>

          </p>

        <p className="center">
          <button 
            type="button"
            className="resend-payment-slip-btn big-font-btn"
            onClick={handleEditProduct}>
            Edit Product
          </button>
        </p>
        </div>
      </div>
    </div>
  )
}

export default ModifyPopUp