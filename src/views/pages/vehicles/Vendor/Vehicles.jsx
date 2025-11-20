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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicleClass: "",
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    status: "Inactive",
  });

  // Vehicle options
  const vehicleClassOptions = ["Standard", "Luxury", "Premium", "Economy", "SUV", "Van"];
  
  const brandOptions = [
    "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", 
    "Audi", "Hyundai", "Kia", "Nissan", "Volkswagen",
    "Chevrolet", "Mazda", "Lexus", "Volvo", "Jeep"
  ];

  const modelOptions = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Hilux", "Innova"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "City", "Amaze"],
    "Ford": ["F-150", "Explorer", "Escape", "Mustang", "Focus", "Endeavour"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "A-Class"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Creta", "i20", "Verna"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Sorento", "Rio", "Carens"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail", "Magnite"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Jetta", "Polo", "Virtus"],
    "Chevrolet": ["Malibu", "Equinox", "Tahoe", "Spark", "Trax", "Trailblazer"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "CX-3"],
    "Lexus": ["ES", "RX", "NX", "LS", "UX", "LX"],
    "Volvo": ["XC60", "XC90", "S60", "S90", "XC40", "V90"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Compass", "Renegade", "Cherokee", "Meridian"]
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => (2025 - i).toString());

  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    setVehicleData(savedVehicles);
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
    
    if (name === "brand") {
      setEditForm(prev => ({ 
        ...prev, 
        brand: value,
        model: "" // Reset model when brand changes
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
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
                  {vehicleClassOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
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
                    <option key={idx} value={brand}>{brand}</option>
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
                    <option key={idx} value={model}>{model}</option>
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
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>License Plate</CFormLabel>
                <CFormInput
                  name="licensePlate"
                  value={editForm.licensePlate}
                  onChange={handleEditChange}
                  placeholder="e.g., ABC-1234"
                />
              </CCol>
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
                  <strong>License Plate:</strong> {selectedVehicle.licensePlate || "-"}
                </CCol>
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