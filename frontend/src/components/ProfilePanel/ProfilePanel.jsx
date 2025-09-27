import { useState, useEffect } from "react"
import { useNavigate, Link } from "@tanstack/react-router"
import deleteCookie from "../../function/deleteCookie"
import axios from "axios"
import "./ProfilePanel.css"

const logout = function() {
  deleteCookie('token');
}

const ProfilePanel = function() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [shippingDst, setShippingDst] = useState(data.defaultshippingdst);

  const updateShippingDst = async function(shippingDst) {
  try {
    const requestBody = { "defaultshippingdst": shippingDst };
    const response = await axios({
      method: "put",
      url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'profile' + '/' + 'defaultshippingdst',
      withCredentials: true,
      data: { defaultshippingdst: shippingDst },
    })
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
  // Make GET request to fetch data
    axios
            .get(import.meta.env.VITE_API_DOMAIN + "/api/profile", {withCredentials: true})
            .then((response) => {
            setData(response.data[0]);
            setShippingDst(response.data[0].defaultshippingdst);
          }).catch((error) => {
            if (error.status == 401) navigate({to: '/login'});
          });
  }, []);

  return (
  <div>
    <div>Welcome to Profile {data.username}</div>
    <div>Customer ID: {data.c_id}</div>
    <div>First Name: {data.firstname}</div>
    <div>LastName: {data.lastname}</div>

    <br/>
    <label htmlFor="defaultshippingdst">Default Shipping Destination</label><br/>
    <textarea id="defaultshippingdst" name="defaultshippingdst" rows="4" cols="50" value={shippingDst} onChange={e => {{setShippingDst(e.target.value)}
  console.log("Changed", e.target.value)}}></textarea><br/>
    <button onClick={() => updateShippingDst(shippingDst)}>Update shipping destination</button><br/>
    <Link to="/" onClick={logout}>Logout</Link>
  </div>
  )
}

export default ProfilePanel;