import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton, CCard, CCardHeader, CCardBody,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CModal, CModalHeader, CModalBody, CModalFooter,
  CForm, CFormInput, CFormSelect, CFormTextarea,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilControl, cilMagnifyingGlass } from "@coreui/icons";

export default function TOBookingsListings() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [operationData, setOperationData] = useState([]);

  // Modals
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [editTrip, setEditTrip] = useState({});
  const [viewTrip, setViewTrip] = useState({});

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tripCosts, setTripCosts] = useState([]);
  const [tripIncharges, setTripIncharges] = useState([]);
  const [ownerData, setOwnerData] = useState([])

  // Load data
  useEffect(() => {
    setTrips(JSON.parse(localStorage.getItem("trips")) || []);
    setOperationData(JSON.parse(localStorage.getItem("owneroperations")) || []);
    setDrivers(JSON.parse(localStorage.getItem("drivers")) || []);
    setVehicles(JSON.parse(localStorage.getItem("vehicles")) || []);
    setTripCosts(JSON.parse(localStorage.getItem("tripCosts")) || []);
    setTripIncharges(JSON.parse(localStorage.getItem("tripIncharges")) || []);
  }, []);

  useEffect(() => {
    try {
      const storedOwners = JSON.parse(localStorage.getItem('owners') || '[]')
      setOwnerData(storedOwners)
    } catch (error) {
      console.error('Error loading owners:', error)
      setOwnerData([])
    }
  }, [])

  // Badge color logic
  const getStatusBadge = (status) => {
    switch (status) {
      case "Requested": return <CBadge color="info">{status}</CBadge>;
      case "Quoted": return <CBadge color="warning">{status}</CBadge>;
      case "Approval": return <CBadge color="success">{status}</CBadge>;
      case "Rejected": return <CBadge color="danger">{status}</CBadge>;
      default: return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  // Navigate to create new
  const handleNewRequest = () => navigate("/owner/newbooking");

  // Delete trip
  const handleDeleteTrip = (index) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  // Assign trip
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

  // Edit trip
  const handleEditClick = (index) => {
    setSelectedTripIndex(index);
    setEditTrip({ ...trips[index] });
    setEditModalVisible(true);
  };

  const handleEditChange = (e) => {
    setEditTrip({ ...editTrip, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    const updatedTrips = [...trips];
    updatedTrips[selectedTripIndex] = editTrip;
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
    setEditModalVisible(false);
  };

  // View trip details
  const handleViewClick = (index) => {
    const trip = trips[index];
    setViewTrip(trip);
    setViewModalVisible(true);
  };

  const getLinkedData = (trip) => ({
    driver: drivers.find((d) => d.tripOwner === trip.tripOwner) || {},
    vehicle: vehicles.find((v) => v.tripOwner === trip.tripOwner) || {},
    cost: tripCosts.find((c) => c.tripOwner === trip.tripOwner) || {},
    incharge: tripIncharges.find((i) => i.tripOwner === trip.tripOwner) || {},
  });

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Booking Listing</h5>
          <CButton color="primary" size="sm" onClick={handleNewRequest}>
            New Booking
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CTable hover responsive bordered small>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Booking Owner</CTableHeaderCell>
                <CTableHeaderCell>Booking Type</CTableHeaderCell>
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
                    <CTableDataCell>{trip.tripOwner || ownerData[0]?.company}</CTableDataCell>
                    <CTableDataCell>{trip.tripType}</CTableDataCell>
                    <CTableDataCell>{trip.startDate}</CTableDataCell>
                    <CTableDataCell>{trip.requestedDate}</CTableDataCell>
                    <CTableDataCell>{trip.assigned}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleEditClick(idx)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>

                      <CButton
                        size="sm"
                        color="secondary"
                        variant="ghost"
                        className="me-1"
                        onClick={() => handleViewClick(idx)}
                      >
                        <CIcon icon={cilMagnifyingGlass} />
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

      {/* ===== Edit Booking Modal ===== */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg">
        <CModalHeader>Edit Booking Details</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput label="Booking Owner" name="tripOwner" value={editTrip.tripOwner || ""} onChange={handleEditChange} />
            <CFormSelect label="Booking Type" name="tripType" value={editTrip.tripType || ""} onChange={handleEditChange}>
              <option value="">Select Type</option>
              <option value="Halfday Trip">Halfday Trip</option>
              <option value="Fullday Trip">Fullday Trip</option>
            </CFormSelect>
            <CFormInput type="date" label="Start Date" name="startDate" value={editTrip.startDate || ""} onChange={handleEditChange} />
            <CFormInput type="date" label="Requested Date" name="requestedDate" value={editTrip.requestedDate || ""} onChange={handleEditChange} />
            <CFormSelect label="Status" name="status" value={editTrip.status || ""} onChange={handleEditChange}>
              <option value="">Select Status</option>
              <option value="Request">Request</option>
              <option value="Quoted">Quoted</option>
              <option value="Approval">Approval</option>
              <option value="Rejected">Rejected</option>
            </CFormSelect>
            <CFormTextarea label="Information" name="information" rows="3" value={editTrip.information || ""} onChange={handleEditChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditSave}>Save Changes</CButton>
        </CModalFooter>
      </CModal>

      {/* ===== View Booking Modal ===== */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>Booking Details</CModalHeader>
        <CModalBody>
          {viewTrip ? (
            <>
              <h6>Booking Owner: {viewTrip.tripOwner}</h6>
              <p><strong>Booking Type:</strong> {viewTrip.tripType}</p>
              <p><strong>Start Date:</strong> {viewTrip.startDate}</p>
              <p><strong>Requested Date:</strong> {viewTrip.requestedDate}</p>
              <p><strong>Status:</strong> {viewTrip.status}</p>
              <p><strong>Assigned To:</strong> {viewTrip.assigned || "-"}</p>
              <p><strong>Information:</strong> {viewTrip.information || "N/A"}</p>
            </>
          ) : (
            <p>No data found.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* ===== Assign Modal ===== */}
      <CModal visible={assignModalVisible} onClose={() => setAssignModalVisible(false)}>
        <CModalHeader>Assign Trip</CModalHeader>
        <CModalBody>
          <CFormSelect value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">-- Select User --</option>
            {trips.map((trip, idx) => (
              <option key={idx} value={trip.tripOwner}>
                {trip.tripOwner} (Trip Owner)
              </option>
            ))}
            {operationData.map((operation, idx) => (
              <option key={idx} value={operation.name}>
                {operation.name}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAssignModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAssignSave} disabled={!assignTo}>Save</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
