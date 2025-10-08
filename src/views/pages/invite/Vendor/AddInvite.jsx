import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

export default function VTripInviteDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    requestId: "",
    lcName: "",
    email: "",
    company: "",
    status: "",
  });

  const [errors, setErrors] = useState({ email: "" });
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Generate Request ID using first 3 letters of company + random 4 digit number
  const generateRequestId = (company) => {
    if (!company) return "";
    const prefix = company.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email address.",
      });

      if (validateEmail(value)) {
        const registeredVendors = JSON.parse(localStorage.getItem("registeredVendors") || "[]");
        const existingUser = registeredVendors.find((u) => u.email === value);

        if (existingUser) {
          // auto-populate hidden fields
          setFormData({
            ...formData,
            email: value,
            lcName: existingUser.lcName,
            company: existingUser.company,
            requestId: generateRequestId(existingUser.company),
          });
        } else {
          setFormData({
            ...formData,
            email: value,
            lcName: "",
            company: "",
            requestId: "",
          });
          setShowErrorModal(true);
        }
      } else {
        setFormData({
          ...formData,
          email: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSaveInvite = (e) => {
    e.preventDefault();

    if (!formData.lcName || !formData.company) {
      setShowErrorModal(true);
      return;
    }

    const existingInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    const newInvite = { id: Date.now(), ...formData };
    const updatedInvites = [...existingInvites, newInvite];
    localStorage.setItem("vendorInvites", JSON.stringify(updatedInvites));

    const lcInvites = JSON.parse(localStorage.getItem("lcInvites") || "[]");
    const updatedLcInvites = [...lcInvites, newInvite];
    localStorage.setItem("lcInvites", JSON.stringify(updatedLcInvites));

    // reset form
    setFormData({ requestId: "", lcName: "", email: "", company: "", status: "" });
    setErrors({ email: "" });

    navigate("/vendor/invites");
  };

  const isFormValid = formData.email && formData.status && !errors.email;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">Vendor Invite</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSaveInvite}>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email ID</CFormLabel>
                <CFormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter registered vendor email"
                  required
                  invalid={!!errors.email}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="text-center mt-4">
              <CButton type="submit" color="primary" disabled={!isFormValid}>
                Send Invite
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Error Modal */}
      <CModal visible={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Vendor Not Registered</CModalTitle>
        </CModalHeader>
        <CModalBody>
          This email is not registered in the system. You cannot send an invite.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
