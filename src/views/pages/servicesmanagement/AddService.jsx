import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from "@coreui/react";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState("");
  const [status, setStatus] = useState("Active");
  const [amount, setAmount] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceCode, setServiceCode] = useState("");

  const [openVendorEstimate, setOpenVendorEstimate] = useState(false);

  const handleSaveService = () => {
    const newService = {
      type: serviceType || "N/A",
      code: serviceCode || "N/A",
      name: serviceName || "N/A",
      amount: amount ? `${amount} AED` : "0 AED",
      status: status || "Inactive",
    };

    const existing = JSON.parse(localStorage.getItem("services") || "[]");
    existing.push(newService);
    localStorage.setItem("services", JSON.stringify(existing));
    navigate("/logistics/services");
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0">Service Details</h5>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Service Type</CFormLabel>
                <CFormInput
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="Enter service type"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Service Code</CFormLabel>
                <CFormInput
                  value={serviceCode}
                  onChange={(e) => setServiceCode(e.target.value)}
                  placeholder="Enter service code"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Service Name</CFormLabel>
                <CFormInput
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Enter service name"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Estimated Amount (AED)</CFormLabel>
                <CFormInput
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </CCol>
            </CRow>

            {/* Trip Coordinator Estimate Modal */}
            <div className="mb-4">
              <CButton color="info" onClick={() => setOpenVendorEstimate(true)}>
                Trip Coordinator Specific Estimates
              </CButton>
            </div>

            <CModal
              visible={openVendorEstimate}
              onClose={() => setOpenVendorEstimate(false)}
            >
              <CModalHeader>
                <CModalTitle>Trip Coordinator Specific Estimates</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm className="space-y-3">
                  <CFormLabel>TC Name</CFormLabel>
                  <CFormInput placeholder="Enter TC name" />

                  <CFormLabel>Estimated Cost</CFormLabel>
                  <CFormInput type="number" placeholder="Enter cost" />

                  <CFormLabel>Notes</CFormLabel>
                  <CFormTextarea placeholder="Add any notes..." />
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="primary"
                  onClick={() => setOpenVendorEstimate(false)}
                >
                  Save Estimate
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Save / Cancel */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              <CButton color="primary" onClick={handleSaveService}>
                Save Service
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate("/services")}
              >
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
}
