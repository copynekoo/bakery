import "./ProductItem.css"
import ProductItemStatusBar from "./ProductItemStatusBar.jsx";

const ProductItem = function({p_id, p_name, p_price, remainingItem, img_url}) {
  return (
    <div className="card" key={p_id}>
      <img src={img_url} alt={p_name} style={{width: 100 + '%'}}/>
      <h2>{p_name}</h2>
      <p className="price">{p_price} บาท</p>
      <ProductItemStatusBar remainingItem={remainingItem}/>
    </div> 
  )
}

export default ProductItem;