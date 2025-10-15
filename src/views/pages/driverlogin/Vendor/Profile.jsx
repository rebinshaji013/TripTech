import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilReload, cilSave } from "@coreui/icons";

export default function VendorProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    mobile: "",
    address: "",
    avatar: "",
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Load logistics user from localStorage
  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("vendorUser")) || {
        username: "vendor",
        email: "vendor@example.com",
        name: "Trip Owner",
        mobile: "",
        address: "",
        avatar: "",
      };
    setUser(storedUser);
    setAvatarPreview(storedUser.avatar || "");
  }, []);

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save changes to localStorage
  const handleSaveChanges = () => {
    localStorage.setItem("vendorUser", JSON.stringify(user));
    alert("Profile details updated successfully!");
  };

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${user.email}`);
    setShowResetModal(false);
  };

  return (
    <div className="p-4">
      <h4 className="fw-bold mb-4 text-center">Vendor Profile</h4>

      <CCard className="shadow-sm border-0 mx-auto" style={{ maxWidth: "600px" }}>
        <CCardHeader>
          <strong>Edit Profile</strong>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <div className="text-center mb-4">
              <label htmlFor="avatarUpload" style={{ cursor: "pointer" }}>
                <img
                  src={
                    avatarPreview ||
                    "https://via.placeholder.com/120?text=Upload+Avatar"
                  }
                  alt="Avatar"
                  className="rounded-circle mb-2"
                  width="120"
                  height="120"
                />
              </label>
              <CFormInput
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              <p className="text-muted small">Click image to change avatar</p>
            </div>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Username"
                  name="username"
                  value={user.username}
                  disabled
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Email"
                  name="email"
                  value={user.email}
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Full Name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Mobile Number"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

            <CFormTextarea
              label="Address / Location"
              name="address"
              rows={3}
              value={user.address}
              onChange={handleChange}
              className="mb-4"
            />

            <div className="text-center d-flex justify-content-center gap-3">
              <CButton color="success" onClick={handleSaveChanges}>
                <CIcon icon={cilSave} className="me-2" />
                Save Changes
              </CButton>

              <CButton
                color="info"
                className="text-white"
                onClick={() => setShowResetModal(true)}
              >
                <CIcon icon={cilReload} className="me-2" />
                Reset Password
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Reset Password Modal */}
      <CModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Reset Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Are you sure you want to send a password reset link to{" "}
            <strong>{user.email}</strong>?
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </CButton>
          <CButton color="info" className="text-white" onClick={handleResetPassword}>
            Send Reset Link
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
