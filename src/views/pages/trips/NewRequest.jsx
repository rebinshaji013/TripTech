import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'

export default function NewRequestDetails() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    tripType: '',
    date: '',
    startPlace: '',
    endPlace: '',
    startDate: '',
    endDate: '',
    status: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Retrieve existing trips from localStorage
    const existingTrips = JSON.parse(localStorage.getItem('trips')) || []

    // Add new trip
    const updatedTrips = [
      ...existingTrips,
      {
        type: formData.tripType,
        date: formData.date,
        startPlace: formData.startPlace,
        endPlace: formData.endPlace,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      },
    ]

    // Save back to localStorage
    localStorage.setItem('trips', JSON.stringify(updatedTrips))

    // Navigate back to Trips page
    navigate('/trips')
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={8}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <h5 className="mb-0">New Request Details</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    label="Trip Type"
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Trip Type</option>
                    <option value="City Tour">City Tour</option>
                    <option value="Road Trip">Road Trip</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Start Place"
                    name="startPlace"
                    value={formData.startPlace}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="End Place"
                    name="endPlace"
                    value={formData.endPlace}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select the Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div className="text-center">
                <CButton color="primary" type="submit">
                  Save Request
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
