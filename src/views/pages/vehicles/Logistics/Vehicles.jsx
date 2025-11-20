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

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicleClass: "",
    brand: "",
    model: "",
    year: "",
    vehicleSeating: "",
    licensePlate: "",
    registrationExpiry: "",
    assignedDriver: "",
    status: "Inactive",
  });

  // Brand options
  const brandOptions = [
    "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", 
    "Audi", "Hyundai", "Kia", "Nissan", "Volkswagen",
    "Chevrolet", "Mazda", "Lexus", "Volvo", "Jeep"
  ];

  // Model options based on brand
  const modelOptions = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Hilux"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "City"],
    "Ford": ["F-150", "Explorer", "Escape", "Mustang", "Focus"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Creta", "i20"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Sorento", "Rio"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Jetta", "Polo"],
    "Chevrolet": ["Malibu", "Equinox", "Tahoe", "Spark", "Trax"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30"],
    "Lexus": ["ES", "RX", "NX", "LS", "UX"],
    "Volvo": ["XC60", "XC90", "S60", "S90", "XC40"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Compass", "Renegade", "Cherokee"]
  };

  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const driverList = JSON.parse(localStorage.getItem("drivers") || "[]");
    setVehicleData(savedVehicles);
    setDrivers(driverList);
  }, []);

  const handleAddVehicle = () => navigate("/logistics/addvehicle");

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
    
    // Reset model when brand changes
    if (name === "brand") {
      setEditForm((prev) => ({ 
        ...prev, 
        brand: value,
        model: "" 
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = () => {
    const updated = vehicleData.map((v) =>
      v === selectedVehicle ? { ...editForm } : v
    );
    setVehicleData(updated);
    localStorage.setItem("vehicles", JSON.stringify(updated));
    setEditModal(false);
  };

  // Check registration expiry for notification
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { color: "danger", message: "EXPIRED" };
    } else if (diffDays <= 30) {
      return { color: "warning", message: "EXPIRING SOON" };
    } else {
      return { color: "success", message: "VALID" };
    }
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
                <CTableHeaderCell>Vehicle Class</CTableHeaderCell>
                <CTableHeaderCell>Brand Name</CTableHeaderCell>
                <CTableHeaderCell>Model Name</CTableHeaderCell>
                <CTableHeaderCell>Year</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vehicleData.length ? (
                vehicleData.map((v, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{v.vehicleClass || "-"}</CTableDataCell>
                    <CTableDataCell>{v.brand || "-"}</CTableDataCell>
                    <CTableDataCell>{v.model || "-"}</CTableDataCell>
                    <CTableDataCell>{v.year || "-"}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={v.status === "Active" ? "success" : "secondary"}>
                        {v.status || "Inactive"}
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
                  <option value="">Select Vehicle Class</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Premium">Premium</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Brand Name</CFormLabel>
                <CFormSelect
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditChange}
                >
                  <option value="">Select Brand</option>
                  {brandOptions.map((brand, idx) => (
                    <option key={idx} value={brand}>
                      {brand}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Model Name</CFormLabel>
                <CFormSelect
                  name="model"
                  value={editForm.model}
                  onChange={handleEditChange}
                  disabled={!editForm.brand}
                >
                  <option value="">Select Model</option>
                  {editForm.brand && modelOptions[editForm.brand]?.map((model, idx) => (
                    <option key={idx} value={model}>
                      {model}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Year</CFormLabel>
                <CFormSelect
                  name="year"
                  value={editForm.year}
                  onChange={handleEditChange}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 11 }, (_, i) => (2025 - i)).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
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
                  <option value="8 Seater">8 Seater</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>License Plate Number</CFormLabel>
                <CFormInput
                  name="licensePlate"
                  value={editForm.licensePlate}
                  onChange={handleEditChange}
                  placeholder="e.g., ABC-1234"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Registration Expiry Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="registrationExpiry"
                  value={editForm.registrationExpiry}
                  onChange={handleEditChange}
                />
                {editForm.registrationExpiry && (
                  <CBadge color={getExpiryStatus(editForm.registrationExpiry)?.color} className="mt-1">
                    {getExpiryStatus(editForm.registrationExpiry)?.message}
                  </CBadge>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Assign Driver</CFormLabel>
                <CFormSelect
                  name="assignedDriver"
                  value={editForm.assignedDriver}
                  onChange={handleEditChange}
                >
                  <option value="">Select Driver</option>
                  {drivers.length > 0 ? (
                    drivers.map((driver, idx) => (
                      <option key={idx} value={driver.name}>
                        {driver.name} - {driver.licenseNumber || "No License"}
                      </option>
                    ))
                  ) : (
                    <option disabled>No drivers available</option>
                  )}
                </CFormSelect>
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
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Vehicle Class:</strong> {selectedVehicle.vehicleClass || "-"}
                </CCol>
                <CCol md={6}>
                  <strong>Brand Name:</strong> {selectedVehicle.brand || "-"}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Model Name:</strong> {selectedVehicle.model || "-"}
                </CCol>
                <CCol md={6}>
                  <strong>Year:</strong> {selectedVehicle.year || "-"}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Vehicle Seating:</strong> {selectedVehicle.vehicleSeating || "-"}
                </CCol>
                <CCol md={6}>
                  <strong>License Plate:</strong> {selectedVehicle.licensePlate || "-"}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Registration Expiry:</strong> {selectedVehicle.registrationExpiry || "-"}
                  {selectedVehicle.registrationExpiry && (
                    <CBadge color={getExpiryStatus(selectedVehicle.registrationExpiry)?.color} className="ms-2">
                      {getExpiryStatus(selectedVehicle.registrationExpiry)?.message}
                    </CBadge>
                  )}
                </CCol>
                <CCol md={6}>
                  <strong>Assigned Driver:</strong> {selectedVehicle.assignedDriver || "-"}
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <strong>Status:</strong>{" "}
                  <CBadge color={selectedVehicle.status === "Active" ? "success" : "secondary"}>
                    {selectedVehicle.status || "Inactive"}
                  </CBadge>
                </CCol>
              </CRow>
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