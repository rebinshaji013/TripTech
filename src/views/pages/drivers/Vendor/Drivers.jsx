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

export default function VendorDrivers() {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState([]);

  useEffect(() => {
    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
  
    // Remove duplicates based on license number (assuming unique)
    const uniqueDrivers = storedDrivers.filter(
      (driver, index, self) =>
        index === self.findIndex((d) => d.license === driver.license)
    );
  
    setDriverData(uniqueDrivers);
    localStorage.setItem("drivers", JSON.stringify(uniqueDrivers));
  }, []);
  

  const handleAddDriver = () => navigate("/vendor/adddriver");

  const handleDeleteDriver = (index) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    const updatedDrivers = driverData.filter((_, i) => i !== index);
    setDriverData(updatedDrivers);
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Driver Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddDriver}>
            Add Driver
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Driver Type</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>License Number</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {driverData.length ? (
                driverData.map((driver, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{driver.type}</CTableDataCell>
                    <CTableDataCell>{driver.name}</CTableDataCell>
                    <CTableDataCell>{driver.location}</CTableDataCell>
                    <CTableDataCell>{driver.license}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={driver.status === "Active" ? "success" : "secondary"}>
                        {driver.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton size="sm" color="info" variant="ghost" className="me-1">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton size="sm" color="success" variant="ghost" className="me-1">
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        variant="ghost"
                        onClick={() => handleDeleteDriver(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    No drivers found. Click "Add Driver" to add one.
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
