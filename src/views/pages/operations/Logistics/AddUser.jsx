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

export default function OwnerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("operations") || "[]");
    const newUser = { id: Date.now(), ...formData };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("operations", JSON.stringify(updatedUsers));

    // reset form
    setFormData({ name: "", email: "", userType: "", status: "" });

    navigate("/logistics/operations");
  };

  const isFormValid =
    formData.name && formData.email && formData.userType && formData.status;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">Operational User Type</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSaveUser}>
            <CCardHeader className="mb-3">
              <strong>Basic Details</strong>
            </CCardHeader>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="name">Operation Name</CFormLabel>
                <CFormInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter operation name"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">
                  Operational User Email ID
                </CFormLabel>
                <CFormInput
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter operational user email ID"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="userType">User Type</CFormLabel>
                <CFormSelect
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Logistics Coordinator">
                    Logistics Coordinator
                  </option>
                  <option value="Logistics Staff">Logistics Staff</option>
                </CFormSelect>
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
              <CButton type="submit" color="primary" disabled={!isFormValid}>
                Save
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
}
