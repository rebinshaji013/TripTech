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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons";

export default function VendorOperations() {
  const navigate = useNavigate();
  const [operationData, setOperationData] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("voperations") || "[]");
    setOperationData(storedUsers);
  }, []);

  const handleAddUser = () => {
    navigate("/vendor/adduser"); // navigate to user details screen
  };

  const handleDeleteUser = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    const updatedUsers = operationData.filter((_, i) => i !== index);
    setOperationData(updatedUsers);
    localStorage.setItem("voperations", JSON.stringify(updatedUsers));
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">User Listing</h5>
          <CButton color="primary" onClick={handleAddUser}>
            Add User
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped bordered hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>User Name</CTableHeaderCell>
                <CTableHeaderCell>User Email ID</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {operationData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center text-muted">
                    No operational users found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                operationData.map((operation, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{operation.name}</CTableDataCell>
                    <CTableDataCell>{operation.email}</CTableDataCell>
                    <CTableDataCell>{operation.status}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="secondary"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                      >
                        <CIcon icon={cilMagnifyingGlass} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
}
