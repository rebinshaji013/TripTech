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
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";

export default function TripCoordinators() {
  const navigate = useNavigate();
  const [coordinatorData, setCoordinatorData] = useState([]);

  useEffect(() => {
    const storedCoordinators = JSON.parse(localStorage.getItem("coordinators") || "[]");
    setCoordinatorData(storedCoordinators);
  }, []);

  const handleAddCoordinator = () => navigate("/addcoordinator");

  const handleDeleteCoordinator = (index) => {
    if (!window.confirm("Are you sure you want to delete this coordinator?")) return;
    const updatedCoordinators = coordinatorData.filter((_, i) => i !== index);
    setCoordinatorData(updatedCoordinators);
    localStorage.setItem("coordinators", JSON.stringify(updatedCoordinators));
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Coordinator Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddCoordinator}>
            Add Coordinator
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>TC Type</CTableHeaderCell>
                <CTableHeaderCell>TC Name</CTableHeaderCell>
                <CTableHeaderCell>TC Location</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {coordinatorData.length > 0 ? (
                coordinatorData.map((coordinator, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{coordinator.coordinatorType}</CTableDataCell>
                    <CTableDataCell>{coordinator.name}</CTableDataCell>
                    <CTableDataCell>{coordinator.location}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={coordinator.status === "Active" ? "success" : "secondary"}>
                        {coordinator.status}
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
                        onClick={() => handleDeleteCoordinator(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center">
                    No coordinators added yet.
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
