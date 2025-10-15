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

export default function VTripInvites() {
  const navigate = useNavigate();
  const [vendorInvites, setVendorInvites] = useState([]);
  const [registeredVendors, setRegisteredVendors] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [visible, setVisible] = useState(false);

  // Delete confirmation modal
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // ✅ Fetch invites sent from LC
    const storedInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    // Only vendor-related invites
    const vendorOnly = storedInvites.filter(
      (inv) => inv.sendTo === "VENDOR" || inv.sendTo === "BOTH"
    );
    setVendorInvites(vendorOnly);

    // ✅ Fetch registered vendors
    const storedUsers = JSON.parse(localStorage.getItem("registeredVendors") || "[]");
    setRegisteredVendors(storedUsers);
  }, []);

  const isRegisteredVendor = (email) => {
    return registeredVendors.some((v) => v.email === email);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedInvites = vendorInvites.map((invite, idx) =>
      idx === index ? { ...invite, status: newStatus } : invite
    );
    setVendorInvites(updatedInvites);

    // update in localStorage (toInvites)
    const allInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    const updatedAll = allInvites.map((inv) =>
      inv.requestId === vendorInvites[index].requestId ? { ...inv, status: newStatus } : inv
    );
    localStorage.setItem("vendorInvites", JSON.stringify(updatedAll));
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const updatedInvites = vendorInvites.filter((_, idx) => idx !== deleteIndex);
    setVendorInvites(updatedInvites);

    // remove from localStorage (toInvites)
    const allInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    const updatedAll = allInvites.filter(
      (inv) => inv.requestId !== vendorInvites[deleteIndex].requestId
    );
    localStorage.setItem("vendorInvites", JSON.stringify(updatedAll));

    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleAddInvite = () => {
    navigate("/vendor/addinvite");
  };

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

  const handleViewDetails = (invite) => {
    setSelectedInvite(invite);
    setVisible(true);
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Vendor Invites</h5>
          <CButton color="primary" onClick={handleAddInvite}>
            Add Invite
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped bordered hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Request ID</CTableHeaderCell>
                <CTableHeaderCell>LC Name</CTableHeaderCell>
                <CTableHeaderCell>Email ID</CTableHeaderCell>
                <CTableHeaderCell>Company Name</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vendorInvites.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    No invites found.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                vendorInvites.map((invite, idx) => (
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

                      {isRegisteredVendor(invite.email) ? (
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
