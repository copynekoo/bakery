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
  const [profile, setProfile] = useState(null);
  const [shippingDst, setShippingDst] = useState("");

  const updateShippingDst = async function(shippingDestination) {
    try {
      const requestBody = { "defaultshippingdst": shippingDestination };
      await axios({
        method: "put",
        url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'profile' + '/' + 'defaultshippingdst',
        withCredentials: true,
        data: requestBody,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/profile", {withCredentials: true})
      .then((response) => {
        const profileData = response.data?.[0] || null;
        setProfile(profileData);
        setShippingDst(profileData?.defaultshippingdst || "");
      }).catch((error) => {
        if (error?.response?.status === 401) navigate({to: '/login'});
      });
  }, [navigate]);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <div>Welcome to Profile {profile.username}</div>
      <div>Customer ID: {profile.c_id}</div>
      <div>First Name: {profile.firstname}</div>
      <div>LastName: {profile.lastname}</div>

      <br/>
      <label htmlFor="defaultshippingdst">Default Shipping Destination</label><br/>
      <textarea id="defaultshippingdst" name="defaultshippingdst" rows="4" cols="50" value={shippingDst} onChange={e => setShippingDst(e.target.value)}></textarea><br/>
      <button onClick={() => updateShippingDst(shippingDst)}>Update shipping destination</button><br/>
      <Link to="/" onClick={logout}>Logout</Link>
    </div>
  )
}

export default ProfilePanel;
