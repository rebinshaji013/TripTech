import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CRow, CCol, CFormLabel
} from "@coreui/react";

export default function AddService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tripType: "",
    tripName: "",
    triptypeStatus: "Inactive",
    triptypeRemarks: "",
  });

  const [showFeedback, setShowFeedback] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle save
  const handleSaveTripType = (e) => {
    e.preventDefault();

    const existingTripTypes = JSON.parse(localStorage.getItem("triptypes") || "[]");
    const newTripType = { id: Date.now(), ...formData };
    const updatedTripTypes = [...existingTripTypes, newTripType];
    localStorage.setItem("triptypes", JSON.stringify(updatedTripTypes));
    setShowFeedback(true);
  };

  // Handle activation modal decision
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setFormData((prev) => ({ ...prev, triptypeStatus: updatedStatus }));

    // Update the last added service with activation choice
    const allTripTypes = JSON.parse(localStorage.getItem("triptypes") || "[]");
    const lastIndex = allTripTypes.length - 1;
    if (lastIndex >= 0) {
      allTripTypes[lastIndex].triptypeStatus = updatedStatus;
      localStorage.setItem("triptypes", JSON.stringify(allTripTypes));
    }

    setShowFeedback(false);
    setFormData({ tripType: "", tripName: "", triptypeStatus: "Inactive", triptypeRemarks: "" });
    navigate("/logistics/triptypes");
  };

  const isFormValid = formData.tripType && formData.tripName && formData.triptypeRemarks;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">Add Trip Type</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSaveTripType}>
            <CCardHeader className="mb-3">
              <strong>Trip Type Details</strong>
            </CCardHeader>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="tripType">Trip Type</CFormLabel>
                <CFormInput
                  id="tripType"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                  placeholder="Enter trip type"
                  required
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="tripName">Trip Name</CFormLabel>
                <CFormInput
                  id="tripName"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleChange}
                  placeholder="Enter trip name"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="triptypeStatus">Trip Type Status</CFormLabel>
                <CFormSelect
                  id="triptypeStatus"
                  name="triptypeStatus"
                  value={formData.triptypeStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Inactive">Inactive</option>
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="triptypeRemarks">Trip Type Remarks</CFormLabel>
                <CFormInput
                  id="triptypeRemarks"
                  name="triptypeRemarks"
                  value={formData.triptypeRemarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                  required
                />
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

      {/* Feedback Modal */}
      <CModal visible={showFeedback} onClose={() => setShowFeedback(false)}>
        <CModalHeader>
          <CModalTitle>Trip Type Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Trip Type has been created successfully.  
          Do you want to activate this trip type now?
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleActivationDecision(true)}>
            Yes
          </CButton>
          <CButton color="secondary" onClick={() => handleActivationDecision(false)}>
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
