import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
} from "@coreui/react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function TripsBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("trips");
  const [trips, setTrips] = useState([]);
  const [tripType, setTripType] = useState("oneway"); // default to "oneway"
const [oneWay, setOneWay] = useState({
  date: "",
  time: "",
  passengers: "",
  pickup: "",
  dropoff: "",
});
const [returnTrip, setReturnTrip] = useState({
  onwardDate: "",
  time: "",
  passengers: "",
  pickup: "",
  dropoff: "",
});


  // load trips
  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(storedTrips);
  }, []);

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location.state]);

  const handleNewRequest = () => navigate("/newrequest");

  const handleDeleteTrip = (index) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  return (
    <div className="p-3">
      {/* Tabs */}
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === "trips"}
            onClick={() => setActiveTab("trips")}
          >
            Trips
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </CNavLink>
        </CNavItem>
        <div className="ms-auto">
          <CButton color="primary" size="sm" onClick={handleNewRequest}>
            New Request
          </CButton>
        </div>
      </CNav>

      {/* Trips Tab */}
      {activeTab === "trips" && (
        <CCard>
          <h5 className="mb-0">Trip Listing</h5>
          <CCardBody>
            <CTable hover responsive bordered small>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Start</CTableHeaderCell>
                  <CTableHeaderCell>End</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {trips.length > 0 ? (
                  trips.map((trip, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{trip.type}</CTableDataCell>
                      <CTableDataCell>{trip.date}</CTableDataCell>
                      <CTableDataCell>{trip.startPlace}</CTableDataCell>
                      <CTableDataCell>{trip.endPlace}</CTableDataCell>
                      <CTableDataCell>{trip.startDate}</CTableDataCell>
                      <CTableDataCell>{trip.endDate}</CTableDataCell>
                      <CTableDataCell>{trip.status}</CTableDataCell>
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
      )}

      {/* Bookings Tab */}
{activeTab === "bookings" && (
  <CCard>
    <CCardHeader>Trip Booking Module</CCardHeader>
    <CCardBody>
      <CRow className="mb-3">
        <CCol md={6}>
          <CFormLabel htmlFor="tripType">Select Trip Type:</CFormLabel>
          <select
            id="tripType"
            className="form-select"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="oneway">One way transfer</option>
            <option value="return">Return transfer</option>
          </select>
        </CCol>
      </CRow>

      {/* One Way Transfer Form */}
      {tripType === "oneway" && (
        <CCard className="mb-3">
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Date:</CFormLabel>
                <CFormInput type="date" value={oneWay.date} onChange={(e) => setOneWay({ ...oneWay, date: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Pick-up Time:</CFormLabel>
                <CFormInput type="time" value={oneWay.time} onChange={(e) => setOneWay({ ...oneWay, time: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>No. of Passengers:</CFormLabel>
                <CFormInput type="number" value={oneWay.passengers} onChange={(e) => setOneWay({ ...oneWay, passengers: e.target.value })} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Pick-up Location:</CFormLabel>
                <CFormInput value={oneWay.pickup} onChange={(e) => setOneWay({ ...oneWay, pickup: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Drop-off Location:</CFormLabel>
                <CFormInput value={oneWay.dropoff} onChange={(e) => setOneWay({ ...oneWay, dropoff: e.target.value })} />
              </CCol>
            </CRow>
            <div className="text-end">
              <CButton color="primary">Submit</CButton>
            </div>
          </CCardBody>
        </CCard>
      )}

      {/* Return Transfer Form */}
      {tripType === "return" && (
        <CCard>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Date (Onward):</CFormLabel>
                <CFormInput type="date" value={returnTrip.onwardDate} onChange={(e) => setReturnTrip({ ...returnTrip, onwardDate: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Pick-up Time:</CFormLabel>
                <CFormInput type="time" value={returnTrip.time} onChange={(e) => setReturnTrip({ ...returnTrip, time: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>No. of Passengers:</CFormLabel>
                <CFormInput type="number" value={returnTrip.passengers} onChange={(e) => setOneWay({ ...returnTrip, passengers: e.target.value })} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Pick-up Location:</CFormLabel>
                <CFormInput value={returnTrip.pickup} onChange={(e) => setReturnTrip({ ...returnTrip, pickup: e.target.value })} />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Drop-off Location:</CFormLabel>
                <CFormInput value={returnTrip.dropoff} onChange={(e) => setReturnTrip({ ...returnTrip, dropoff: e.target.value })} />
              </CCol>
            </CRow>
            <div className="text-end">
              <CButton color="primary">Submit</CButton>
            </div>
          </CCardBody>
        </CCard>
      )}
    </CCardBody>
  </CCard>
)}

    </div>
  );
}
