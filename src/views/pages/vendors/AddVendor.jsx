import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge,
} from "@coreui/react";

export default function VendorDetails() {
  const navigate = useNavigate();

  const [vendor, setVendor] = useState({
    company: "",
    name: "",
    address: "",
    email: "",
    mobile: "",
    type: "",
    status: "Inactive",
  });

  const [vendorAdded, setVendorAdded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // Handle input change
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  // Handle vendor save
  const handleVendorSave = () => {
    const existingVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    localStorage.setItem("vendors", JSON.stringify([...existingVendors, vendor]));
    setVendorAdded(true);
    alert("Vendor details added successfully!");
  };

  // Handle document upload
  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file || file.type !== "application/pdf")
      return alert("Please upload a PDF file.");
    setDocuments((prev) => [...prev, { name: file.name, file }]);
    setShowDocModal(false);
  };

  // Download PDF
  const downloadDocument = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save all vendor data
  const handleSaveAll = () => {
    if (!vendorAdded) return alert("Please add vendor details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");

    const existingVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));
    setShowFeedback(true);
  };

  // Handle activation modal response
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setVendor((prev) => ({ ...prev, status: updatedStatus }));

    const allVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const lastVendorIndex = allVendors.length - 1;
    if (lastVendorIndex >= 0) {
      allVendors[lastVendorIndex].status = updatedStatus;
      localStorage.setItem("vendors", JSON.stringify(allVendors));
    }

    setShowFeedback(false);
    navigate("/logistics/vendors");
  };

  return (
    <div className="p-3">
      <CCard className="mb-3 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vendor Details</h5>
        </CCardHeader>
        <CCardBody>

          {/* Accordion Section for Add Vendor */}
          <CAccordion alwaysOpen className="mb-3">
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Add / Update Vendor</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CFormInput
                    label="Company Name"
                    name="company"
                    value={vendor.company}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Vendor Name"
                    name="name"
                    value={vendor.name}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Address"
                    name="address"
                    value={vendor.address}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Email"
                    name="email"
                    value={vendor.email}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Mobile Number"
                    name="mobile"
                    value={vendor.mobile}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormSelect
                    label="Type"
                    name="type"
                    value={vendor.type}
                    onChange={handleVendorChange}
                    className="mb-2"
                  >
                    <option value="">Select Type</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </CFormSelect>
                  <div className="text-end">
                    <CButton color="primary" onClick={handleVendorSave}>
                      Save Vendor
                    </CButton>
                  </div>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>

          {/* Vendor Details Section — shown only if added */}
          {vendorAdded && (
            <CCard className="mb-3">
              <CCardHeader><strong>Vendor Details</strong></CCardHeader>
              <CCardBody>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Company</CTableDataCell>
                      <CTableDataCell>{vendor.company}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Vendor Name</CTableDataCell>
                      <CTableDataCell>{vendor.name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Address</CTableDataCell>
                      <CTableDataCell>{vendor.address}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Email</CTableDataCell>
                      <CTableDataCell>{vendor.email}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Mobile</CTableDataCell>
                      <CTableDataCell>{vendor.mobile}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Type</CTableDataCell>
                      <CTableDataCell>{vendor.type}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Status</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vendor.status === "Active" ? "success" : "secondary"}>
                          {vendor.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {/* Documents Section — shown only when vendor added */}
          {vendorAdded && (
            <CCard className="mb-3">
              <CCardHeader><strong>Documents</strong></CCardHeader>
              <CCardBody>
                {documents.length > 0 ? (
                  <CTable bordered striped>
                    <CTableBody>
                      {documents.map((doc, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{doc.name}</CTableDataCell>
                          <CTableDataCell>
                            {doc.file && (
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => downloadDocument(doc.file)}
                              >
                                Download
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p>No documents uploaded yet.</p>
                )}
                <CButton color="primary" className="mt-2" onClick={() => setShowDocModal(true)}>
                  Add Document
                </CButton>
              </CCardBody>
            </CCard>
          )}

          {vendorAdded && (
            <div className="text-center">
              <CButton color="success" size="lg" onClick={handleSaveAll}>
                Save All
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>Add Document</CModalHeader>
        <CModalBody>
          <form onSubmit={handleDocumentAdd}>
            <input type="file" name="file" accept="application/pdf" className="form-control" />
            <CModalFooter>
            <CButton color="primary" type="submit">
                Add
              </CButton>
              <CButton color="secondary" type="button" onClick={() => setShowDocModal(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>

      {/* Feedback Modal */}
      <CModal visible={showFeedback} onClose={() => setShowFeedback(false)}>
        <CModalHeader>
          <CModalTitle>Vendor Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Vendor created successfully. Do you want to activate the created vendor?
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleActivationDecision(true)}>
            Yes
          </CButton>
          <CButton color="danger" onClick={() => handleActivationDecision(false)}>
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
