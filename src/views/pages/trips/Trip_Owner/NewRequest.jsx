import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CCardBody, CCol, CRow, CForm, CCardHeader,
  CFormInput, CFormSelect, CFormTextarea, CButton,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CModal, CModalHeader, CModalBody, CModalFooter,
  CBadge,
} from '@coreui/react'

export default function TONewRequestDetails() {
  const navigate = useNavigate()

  const [trip, setTrip] = useState({
    tripOwner: '',
    tripType: '',
    startDate: '',
    startPoint: '',
    endPoint: '',
    status: '',
    requestedDate: '',
    information: '',
  })
  const [tripIncharge, setTripIncharge] = useState({
    incharge: '',
    remarks: '',
  })
  const [trips, setTrips] = useState([])
  const [operationData, setOperationData] = useState([])
  const [ownerData, setOwnerData] = useState([])

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || []
    setTrips(storedTrips)
  }, [])

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('owneroperations') || '[]')
    setOperationData(storedUsers)
  }, [])

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem('owners') || '[]')
    setOwnerData(storedOwners)
  }, [])

  useEffect(() => {
    if (ownerData.length > 0 && !trip.tripOwner) {
      setTrip((prev) => ({
        ...prev,
        tripOwner: ownerData[0].name,
      }))
    }
  }, [ownerData])

  const [showTripModal, setShowTripModal] = useState(false)
  const [showInchargeModal, setShowInchargeModal] = useState(false)

  const handleTripChange = (e) => setTrip({ ...trip, [e.target.name]: e.target.value })
  const handleInchargeChange = (e) => setTripIncharge({ ...tripIncharge, [e.target.name]: e.target.value })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return <CBadge color="info">{status}</CBadge>
      case 'Quoted':
        return <CBadge color="warning">{status}</CBadge>
      case 'Approved':
        return <CBadge color="success">{status}</CBadge>
      case 'Change Requested':
        return <CBadge color="primary">{status}</CBadge>
      case 'Rejected':
        return <CBadge color="danger">{status}</CBadge>
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const handleSave = () => {
    const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]')
    const existingIncharges = JSON.parse(localStorage.getItem('tripIncharges') || '[]')

    localStorage.setItem('trips', JSON.stringify([...existingTrips, trip]))
    localStorage.setItem('tripIncharges', JSON.stringify([...existingIncharges, tripIncharge]))

    navigate('/owner/trips')
  }

  const isTripValid =
    trip.tripOwner &&
    trip.tripType &&
    trip.startDate &&
    trip.startPoint &&
    trip.endPoint &&
    trip.requestedDate &&
    trip.status

  const isInchargeValid =
    tripIncharge.incharge &&
    tripIncharge.remarks

  return (
    <div className="p-3">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Trip Request Details</h5>
      </CCardHeader>

      <CAccordion alwaysOpen>
        {/* Trip Details */}
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>Trip Details</CAccordionHeader>
          <CAccordionBody>
            {isTripValid ? (
              <>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Trip Owner</CTableDataCell>
                      <CTableDataCell>{trip.tripOwner}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Trip Type</CTableDataCell>
                      <CTableDataCell>{trip.tripType}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Start Date</CTableDataCell>
                      <CTableDataCell>{trip.startDate}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Start Point</CTableDataCell>
                      <CTableDataCell>{trip.startPoint}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>End Point</CTableDataCell>
                      <CTableDataCell>{trip.endPoint}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Requested Date</CTableDataCell>
                      <CTableDataCell>{trip.requestedDate}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Status</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CButton color="primary" className="mt-2" onClick={() => setShowTripModal(true)}>
                  Edit
                </CButton>
              </>
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowTripModal(true)}>
                  Add Trip Details
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>

        {/* Trip Incharge */}
        <CAccordionItem itemKey={4}>
          <CAccordionHeader>Trip Incharge Contact Details</CAccordionHeader>
          <CAccordionBody>
            {isInchargeValid ? (
              <>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Incharge</CTableDataCell>
                      <CTableDataCell>{tripIncharge.incharge}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Remarks</CTableDataCell>
                      <CTableDataCell>{tripIncharge.remarks}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CButton color="primary" className="mt-2" onClick={() => setShowInchargeModal(true)}>
                  Edit
                </CButton>
              </>
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowInchargeModal(true)}>
                  Add Trip Incharge
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>

      {/* Final Save Trip Request Button */}
      <div className="text-center mt-3">
        <CButton color="success" size="lg" onClick={handleSave}>
          Save Trip Request
        </CButton>
      </div>

      {/* Trip Modal */}
      <CModal visible={showTripModal} onClose={() => setShowTripModal(false)}>
        <CModalHeader>Trip Details</CModalHeader>
        <CModalBody>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Trip Owner (Company Name)"
                    name="tripOwner"
                    value={trip.tripOwner || ownerData[0]?.name || ''}
                    disabled
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Trip Requested Date"
                    name="requestedDate"
                    value={trip.requestedDate}
                    onChange={handleTripChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    label="Trip Type (Service Type)"
                    name="tripType"
                    value={trip.tripType}
                    onChange={handleTripChange}
                    required
                  >
                    <option value="">Select Trip Type</option>
                    <option value="Halfday Trip">Halfday Trip</option>
                    <option value="Fullday Trip">Fullday Trip</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={trip.startDate}
                    onChange={handleTripChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Start Point"
                    name="startPoint"
                    value={trip.startPoint}
                    onChange={handleTripChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="End Point"
                    name="endPoint"
                    value={trip.endPoint}
                    onChange={handleTripChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    label="Status"
                    name="status"
                    value={trip.status}
                    onChange={handleTripChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Requested">Requested</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Change Requested">Change Requested</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormTextarea
                    label="Additional Information"
                    name="information"
                    rows="3"
                    value={trip.information}
                    onChange={handleTripChange}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setTrip((prev) => ({
                ...prev,
                tripOwner: ownerData[0]?.name || '',
              }))
              setShowTripModal(false)
            }}
          >
            Ok
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Incharge Modal */}
      <CModal visible={showInchargeModal} onClose={() => setShowInchargeModal(false)}>
        <CModalHeader>Trip Incharge</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  label="Trip Incharge / Coordinator"
                  name="incharge"
                  value={tripIncharge.incharge}
                  onChange={handleInchargeChange}
                >
                  <option value="">-- Select User --</option>
                  {operationData.map((operation, idx) => (
                    <option key={idx} value={operation.name}>
                      {operation.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Trip Remarks"
                  name="remarks"
                  value={tripIncharge.remarks}
                  onChange={handleInchargeChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              if (tripIncharge.incharge && tripIncharge.remarks) {
                setShowInchargeModal(false)
              } else {
                alert('Please fill all fields before saving.')
              }
            }}
          >
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setShowInchargeModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
