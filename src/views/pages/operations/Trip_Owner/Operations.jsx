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
  CModal,
  CBadge,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons";

export default function Operations() {
  const navigate = useNavigate();
  const [operationData, setOperationData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: ""
  });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("owneroperations") || "[]");
    setOperationData(storedUsers);
  }, []);

  const handleAddUser = () => {
    navigate("/owner/adduser");
  };

  const handleDeleteUser = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    const updatedUsers = operationData.filter((_, i) => i !== index);
    setOperationData(updatedUsers);
    localStorage.setItem("owneroperations", JSON.stringify(updatedUsers));
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
    });
    setEditModal(true);
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updatedList = operationData.map((user) =>
      user.id === selectedUser.id ? { ...user, ...editForm } : user
    );
    setOperationData(updatedList);
    localStorage.setItem("owneroperations", JSON.stringify(updatedList));
    setEditModal(false);
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
                <CTableHeaderCell>Email ID</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {operationData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center text-muted">
                    No users found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                operationData.map((operation, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{operation.name}</CTableDataCell>
                    <CTableDataCell>{operation.email}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={operation.status === "Active" ? "success" : "secondary"}
                      >
                        {operation.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                        onClick={() => handleEditClick(operation)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="secondary"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                        onClick={() => handleViewClick(operation)}
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

      {/* ---------- EDIT MODAL ---------- */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>User Name</CFormLabel>
                <CFormInput
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>User Email ID</CFormLabel>
                <CFormInput
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
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

      {/* ---------- VIEW MODAL ---------- */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader>
          <CModalTitle>View User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser ? (
            <>
              <p>
                <strong>User Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email ID:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
            </>
          ) : (
            <p>No user selected.</p>
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
