import React, { useEffect, useState } from "react";
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
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(storedVendors);
  }, []);

  const handleAddVendor = () => navigate("/logistics/addvendor");

  const handleDeleteVendor = (index) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    const updatedVendors = vendors.filter((_, i) => i !== index);
    setVendors(updatedVendors);
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));
  };

  const handleEditVendor = (vendor, index) => {
    setCurrentVendor({ ...vendor });
    setEditIndex(index);
    setEditModalVisible(true);
  };

  const handleViewVendor = (vendor) => {
    setCurrentVendor(vendor);
    setViewModalVisible(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (!currentVendor.name || !currentVendor.company) {
      alert("Please fill all required fields.");
      return;
    }

    const updated = [...vendors];
    updated[editIndex] = currentVendor;
    setVendors(updated);
    localStorage.setItem("vendors", JSON.stringify(updated));
    setEditModalVisible(false);
    setCurrentVendor(null);
    setEditIndex(null);
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Vendor Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddVendor}>
            Add Vendor
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Vendor Type</CTableHeaderCell>
                <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                <CTableHeaderCell>Vendor Location</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vendors.length > 0 ? (
                vendors.map((vendor, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{vendor.type}</CTableDataCell>
                    <CTableDataCell>{vendor.name}</CTableDataCell>
                    <CTableDataCell>{vendor.address}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={vendor.status === "Active" ? "success" : "secondary"}
                      >
                        {vendor.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleEditVendor(vendor, idx)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="success"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleViewVendor(vendor)}
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        variant="ghost"
                        onClick={() => handleDeleteVendor(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center">
                    No vendors added yet.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* ====== EDIT VENDOR MODAL ====== */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Edit Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {currentVendor && (
            <CForm>
              <CFormInput
                label="Company Name"
                name="company"
                value={currentVendor.company || ""}
                onChange={handleEditChange}
                className="mb-2"
              />
              <CFormInput
                label="Vendor Name"
                name="name"
                value={currentVendor.name || ""}
                onChange={handleEditChange}
                className="mb-2"
              />
              <CFormInput
                label="Address"
                name="address"
                value={currentVendor.address || ""}
                onChange={handleEditChange}
                className="mb-2"
              />
              <CFormInput
                label="Email"
                name="email"
                value={currentVendor.email || ""}
                onChange={handleEditChange}
                className="mb-2"
              />
              <CFormInput
                label="Mobile"
                name="mobile"
                value={currentVendor.mobile || ""}
                onChange={handleEditChange}
                className="mb-2"
              />
              <CFormSelect
                label="Type"
                name="type"
                value={currentVendor.type || ""}
                onChange={handleEditChange}
                className="mb-2"
              >
                <option value="">Select Type</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </CFormSelect>
              <CFormSelect
                label="Status"
                name="status"
                value={currentVendor.status || ""}
                onChange={handleEditChange}
                className="mb-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ====== VIEW VENDOR DETAILS MODAL ====== */}
      <CModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {currentVendor && (
            <CTable bordered>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Company</CTableDataCell>
                  <CTableDataCell>{currentVendor.company}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Vendor Name</CTableDataCell>
                  <CTableDataCell>{currentVendor.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Address</CTableDataCell>
                  <CTableDataCell>{currentVendor.address}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Email</CTableDataCell>
                  <CTableDataCell>{currentVendor.email}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Mobile</CTableDataCell>
                  <CTableDataCell>{currentVendor.mobile}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Type</CTableDataCell>
                  <CTableDataCell>{currentVendor.type}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Status</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        currentVendor.status === "Active"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {currentVendor.status}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
