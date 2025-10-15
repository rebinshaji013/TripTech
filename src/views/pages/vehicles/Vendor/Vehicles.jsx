import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function VendorVehicles() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicleType: "",
    vehicleClass: "",
    vehicleSeating: "",
    owner: "",
    make: "",
    year: "",
    vendor: "",
    status: "Inactive",
  });

  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const vendorList = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVehicleData(savedVehicles);
    setVendors(vendorList);
  }, []);

  const handleAddVehicle = () => navigate("/vendor/addvehicle");

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    const updated = vehicleData.filter((_, i) => i !== index);
    setVehicleData(updated);
    localStorage.setItem("vehicles", JSON.stringify(updated));
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditForm(vehicle);
    setEditModal(true);
  };

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      vehicleType:
        name === "vehicleClass"
          ? `${value} ${prev.vehicleSeating || ""}`.trim()
          : name === "vehicleSeating"
          ? `${prev.vehicleClass || ""} ${value}`.trim()
          : prev.vehicleType,
    }));
  };

  const handleSaveEdit = () => {
    const updated = vehicleData.map((v) =>
      v.vehicleType === selectedVehicle.vehicleType ? { ...v, ...editForm } : v
    );
    setVehicleData(updated);
    localStorage.setItem("vehicles", JSON.stringify(updated));
    setEditModal(false);
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Vehicle Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddVehicle}>
            Add Vehicle
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableHeaderCell>Make</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vehicleData.length ? (
                vehicleData.map((v, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{v.vehicleType}</CTableDataCell>
                    <CTableDataCell>{v.owner}</CTableDataCell>
                    <CTableDataCell>{v.make}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={v.status === "Active" ? "success" : "secondary"}>
                        {v.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleEditClick(v)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="success"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleViewClick(v)}
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        variant="ghost"
                        onClick={() => handleDelete(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    No vehicles found. Click "Add Vehicle" to add one.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* ✅ EDIT VEHICLE MODAL */}
      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Vehicle Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Vehicle Class</CFormLabel>
                <CFormSelect
                  name="vehicleClass"
                  value={editForm.vehicleClass}
                  onChange={handleEditChange}
                >
                  <option value="">Select Class</option>
                  <option value="Normal">Normal</option>
                  <option value="Luxury">Luxury</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Vehicle Seating</CFormLabel>
                <CFormSelect
                  name="vehicleSeating"
                  value={editForm.vehicleSeating}
                  onChange={handleEditChange}
                >
                  <option value="">Select Seating</option>
                  <option value="3 Seater">3 Seater</option>
                  <option value="4 Seater">4 Seater</option>
                  <option value="5 Seater">5 Seater</option>
                  <option value="6 Seater">6 Seater</option>
                  <option value="7 Seater">7 Seater</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Vendor</CFormLabel>
                <CFormSelect
                  name="vendor"
                  value={editForm.vendor}
                  onChange={handleEditChange}
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
              </CCol>
              <CCol md={6}>
                <CFormLabel>Owner</CFormLabel>
                <CFormInput
                  name="owner"
                  value={editForm.owner}
                  onChange={handleEditChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Make</CFormLabel>
                <CFormInput
                  name="make"
                  value={editForm.make}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Year</CFormLabel>
                <CFormInput
                  name="year"
                  value={editForm.year}
                  onChange={handleEditChange}
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 👁 VIEW VEHICLE DETAILS MODAL */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>View Vehicle Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVehicle ? (
            <>
              <p><strong>Vehicle Type:</strong> {selectedVehicle.vehicleType}</p>
              <p><strong>Vehicle Class:</strong> {selectedVehicle.vehicleClass}</p>
              <p><strong>Seating:</strong> {selectedVehicle.vehicleSeating}</p>
              <p><strong>Vendor:</strong> {selectedVehicle.vendor}</p>
              <p><strong>Owner:</strong> {selectedVehicle.owner}</p>
              <p><strong>Make:</strong> {selectedVehicle.make}</p>
              <p><strong>Year:</strong> {selectedVehicle.year}</p>
              <p>
                <strong>Status:</strong>{" "}
                <CBadge color={selectedVehicle.status === "Active" ? "success" : "secondary"}>
                  {selectedVehicle.status}
                </CBadge>
              </p>
            </>
          ) : (
            <p>No vehicle selected.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
