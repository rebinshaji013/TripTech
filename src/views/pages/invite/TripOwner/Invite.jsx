import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

export default function TOTripInvites() {
  const navigate = useNavigate();
  const [toInvites, setToInvites] = useState([]);
  const [registeredTOs, setRegisteredTOs] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [visible, setVisible] = useState(false);

  // Delete confirmation modal
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const storedInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
    setToInvites(storedInvites);

    const storedUsers = JSON.parse(localStorage.getItem("registeredTOs") || "[]");
    setRegisteredTOs(storedUsers);
  }, []);

  const handleAddInvite = () => {
    navigate("/owner/addinvite");
  };

  // check if TO is registered
  const isRegisteredTO = (email) => {
    return registeredTOs.some((to) => to.email === email);
  };

  // handle accept/reject
  const handleStatusChange = (index, newStatus) => {
    const updatedInvites = toInvites.map((invite, idx) =>
      idx === index ? { ...invite, status: newStatus } : invite
    );
    setToInvites(updatedInvites);
    localStorage.setItem("toInvites", JSON.stringify(updatedInvites));
  };

  // confirm delete
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // perform delete
  const handleDelete = () => {
    const updatedInvites = toInvites.filter((_, idx) => idx !== deleteIndex);
    setToInvites(updatedInvites);
    localStorage.setItem("toInvites", JSON.stringify(updatedInvites));
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  // badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Request Sent":
        return <CBadge color="warning">{status}</CBadge>;
      case "Approved":
        return <CBadge color="success">{status}</CBadge>;
      case "Rejected":
        return <CBadge color="danger">{status}</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  // open modal with invite details
  const handleViewDetails = (invite) => {
    setSelectedInvite(invite);
    setVisible(true);
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Trip Owner Invites</h5>
          <CButton color="primary" onClick={handleAddInvite}>
            Add Invite
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped bordered hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Request ID</CTableHeaderCell>
                <CTableHeaderCell>TO Name</CTableHeaderCell>
                <CTableHeaderCell>Email ID</CTableHeaderCell>
                <CTableHeaderCell>Company</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {toInvites.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    No invites found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                toInvites.map((invite, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{invite.requestId}</CTableDataCell>
                    <CTableDataCell>{invite.lcName}</CTableDataCell>
                    <CTableDataCell>{invite.email}</CTableDataCell>
                    <CTableDataCell>{invite.company}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(invite.status)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="outline"
                        className="me-2"
                        onClick={() => handleViewDetails(invite)}
                      >
                        View
                      </CButton>

                      {isRegisteredTO(invite.email) ? (
                        <>
                          <CButton
                            size="sm"
                            color="success"
                            variant="outline"
                            className="me-2"
                            onClick={() => handleStatusChange(idx, "Approved")}
                            disabled={invite.status === "Approved"}
                          >
                            Accept
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            className="me-2"
                            onClick={() => handleStatusChange(idx, "Rejected")}
                            disabled={invite.status === "Rejected"}
                          >
                            Reject
                          </CButton>
                        </>
                      ) : (
                        <CBadge color="secondary" className="me-2">
                          Unregistered
                        </CBadge>
                      )}

                      {/* 🗑️ Delete button with confirm */}
                      <CButton
                        size="sm"
                        color="danger"
                        variant="ghost"
                        onClick={() => confirmDelete(idx)}
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

      {/* Invite Details Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Invite Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedInvite ? (
            <div>
              <p>
                <strong>Request ID:</strong> {selectedInvite.requestId}
              </p>
              <p>
                <strong>LC Name:</strong> {selectedInvite.lcName}
              </p>
              <p>
                <strong>Email:</strong> {selectedInvite.email}
              </p>
              <p>
                <strong>Company:</strong> {selectedInvite.company}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(selectedInvite.status)}
              </p>
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this invite? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
