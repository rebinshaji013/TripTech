import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilReload } from "@coreui/icons";

export default function LogisticsProfile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [showResetModal, setShowResetModal] = useState(false);

  // Auto-populate Logistics user details
  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("logisticsUser")) || {
        username: "admin",
        email: "logisticsadmin@example.com",
      };
    setUser(storedUser);
  }, []);

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${user.email}`);
    setShowResetModal(false);
  };

  return (
    <div className="p-4">
      <h4 className="fw-bold mb-4 text-center">Logistics User Profile</h4>

      <CCard className="shadow-sm border-0 mx-auto" style={{ maxWidth: "500px" }}>
        <CCardHeader>
          <strong>User Details</strong>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CFormInput
              type="text"
              label="Username"
              value={user.username}
              disabled
              className="mb-3"
            />
            <CFormInput
              type="email"
              label="Email ID"
              value={user.email}
              disabled
              className="mb-4"
            />

            <div className="text-center">
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
      <CModal visible={showResetModal} onClose={() => setShowResetModal(false)} alignment="center">
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
