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
} from "@coreui/react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vehicles") || "[]");
    setVehicleData(saved);
  }, []);

  const handleAddVehicle = () => navigate("/logistics/addvehicle");

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    const updated = vehicleData.filter((_, i) => i !== index);
    setVehicleData(updated);
    localStorage.setItem("vehicles", JSON.stringify(updated));
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
                      <CButton size="sm" color="info" variant="ghost" className="me-1">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton size="sm" color="success" variant="ghost" className="me-1">
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton size="sm" color="danger" variant="ghost" onClick={() => handleDelete(idx)}>
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
    </div>
  );
}
