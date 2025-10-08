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
} from "@coreui/react";

export default function VendorOwnerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault(); // prevent default form submit reload
    const existingUsers = JSON.parse(localStorage.getItem("voperations") || "[]");
    const newUser = { id: Date.now(), ...formData };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("voperations", JSON.stringify(updatedUsers));

    // reset form
    setFormData({ type: "", name: "", email: "", status: "" });

    navigate("/vendor/operations"); // go back to listing page
  };

  const isFormValid =
    formData.name && formData.email && formData.status;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">
           User Type
          </h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSaveUser}>
            <CCardHeader className="mb-3">
              <strong>Basic Details</strong>
            </CCardHeader>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="name">User Name</CFormLabel>
                <CFormInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="type">User email ID</CFormLabel>
                <CFormInput
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter user email ID"
                  required
                />
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
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="text-center mt-4">
              <CButton
                type="submit"
                color="primary"
                disabled={!isFormValid}
              >
                Save
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
}
