import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

export default function LCTripInviteDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", sendTo: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [showModal, setShowModal] = useState(false);
  const [manualDetails, setManualDetails] = useState({ lcName: "", company: "" });

  // For delete confirmation
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);

  const [invites, setInvites] = useState([]);

  // Generate Request ID automatically
  const generateRequestId = () => {
    const prefix = "REQ";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Load invites from storage
  useEffect(() => {
    const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
    const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    setInvites([...toInvites, ...vendorInvites]);
  }, []);

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email address." });
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveInvite = (e) => {
    e.preventDefault();

    const registeredUsers = JSON.parse(localStorage.getItem("registeredLCs") || "[]");
    const existingUser = registeredUsers.find((u) => u.email === formData.email);

    let inviteData;
    if (existingUser) {
      inviteData = {
        id: Date.now(),
        requestId: generateRequestId(),
        lcName: existingUser.lcName,
        company: existingUser.company,
        email: formData.email,
        sendTo: formData.sendTo,
        status: "Request Sent",
      };
      saveInvite(inviteData);
    } else {
      setShowModal(true);
    }
  };

  const saveInvite = (inviteData) => {
    if (inviteData.sendTo === "TO" || inviteData.sendTo === "BOTH") {
      const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
      localStorage.setItem("toInvites", JSON.stringify([...toInvites, inviteData]));
    }
    if (inviteData.sendTo === "VENDOR" || inviteData.sendTo === "BOTH") {
      const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
      localStorage.setItem("vendorInvites", JSON.stringify([...vendorInvites, inviteData]));
    }

    setFormData({ email: "", sendTo: "" });

    // Refresh list
    const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]");
    const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]");
    setInvites([...toInvites, ...vendorInvites]);
  };

  const handleManualSave = () => {
    if (!manualDetails.lcName || !manualDetails.company) return;
    const inviteData = {
      id: Date.now(),
      requestId: generateRequestId(),
      lcName: manualDetails.lcName,
      company: manualDetails.company,
      email: formData.email,
      sendTo: formData.sendTo,
      status: "Request Sent",
    };
    setShowModal(false);
    saveInvite(inviteData);
  };

  const handleDeleteInvite = (invite) => {
    setSelectedInvite(invite);
    setDeleteModal(true);
  };

  const handleAddInvite = () => {
    navigate("/logistics/addinvite");
  };

  const confirmDelete = () => {
    if (!selectedInvite) return;

    // Remove from both storages
    const toInvites = JSON.parse(localStorage.getItem("toInvites") || "[]").filter(
      (i) => i.id !== selectedInvite.id
    );
    const vendorInvites = JSON.parse(localStorage.getItem("vendorInvites") || "[]").filter(
      (i) => i.id !== selectedInvite.id
    );

    localStorage.setItem("toInvites", JSON.stringify(toInvites));
    localStorage.setItem("vendorInvites", JSON.stringify(vendorInvites));

    setInvites([...toInvites, ...vendorInvites]);
    setDeleteModal(false);
    setSelectedInvite(null);
  };

  const isFormValid = formData.email && formData.sendTo && !errors.email;

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
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>LC Name</CTableHeaderCell>
                <CTableHeaderCell>Company</CTableHeaderCell>
                <CTableHeaderCell>Send To</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invites.length > 0 ? (
                invites.map((invite, index) => (
                  <CTableRow key={invite.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{invite.email}</CTableDataCell>
                    <CTableDataCell>{invite.lcName}</CTableDataCell>
                    <CTableDataCell>{invite.company}</CTableDataCell>
                    <CTableDataCell>{invite.sendTo}</CTableDataCell>
                    <CTableDataCell>{invite.status}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteInvite(invite)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center">
                    No invites found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>



      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton>
          <h5 className="mb-0">Confirm Delete</h5>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this invite for{" "}
          <strong>{selectedInvite?.email}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
