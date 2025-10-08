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
import { cilPencil, cilSearch, cilTrash } from "@coreui/icons";

export default function Services() {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("services") || "[]");
    setServiceData(stored);
  }, []);

  const handleAddService = () => {
    navigate("/logistics/addservice");
  };

  const handleDeleteService = (index) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const updatedServices = serviceData.filter((_, i) => i !== index);
    setServiceData(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };

  // Badge color mapping
  const getStatusBadge = (status) => {
    const colorMap = {
      Active: "success",
      Inactive: "secondary",
    };
    return <CBadge color={colorMap[status] || "secondary"}>{status}</CBadge>;
  };

  return (
    <div className="p-3">
      {/* Service Listing */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Service Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddService}>
            Add Service
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover bordered responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Code</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {serviceData.length > 0 ? (
                serviceData.map((service, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{service.type}</CTableDataCell>
                    <CTableDataCell>{service.code}</CTableDataCell>
                    <CTableDataCell>{service.name}</CTableDataCell>
                    <CTableDataCell>{service.amount}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(service.status)}</CTableDataCell>
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
                        onClick={() => handleDeleteService(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    No services found. Click "Add Service" to add one.
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
