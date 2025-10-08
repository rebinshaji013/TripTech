import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from "@coreui/react";
import { cilPencil, cilTrash, cilControl } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function TripsListings() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [operationData, setOperationData] = useState([]);

  // Assign Modal state
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [assignTo, setAssignTo] = useState("");

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(storedTrips);
  }, []);

  useEffect(() => {
    const storedOps = JSON.parse(localStorage.getItem("operations")) || [];
    setOperationData(storedOps);
  }, []);


  const getStatusBadge = (status) => {
    switch (status) {
      case "Request":
        return <CBadge color="info">{status}</CBadge>;
      case "Quoted":
        return <CBadge color="warning">{status}</CBadge>;
      case "Approval":
        return <CBadge color="success">{status}</CBadge>;
      case "Rejected":
        return <CBadge color="danger">{status}</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const handleNewRequest = () => navigate("/logistics/newrequest");

  const handleDeleteTrip = (index) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const handleAssignClick = (index) => {
    setSelectedTripIndex(index);
    setAssignTo(trips[index].assigned || "");
    setAssignModalVisible(true);
  };

  const handleAssignSave = () => {
    if (selectedTripIndex === null) return;
    const updatedTrips = [...trips];
    updatedTrips[selectedTripIndex].assigned = assignTo;
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
    setAssignModalVisible(false);
  };

  return (
    <div className="p-3">
       <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Listing</h5>
          <CButton color="primary" size="sm" onClick={handleNewRequest}>
            New Request
          </CButton>
        </CCardHeader>
          <CCardBody>
            <CTable hover responsive bordered small>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Trip Owner</CTableHeaderCell>
                  <CTableHeaderCell>Trip Type</CTableHeaderCell>
                  <CTableHeaderCell>Start Point</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>Requested Date</CTableHeaderCell>
                  <CTableHeaderCell>Assigned To</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {trips.length > 0 ? (
                  trips.map((trip, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{trip.tripOwner}</CTableDataCell>
                      <CTableDataCell>{trip.tripType}</CTableDataCell>
                      <CTableDataCell>{trip.startPoint}</CTableDataCell>
                      <CTableDataCell>{trip.startDate}</CTableDataCell>
                      <CTableDataCell>{trip.requestedDate}</CTableDataCell>
                      <CTableDataCell>{trip.assigned}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton size="sm" color="info" variant="ghost" className="me-1">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="success"
                          variant="ghost"
                          className="me-1"
                          onClick={() => handleAssignClick(idx)}
                        >
                          <CIcon icon={cilControl} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          variant="ghost"
                          onClick={() => handleDeleteTrip(idx)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">
                      No trips found. Click "New Request" to add one.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

      {/* Assign Modal */}
      <CModal visible={assignModalVisible} onClose={() => setAssignModalVisible(false)}>
        <CModalHeader>Assign Trip</CModalHeader>
        <CModalBody>
          <CFormLabel>Select User (LC):</CFormLabel>
          <CFormSelect value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">-- Select User --</option>
            {operationData.map((operation, idx) => (
              <option key={idx} value={operation.name}>
                {operation.name}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAssignModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAssignSave} disabled={!assignTo}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
