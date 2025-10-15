import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge,
} from "@coreui/react";

export default function VehicleDetails() {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleType: "",
    vehicleClass: "",
    vehicleSeating: "",
    owner: "",
    make: "",
    year: "",
    vendor: "",
    status: "Inactive",
  });

  const [vehicleAdded, setVehicleAdded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [vendors, setVendors] = useState([]);

  // 🔹 Load Vendor List from localStorage
  useEffect(() => {
    const vendorList = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(vendorList);
  }, []);

  // 🔹 Handle Vehicle Form Change
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save Vehicle Details
  const handleVehicleSave = () => {
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    localStorage.setItem("vehicles", JSON.stringify([...existingVehicles, vehicle]));
    setVehicleAdded(true);
    alert("Vehicle details added successfully!");
  };

  // 🔹 Add Document
  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file || file.type !== "application/pdf")
      return alert("Please upload a PDF file.");
    setDocuments((prev) => [...prev, { name: file.name, file }]);
    setShowDocModal(false);
  };

  // 🔹 Download PDF
  const downloadDocument = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Save All Data
  const handleSaveAll = () => {
    if (!vehicleAdded) return alert("Please add vehicle details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");

    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    setShowFeedback(true);
  };

  // 🔹 Activation Decision
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setVehicle((prev) => ({ ...prev, status: updatedStatus }));

    const allVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const lastVehicleIndex = allVehicles.length - 1;
    if (lastVehicleIndex >= 0) {
      allVehicles[lastVehicleIndex].status = updatedStatus;
      localStorage.setItem("vehicles", JSON.stringify(allVehicles));
    }

    // Reset after save
    setShowFeedback(false);
    setVehicle({
      vehicleType: "",
      vehicleClass: "",
      vehicleSeating: "",
      owner: "",
      make: "",
      year: "",
      vendor: "",
      status: "Inactive",
    });
    setDocuments([]);
    setVehicleAdded(false);

    navigate("/logistics/vehicles");
  };

  return (
    <div className="p-3">
      <CCard className="mb-3 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vehicle Details</h5>
        </CCardHeader>
        <CCardBody>
          <CAccordion alwaysOpen>
            {/* 🔹 Section 1 — Add / Update Vehicle */}
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Add / Update Vehicle</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CFormSelect
                    label="Vehicle Class"
                    name="vehicleClass"
                    value={vehicle.vehicleClass}
                    onChange={(e) => {
                      const updated = {
                        ...vehicle,
                        vehicleClass: e.target.value,
                        vehicleType: `${e.target.value} ${vehicle.vehicleSeating || ""}`.trim(),
                      };
                      setVehicle(updated);
                    }}
                    className="mb-2"
                  >
                    <option value="">Select Class</option>
                    <option value="Normal">Normal</option>
                    <option value="Luxury">Luxury</option>
                  </CFormSelect>

                  <CFormSelect
                    label="Vehicle Seating"
                    name="vehicleSeating"
                    value={vehicle.vehicleSeating}
                    onChange={(e) => {
                      const updated = {
                        ...vehicle,
                        vehicleSeating: e.target.value,
                        vehicleType: `${vehicle.vehicleClass || ""} ${e.target.value}`.trim(),
                      };
                      setVehicle(updated);
                    }}
                    className="mb-2"
                  >
                    <option value="">Select Seating</option>
                    <option value="3 Seater">3 Seater</option>
                    <option value="4 Seater">4 Seater</option>
                    <option value="5 Seater">5 Seater</option>
                    <option value="6 Seater">6 Seater</option>
                    <option value="7 Seater">7 Seater</option>
                  </CFormSelect>

                  <CFormSelect
                    label="Vendor"
                    name="vendor"
                    value={vehicle.vendor}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.length > 0 ? (
                      vendors.map((v, idx) => (
                        <option key={idx} value={v.name}>
                          {v.company} — {v.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No vendors available</option>
                    )}
                  </CFormSelect>

                  <CFormInput
                    label="Owner Name"
                    name="owner"
                    value={vehicle.owner}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  />

                  <CFormInput
                    label="Vehicle Make"
                    name="make"
                    value={vehicle.make}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  />

                  <CFormInput
                    label="Year"
                    name="year"
                    value={vehicle.year}
                    onChange={handleVehicleChange}
                    className="mb-3"
                  />

                  <div className="text-end">
                    <CButton color="primary" onClick={handleVehicleSave}>
                      Save Vehicle
                    </CButton>
                  </div>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* 🔹 Section 2 — Documents */}
            {vehicleAdded && (
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>Documents</CAccordionHeader>
                <CAccordionBody>
                  {documents.length > 0 ? (
                    <CTable bordered striped>
                      <CTableBody>
                        {documents.map((doc, idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>{doc.name}</CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => downloadDocument(doc.file)}
                              >
                                Download
                              </CButton>
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
                </CAccordionBody>
              </CAccordionItem>
            )}

            {/* 🔹 Section 3 — Vehicle Summary */}
            {vehicleAdded && (
              <CAccordionItem itemKey={3}>
                <CAccordionHeader>Vehicle Details Summary</CAccordionHeader>
                <CAccordionBody>
                  <CTable bordered striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Vehicle Type</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleType || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Vendor</CTableDataCell>
                        <CTableDataCell>{vehicle.vendor || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Owner</CTableDataCell>
                        <CTableDataCell>{vehicle.owner || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Make</CTableDataCell>
                        <CTableDataCell>{vehicle.make || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Year</CTableDataCell>
                        <CTableDataCell>{vehicle.year || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Status</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={vehicle.status === "Active" ? "success" : "secondary"}>
                            {vehicle.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                  <div className="text-center mt-3">
                    <CButton color="success" size="lg" onClick={handleSaveAll}>
                      Save All
                    </CButton>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            )}
          </CAccordion>
        </CCardBody>
      </CCard>

      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Document</CModalTitle>
        </CModalHeader>
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
          <CModalTitle>Vehicle Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Vehicle created successfully. Do you want to activate the created vehicle?
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
