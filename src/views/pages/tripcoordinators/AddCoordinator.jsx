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

export default function TripCoordinatorDetails() {
  const navigate = useNavigate();

  const [coordinator, setCoordinator] = useState({
    coordinatorType: "",
    name: "",
    location: "",
    status: "",
  });

  const [driver, setDriver] = useState({ name: "", contact: "" });
  const [documents, setDocuments] = useState([{ name: "", file: null }]);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const handleCoordinatorChange = (e) =>
    setCoordinator({ ...coordinator, [e.target.name]: e.target.value });

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
    const existingCoordinators = JSON.parse(localStorage.getItem("coordinators") || "[]");
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");

    localStorage.setItem("coordinators", JSON.stringify([...existingCoordinators, coordinator]));
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, driver]));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    navigate("/coordinators");
  };

  return (
    <div className="p-3">
      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Coordinator Details</h5>
        </CCardHeader>
        <CCardBody>
          {/* Vehicle Details */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Coordinator Details</strong>
              </CCardHeader>
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>TC Type</CTableDataCell>
                    <CTableDataCell>{coordinator.coordinatorType || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>TC Name</CTableDataCell>
                    <CTableDataCell>{coordinator.name || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>TC Location</CTableDataCell>
                    <CTableDataCell>{coordinator.location || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={coordinator.status === "Active" ? "success" : "secondary"}>
                        {coordinator.status || "-"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowVehicleModal(true)}>
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

      {/* Coordinator Modal */}
      <CModal visible={showVehicleModal} onClose={() => setShowVehicleModal(false)}>
        <CModalHeader>Update Coordinator</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="TC Type"
              name="coordinatorType"
              value={coordinator.coordinatorType}
              onChange={handleCoordinatorChange}
            >
              <option value="">Select Type</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
              <option value="Other">Other</option>
            </CFormSelect>
            <CFormInput
              label="TC Name"
              name="name"
              value={coordinator.name}
              onChange={handleCoordinatorChange}
              className="mt-2"
            />
            <CFormInput
              label="Location"
              name="location"
              value={coordinator.location}
              onChange={handleCoordinatorChange}
              className="mt-2"
            />
            <CFormSelect
              label="Status"
              name="status"
              value={coordinator.status}
              onChange={handleCoordinatorChange}
              className="mt-2"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowVehicleModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => setShowVehicleModal(false)}>
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
