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

export default function Vendors() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState([]);

  useEffect(() => {
    const storedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendor(storedVendors);
  }, []);

  const handleAddVendor = () => navigate("/logistics/addvendor");

  const handleDeleteVendor = (index) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    const updatedVendors = vendor.filter((_, i) => i !== index);
    setVendor(updatedVendors);
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));
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
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {vendor.length > 0 ? (
                vendor.map((vendor, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{vendor.vendorType}</CTableDataCell>
                    <CTableDataCell>{vendor.name}</CTableDataCell>
                    <CTableDataCell>{vendor.location}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={vendor.status === "Active" ? "success" : "secondary"}>
                        {vendor.status}
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
    </div>
  );
}
