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
  CModalBody,
  CModalFooter,
} from "@coreui/react";

export default function LCTripInviteDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    sendTo: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [manualDetails, setManualDetails] = useState({ lcName: "", company: "" });

  // Generate Request ID automatically (Company Prefix + Random Number)
  const generateRequestId = (company) => {
    const prefix = company ? company.substring(0, 3).toUpperCase() : "REQ";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email address.",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveInvite = (e) => {
    e.preventDefault();
  
    const registeredLCs = JSON.parse(localStorage.getItem("registeredLCs") || "[]");
    const registeredVendors = JSON.parse(localStorage.getItem("registeredVendors") || "[]");
  
    let invites = [];
    let needsManual = false;
  
    // --- Trip Owner ---
    if (formData.sendTo === "TO" || formData.sendTo === "BOTH") {
      const lcUser = registeredLCs.find((u) => u.email === formData.email);
      if (lcUser) {
        invites.push({
          id: Date.now(),
          requestId: generateRequestId(lcUser.company),
          lcName: lcUser.lcName,
          company: lcUser.company,
          email: formData.email,
          sendTo: "TO",
          status: "Request Sent",
        });
      } else {
        needsManual = true; // mark for manual entry
      }
    }
  
    // --- Vendor ---
    if (formData.sendTo === "VENDOR" || formData.sendTo === "BOTH") {
      const vendorUser = registeredVendors.find((u) => u.email === formData.email);
      if (vendorUser) {
        invites.push({
          id: Date.now() + 1,
          requestId: generateRequestId(vendorUser.company),
          lcName: vendorUser.vendorName,
          company: vendorUser.company,
          email: formData.email,
          sendTo: "VENDOR",
          status: "Request Sent",
        });
      } else {
        needsManual = true; // mark for manual entry
      }
    }
  
    // Save valid invites first
    if (invites.length > 0) {
      invites.forEach((invite) => saveInvite(invite));
    }
  
    // If any missing → open modal for manual input
    if (needsManual) {
      setShowModal(true);
    }
  };
  
  

  const saveInvite = (inviteData) => {
    if (inviteData.sendTo === "TO") {
      const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
      localStorage.setItem("toInvites", JSON.stringify([...toInvites, inviteData]));
    } else if (inviteData.sendTo === "VENDOR") {
      const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
      localStorage.setItem("vendorInvites", JSON.stringify([...vendorInvites, inviteData]));
    }
  
    // Reset form and redirect
    setFormData({ email: "", sendTo: "" });
    navigate("/logistics/invites");
  };

  const handleManualSave = () => {
    const { email, sendTo } = formData;
  
    // --- Trip Owner ---
    if (sendTo === "TO" || sendTo === "BOTH") {
      const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
      const newInvite = {
        id: Date.now(),
        requestId: generateRequestId(manualDetails.company || "TOCompany"), // unique requestId
        lcName: manualDetails.lcName || "Manual TO",
        company: manualDetails.company || "TOCompany",
        email,
        sendTo: "TO",
        status: "Request Sent",
      };
      localStorage.setItem("toInvites", JSON.stringify([...toInvites, newInvite]));
    }
  
    // --- Vendor ---
    if (sendTo === "VENDOR" || sendTo === "BOTH") {
      const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
      const newInvite = {
        id: Date.now() + 1,
        requestId: generateRequestId(manualDetails.company || "VendorCompany"), // unique requestId
        lcName: manualDetails.lcName || "Manual Vendor",
        company: manualDetails.company || "VendorCompany",
        email,
        sendTo: "VENDOR",
        status: "Request Sent",
      };
      localStorage.setItem("vendorInvites", JSON.stringify([...vendorInvites, newInvite]));
    }
  
    setShowModal(false);
    setFormData({ email: "", sendTo: "" });
    setManualDetails({ lcName: "", company: "" }); // reset manual fields
    navigate("/logistics/invites");
  };
  
   

  const isFormValid = formData.email && formData.sendTo && !errors.email;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0 fw-bold text-center">Trip Invite</h5>
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
                  placeholder="Enter email"
                  required
                  invalid={!!errors.email}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="sendTo">Send To</CFormLabel>
                <CFormSelect
                  id="sendTo"
                  name="sendTo"
                  value={formData.sendTo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Recipient</option>
                  <option value="TO">Trip Owner</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="BOTH">Both</option>
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

      {/* Modal for unregistered user */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <h5 className="mb-0">Unregistered User</h5>
        </CModalHeader>
        <CModalBody>
          <p>
            This email is not registered. Please enter LC Name and Company Name
            manually.
          </p>
          <CFormLabel htmlFor="lcName">LC Name</CFormLabel>
          <CFormInput
            id="lcName"
            value={manualDetails.lcName}
            onChange={(e) =>
              setManualDetails({ ...manualDetails, lcName: e.target.value })
            }
            placeholder="Enter LC name"
            required
          />
          <CFormLabel className="mt-2" htmlFor="company">
            Company Name
          </CFormLabel>
          <CFormInput
            id="company"
            value={manualDetails.company}
            onChange={(e) =>
              setManualDetails({ ...manualDetails, company: e.target.value })
            }
            placeholder="Enter company name"
            required
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleManualSave}>
            Save & Send
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
