import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import deleteCookie from "../../function/deleteCookie";
import axios from "axios";
import "./ProfilePanel.css";

const logout = function () {
  deleteCookie("token");
};

const ProfilePanel = function () {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [shippingDst, setShippingDst] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const updateShippingDst = async function (shippingDestination) {
    setSaving(true);
    setSaveMsg("");
    try {
      const requestBody = { defaultshippingdst: shippingDestination };
      await axios({
        method: "put",
        url:
          import.meta.env.VITE_API_DOMAIN +
          "/api/profile/defaultshippingdst",
        withCredentials: true,
        data: requestBody,
      });
      setSaveMsg("Shipping destination updated.");
    } catch (error) {
      console.log(error);
      setSaveMsg("Failed to update shipping destination.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/profile", {
        withCredentials: true,
      })
      .then((response) => {
        const profileData = response.data?.[0] || null;
        setProfile(profileData);
        setShippingDst(profileData?.defaultshippingdst || "");
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          navigate({ to: "/login" });
        } else {
          console.log(error);
        }
      });
  }, [navigate]);

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* top header */}
        <div className="profile-top-bar">
          <h1 className="profile-title">Your Profile</h1>
          <Link to="/" onClick={logout} className="profile-logout-btn">
            <span className="profile-logout-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v3" />
                <path d="M10 17 15 12 10 7" />
                <path d="M15 12H3" />
                <path d="M5 21h4a2 2 0 0 0 2-2v-1" />
              </svg>
            </span>
            Logout
          </Link>
        </div>

        {/* Account details */}
        <section className="profile-section">
          <h2 className="profile-section-title">Account Details</h2>
          <div className="profile-details-grid">
            {/* row 1 – full width */}
            <div className="profile-field profile-field--span2">
              <p className="profile-label">Customer ID</p>
              <p className="profile-value">{profile.c_id}</p>
            </div>

            {/* row 2 – two columns */}
            <div className="profile-field">
              <p className="profile-label">First Name</p>
              <p className="profile-value">{profile.firstname}</p>
            </div>
          <div className="profile-field">
          <p className="profile-label">Last Name</p>
          <p className="profile-value">{profile.lastname}</p>
          </div>
        </div>
        </section>


        <hr className="profile-divider" />

        {/* Shipping destination */}
        <section className="profile-section">
          <h2 className="profile-section-title">Default Shipping Destination</h2>
          <p className="profile-helper">
            This address will be used as your default delivery destination for
            bakery orders.
          </p>
          <textarea
            id="defaultshippingdst"
            name="defaultshippingdst"
            rows="4"
            className="profile-textarea"
            value={shippingDst}
            onChange={(e) => setShippingDst(e.target.value)}
          ></textarea>
          <div className="profile-actions">
            <button
              onClick={() => updateShippingDst(shippingDst)}
              className="profile-primary-btn"
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Shipping Destination"}
            </button>
            {saveMsg && <span className="profile-save-msg">{saveMsg}</span>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePanel;
