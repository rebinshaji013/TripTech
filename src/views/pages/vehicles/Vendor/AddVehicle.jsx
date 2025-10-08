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

export default function VendorVehicleDetails() {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleType: "",
    owner: "",
    make: "",
    year: "",
    capacity: "",
    amenities: "",
    status: "",
  });

  const [driver, setDriver] = useState({ name: "", contact: "" });
  const [documents, setDocuments] = useState([{ name: "", file: null }]);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const handleVehicleChange = (e) =>
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });

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
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");

    localStorage.setItem("vehicles", JSON.stringify([...existingVehicles, vehicle]));
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, driver]));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    navigate("/vendor/vehicles");
  };

  return (
    <div className="p-3">
      <CCard className="mb-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Vehicle Details</h5>
        </CCardHeader>
        <CCardBody>
          {/* Vehicle Details */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Vehicle Details</strong>
              </CCardHeader>
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Vehicle Type</CTableDataCell>
                    <CTableDataCell>{vehicle.vehicleType || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Owner</CTableDataCell>
                    <CTableDataCell>{vehicle.owner || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Vehicle Make</CTableDataCell>
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
                        {vehicle.status || "-"}
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

     {/* Vehicle Modal */}
<CModal visible={showVehicleModal} onClose={() => setShowVehicleModal(false)}>
  <CModalHeader>Update Vehicle</CModalHeader>
  <CModalBody>
    <CForm>
      {/* Vehicle Class */}
      <CFormSelect
        label="Vehicle Class"
        name="vehicleClass"
        value={vehicle.vehicleClass || ""}
        onChange={(e) => {
          const updated = {
            ...vehicle,
            vehicleClass: e.target.value,
            vehicleType: `${e.target.value} ${vehicle.vehicleSeating || ""}`.trim(),
          }
          setVehicle(updated)
        }}
      >
        <option value="">Select Class</option>
        <option value="Normal">Normal</option>
        <option value="Luxury">Luxury</option>
      </CFormSelect>

      {/* Vehicle Seating */}
      <CFormSelect
        label="Vehicle Seating"
        name="vehicleSeating"
        value={vehicle.vehicleSeating || ""}
        className="mt-2"
        onChange={(e) => {
          const updated = {
            ...vehicle,
            vehicleSeating: e.target.value,
            vehicleType: `${vehicle.vehicleClass || ""} ${e.target.value}`.trim(),
          }
          setVehicle(updated)
        }}
      >
        <option value="">Select Seating</option>
        <option value="3 seater">3 Seater</option>
        <option value="4 seater">4 Seater</option>
        <option value="5 seater">5 Seater</option>
        <option value="6 seater">6 Seater</option>
        <option value="7 seater">7 Seater</option>
      </CFormSelect>

      {/* Owner Name */}
      <CFormInput
        label="Owner Name"
        name="owner"
        value={vehicle.owner}
        onChange={handleVehicleChange}
        className="mt-2"
      />

      {/* Vehicle Make */}
      <CFormInput
        label="Vehicle Make"
        name="make"
        value={vehicle.make}
        onChange={handleVehicleChange}
        className="mt-2"
      />

      {/* Year */}
      <CFormInput
        label="Year"
        name="year"
        value={vehicle.year}
        onChange={handleVehicleChange}
        className="mt-2"
      />

      {/* Status */}
      <CFormSelect
        label="Status"
        name="status"
        value={vehicle.status}
        onChange={handleVehicleChange}
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
          <CButton color="primary" onClick={() => setShowDriverModal(false)}>
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
