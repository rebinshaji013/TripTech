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

export default function TripTypeManagement() {
  const navigate = useNavigate();
  const [triptypeData, setTriptypeData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedTriptype, setSelectedTriptype] = useState(null);
  const [editForm, setEditForm] = useState({
    tripType: "",
    tripName: "",
    triptypeStatus: "Active",
    triptypeRemarks: "",
  });

  useEffect(() => {
    const storedTripTypes = JSON.parse(localStorage.getItem("triptypes") || "[]");
    setTriptypeData(storedTripTypes);
  }, []);

  const handleAddTripType = () => {
    navigate("/logistics/addtriptype"); // optional navigation for future page
  };

  const handleDeleteTripType = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this triptype?"
    );
    if (!confirmDelete) return;

    const updatedTripTypes = triptypeData.filter((_, i) => i !== index);
    setTriptypeData(updatedTripTypes);
    localStorage.setItem("triptypes", JSON.stringify(updatedTripTypes));
  };

  const handleEditClick = (triptype) => {
    setSelectedTriptype(triptype);
    setEditForm({
      tripType: triptype.tripType,
      tripName: triptype.tripName,
      triptypeStatus: triptype.triptypeStatus,
      triptypeRemarks: triptype.triptypeRemarks,
    });
    setEditModal(true);
  };

  const handleViewClick = (triptype) => {
    setSelectedTriptype(triptype);
    setViewModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updatedList = triptypeData.map((s) =>
      s.tripName === selectedTriptype.tripName ? { ...s, ...editForm } : s
    );
    setTriptypeData(updatedList);
    localStorage.setItem("triptypes", JSON.stringify(updatedList));
    setEditModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <CBadge color="success">{status}</CBadge>;
      case "Inactive":
        return <CBadge color="danger">{status}</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Trip Type Management</h5>
          <CButton color="primary" onClick={handleAddTripType}>
            Add Trip Type
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped bordered hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Trip Type</CTableHeaderCell>
                <CTableHeaderCell>Trip Name</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Remarks</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {triptypeData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center text-muted">
                    No triptypes found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                triptypeData.map((triptype, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{triptype.tripType}</CTableDataCell>
                    <CTableDataCell>{triptype.tripName}</CTableDataCell>
                    <CTableDataCell>
                      {getStatusBadge(triptype.triptypeStatus)}
                    </CTableDataCell>
                    <CTableDataCell>{triptype.triptypeRemarks}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                        onClick={() => handleEditClick(triptype)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="secondary"
                        size="sm"
                        variant="ghost"
                        className="me-2"
                        onClick={() => handleViewClick(triptype)}
                      >
                        <CIcon icon={cilMagnifyingGlass} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTripType(idx)}
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
          <CModalTitle>Edit Trip Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Trip Type</CFormLabel>
                <CFormInput
                  name="tripType"
                  value={editForm.tripType}
                  onChange={handleEditChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Trip Type Name</CFormLabel>
                <CFormInput
                  name="tripName"
                  value={editForm.tripName}
                  onChange={handleEditChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <div>{getStatusBadge(editForm.triptypeStatus)}</div>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Remarks</CFormLabel>
                <CFormInput
                  name="triptypeRemarks"
                  value={editForm.triptypeRemarks}
                  onChange={handleEditChange}
                />
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
          <CModalTitle>View Trip Type Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTriptype ? (
            <>
              <p>
                <strong>Trip Type:</strong> {selectedTriptype.tripType}
              </p>
              <p>
                <strong>Trip Name:</strong> {selectedTriptype.tripName}
              </p>
              <p>
                <strong>Status:</strong> {selectedTriptype.triptypeStatus}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedTriptype.triptypeRemarks}
              </p>
            </>
          ) : (
            <p>No triptype selected.</p>
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
