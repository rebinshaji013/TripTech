import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";

export default function OwnerDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    location: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = () => {
    const existingUsers = JSON.parse(localStorage.getItem("operations") || "[]");
    const updatedUsers = [...existingUsers, formData];
    localStorage.setItem("operations", JSON.stringify(updatedUsers));

    navigate("/operations"); // go back to listing page
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">Operational User Details</h5>
        </CCardHeader>
        <CCardBody>
          <CForm>
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
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="location">Operation User Location</CFormLabel>
                <CFormInput
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="type">User Type</CFormLabel>
                <CFormInput
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Enter user type"
                />
              </CCol>
              <CCol md={6}>
              <CFormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
              </CCol>
            </CRow>

            <div className="text-center mt-4">
              <CButton color="primary" onClick={handleSaveUser}>
                Save
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
}
