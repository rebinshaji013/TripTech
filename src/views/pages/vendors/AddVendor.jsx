import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

export default function VendorDetails() {
  const navigate = useNavigate();

  const [vendor, setVendor] = useState({
    vendorType: "",
    name: "",
    location: "",
    status: "",
  });

  const [driver, setDriver] = useState({ name: "", contact: "" });
  const [documents, setDocuments] = useState([{ name: "", file: null }]);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const handleVendorChange = (e) =>
    setVendor({ ...vendor, [e.target.name]: e.target.value });

  const handleDriverChange = (e) =>
    setDriver({ ...driver, [e.target.name]: e.target.value });

  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file || file.type !== "application/pdf") return alert("Please upload a PDF.");
    setDocuments([...documents, { name: file.name, file }]);
    setShowDocModal(false);
  };

  const downloadDocument = (file) => {
    if (!file) return alert("No file available.");
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const existingVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");

    localStorage.setItem("vendors", JSON.stringify([...existingVendors, vendor]));
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, driver]));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    navigate("/logistics/vendors");
  };

  return (
    <div className="p-3">
      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Vendor Details</h5>
        </CCardHeader>
        <CCardBody>
          {/* Vehicle Details */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Vendor Details</strong>
              </CCardHeader>
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Vendor Type</CTableDataCell>
                    <CTableDataCell>{vendor.vendorType || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Vendor Name</CTableDataCell>
                    <CTableDataCell>{vendor.name || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Vendor Location</CTableDataCell>
                    <CTableDataCell>{vendor.location || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={vendor.status === "Active" ? "success" : "secondary"}>
                        {vendor.status || "-"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowVendorModal(true)}>
                Add / Update
              </CButton>
            </CCardBody>
          </CCard>

          {/* Driver Details */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Driver Details</strong>
            </CCardHeader>
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Name</CTableDataCell>
                    <CTableDataCell>{driver.name || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Contact</CTableDataCell>
                    <CTableDataCell>{driver.contact || "-"}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowDriverModal(true)}>
                Edit Driver
              </CButton>
            </CCardBody>
          </CCard>

          {/* Documents */}
          <CCard className="mb-3">
          <CCardHeader>    
          <strong>Documents</strong>
          </CCardHeader> 
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  {documents.map((doc, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{doc.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm" color="info" onClick={() => downloadDocument(doc.file)}>
                          Download
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowDocModal(true)}>
                Add Document
              </CButton>
            </CCardBody>
          </CCard>

          <div className="text-center">
            <CButton color="success" size="lg" onClick={handleSave}>
              Save All
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Vendor Modal */}
      <CModal visible={showVendorModal} onClose={() => setShowVendorModal(false)}>
        <CModalHeader>Update Vendor</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Vendor Type"
              name="vendorType"
              value={vendor.vendorType}
              onChange={handleVendorChange}
            >
              <option value="">Select Type</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
              <option value="Other">Other</option>
            </CFormSelect>
            <CFormInput
              label="Vendor Name"
              name="name"
              value={vendor.name}
              onChange={handleVendorChange}
              className="mt-2"
            />
            <CFormInput
              label="Location"
              name="location"
              value={vendor.location}
              onChange={handleVendorChange}
              className="mt-2"
            />
            <CFormSelect
              label="Status"
              name="status"
              value={vendor.status}
              onChange={handleVendorChange}
              className="mt-2"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowVendorModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => setShowVendorModal(false)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Driver Modal */}
      <CModal visible={showDriverModal} onClose={() => setShowDriverModal(false)}>
        <CModalHeader>Edit Driver</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Name"
              name="name"
              value={driver.name}
              onChange={handleDriverChange}
            />
            <CFormInput
              label="Contact"
              name="contact"
              value={driver.contact}
              onChange={handleDriverChange}
              className="mt-2"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDriverModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => setDriverModal(false)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>Add Document</CModalHeader>
        <CModalBody>
          <form onSubmit={handleDocumentAdd}>
            <input type="file" name="file" accept="application/pdf" className="w-full" />
            <CModalFooter>
              <CButton color="secondary" type="button" onClick={() => setShowDocModal(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Add
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>
    </div>
  );
}
