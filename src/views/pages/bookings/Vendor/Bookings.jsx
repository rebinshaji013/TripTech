import React, { useState, useEffect } from "react";
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
  CBadge,
} from "@coreui/react";

export default function VendorBookingManagement() {
  const [trips, setTrips] = useState([]);
  const [ownerData, setOwnerData] = useState([])
 
  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(storedTrips);
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



  const getStatusBadge = (status) => {
    switch (status) {
      case "Requested":
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


  return (
    <div className="p-3">
       <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Booking Listing</h5>
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
    </div>
  );
}
