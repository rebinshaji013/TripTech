import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CCard, CCardBody, CCol, CRow, CForm, CCardHeader,
  CFormInput, CFormSelect, CFormTextarea, CButton,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CModal, CModalHeader, CModalBody, CModalFooter,
  CBadge,
} from '@coreui/react'

export default function TONewRequestDetails() {
  const navigate = useNavigate()

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Service Types Master Data with field types
  const serviceTypes = [
    { 
      id: 1, 
      name: 'One way transfer', 
      fields: [
        { field: 'Date', type: 'date' },
        { field: 'Pick up Time', type: 'time' },
        { field: 'Pick up Location', type: 'text' },
        { field: 'Drop off Location', type: 'text' },
        { field: 'Number of passengers', type: 'number' },
        { field: 'Vehicle Type', type: 'text' },
        { field: 'Special requests', type: 'textarea' }
      ] 
    },
    { 
      id: 2, 
      name: 'Return Transfer', 
      fields: [
        { field: 'Date', type: 'date' },
        { field: 'Pick up Time', type: 'time' },
        { field: 'Pick up Location', type: 'text' },
        { field: 'Drop off Location', type: 'text' },
        { field: 'Return pick up Location', type: 'text' },
        { field: 'Return time', type: 'time' },
        { field: 'Number of passengers', type: 'number' },
        { field: 'Vehicle Type', type: 'text' },
        { field: 'Special requests', type: 'textarea' }
      ] 
    },
    { 
      id: 3, 
      name: 'Airport Transfers - Arrival', 
      fields: [
        { field: 'Airport Name', type: 'text' },
        { field: 'Terminal', type: 'text' },
        { field: 'Arrival Time', type: 'time' },
        { field: 'Flight number', type: 'text' },
        { field: 'Number of Passenger', type: 'number' },
        { field: 'Vehicle type', type: 'text' },
        { field: 'Drop off Location', type: 'text' }
      ] 
    },
    { 
      id: 4, 
      name: 'Airport Transfers - Departure', 
      fields: [
        { field: 'Pick up Location', type: 'text' },
        { field: 'Pick up time', type: 'time' },
        { field: 'Airport Name', type: 'text' },
        { field: 'Terminal', type: 'text' },
        { field: 'Flight number', type: 'text' },
        { field: 'Number of Passenger', type: 'number' },
        { field: 'Vehicle Type', type: 'text' }
      ] 
    },
    { 
      id: 5, 
      name: 'Half Day Service', 
      fields: [
        { field: 'Pick up Location', type: 'text' },
        { field: 'Start time', type: 'time' },
        { field: 'End Time', type: 'time' },
        { field: 'Number of Passengers', type: 'number' },
        { field: 'Vehicle Type', type: 'text' },
        { field: 'Optional itinerary', type: 'textarea' }
      ] 
    },
    { 
      id: 6, 
      name: 'Full Day Service', 
      fields: [
        { field: 'Pick up Location', type: 'text' },
        { field: 'Start time', type: 'time' },
        { field: 'End Time', type: 'time' },
        { field: 'Number of Passengers', type: 'number' },
        { field: 'Vehicle Type', type: 'text' },
        { field: 'Optional itinerary', type: 'textarea' }
      ] 
    },
    { 
      id: 7, 
      name: '24 hours Service', 
      fields: [
        { field: 'Pick up Location', type: 'text' },
        { field: 'Start time', type: 'time' },
        { field: 'End Time', type: 'time' },
        { field: 'Number of Passengers', type: 'number' },
        { field: 'Vehicle Type', type: 'text' },
        { field: 'Optional itinerary', type: 'textarea' }
      ] 
    },
  ]

  const [trip, setTrip] = useState({
    tripOwner: '',
    tripType: '',
    startDate: '',
    status: 'Request Sent',
    requestedDate: getCurrentDate(),
    information: '',
    serviceFields: {}
  })
  const [tripIncharge, setTripIncharge] = useState({
    incharge: '',
    remarks: '',
  })
  
  // Vendor State - Modified for multiple vendor entries
  const [vendors, setVendors] = useState([])
  const [vendorList, setVendorList] = useState([])
  const [showVendorModal, setShowVendorModal] = useState(false)

  const [trips, setTrips] = useState([])
  const [operationData, setOperationData] = useState([])
  const [ownerData, setOwnerData] = useState([])

  // Add loading state
  const [isLoading, setIsLoading] = useState(true)

  // Add state to track if sections are saved
  const [tripDetailsSaved, setTripDetailsSaved] = useState(false)
  const [vendorDetailsSaved, setVendorDetailsSaved] = useState(false)
  const [inchargeDetailsSaved, setInchargeDetailsSaved] = useState(false)

  // State for multi-select vendors
  const [selectedVendors, setSelectedVendors] = useState([])

  // State to control accordion active item
  const [activeAccordionItem, setActiveAccordionItem] = useState(1)

  useEffect(() => {
    try {
      const storedTrips = JSON.parse(localStorage.getItem('trips') || '[]')
      setTrips(storedTrips)
    } catch (error) {
      console.error('Error loading trips:', error)
      setTrips([])
    }
  }, [])

  useEffect(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('owneroperations') || '[]')
      setOperationData(storedUsers)
    } catch (error) {
      console.error('Error loading operations:', error)
      setOperationData([])
    }
  }, [])

  useEffect(() => {
    try {
      const storedOwners = JSON.parse(localStorage.getItem('owners') || '[]')
      setOwnerData(storedOwners)
    } catch (error) {
      console.error('Error loading owners:', error)
      setOwnerData([])
    }
  }, [])

  // Load vendors from localStorage
  useEffect(() => {
    try {
      const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]')
      setVendors(storedVendors)
    } catch (error) {
      console.error('Error loading vendors:', error)
      setVendors([])
    }
  }, [])

  useEffect(() => {
    if (ownerData.length > 0 && !trip.tripOwner) {
      setTrip((prev) => ({
        ...prev,
        tripOwner: ownerData[0].name,
      }))
    }
    setIsLoading(false)
  }, [ownerData])

  const [showTripModal, setShowTripModal] = useState(false)
  const [showInchargeModal, setShowInchargeModal] = useState(false)

  const handleTripChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'tripType') {
      const selectedService = serviceTypes.find(service => service.name === value)
      setTrip({ 
        ...trip, 
        [name]: value,
        serviceFields: selectedService ? initializeServiceFields(selectedService.fields) : {}
      })
    } else {
      setTrip({ ...trip, [name]: value })
    }
  }

  const handleServiceFieldChange = (fieldName, value) => {
    setTrip({
      ...trip,
      serviceFields: {
        ...trip.serviceFields,
        [fieldName]: value
      }
    })
  }

  const handleInchargeChange = (e) => setTripIncharge({ ...tripIncharge, [e.target.name]: e.target.value })

  // Vendor handling functions - Modified for multi-select
  const handleVendorMultiSelect = (selectedOptions) => {
    const selectedVendorNames = Array.from(selectedOptions).map(option => option.value);
    setSelectedVendors(selectedVendorNames);
    
    // Auto-populate vendor details for all selected vendors
    const updatedVendorList = selectedVendorNames.map(vendorName => {
      const selectedVendor = vendors.find(vendor => vendor.company === vendorName);
      if (selectedVendor) {
        return {
          vendor: vendorName,
          contact: selectedVendor.contactPerson || selectedVendor.contact || selectedVendor.name || "",
          email: selectedVendor.email || "",
          mobile: selectedVendor.mobile || selectedVendor.phone || "",
          type: selectedVendor.type || "",
          status: "Active"
        };
      }
      return {
        vendor: vendorName,
        contact: "",
        email: "",
        mobile: "",
        type: "",
        status: "Active"
      };
    });
    
    setVendorList(updatedVendorList);
  };

  const handleVendorListChange = (index, field, value) => {
    const updated = [...vendorList];
    updated[index][field] = value;
    setVendorList(updated);
  };

  const removeVendorRow = (index) => {
    const updatedVendorList = [...vendorList];
    updatedVendorList.splice(index, 1);
    setVendorList(updatedVendorList);
    
    // Also remove from selected vendors
    const updatedSelectedVendors = [...selectedVendors];
    updatedSelectedVendors.splice(index, 1);
    setSelectedVendors(updatedSelectedVendors);
  };

  // Initialize service fields with empty values
  const initializeServiceFields = (fields) => {
    const initialFields = {}
    fields.forEach(field => {
      initialFields[field.field] = ''
    })
    return initialFields
  }

  // Get current service type fields
  const getCurrentServiceFields = () => {
    const selectedService = serviceTypes.find(service => service.name === trip.tripType)
    return selectedService ? selectedService.fields : []
  }

  // Render appropriate input component based on field type
  const renderServiceFieldInput = (fieldConfig) => {
    const { field, type } = fieldConfig;
    const value = trip.serviceFields?.[field] || '';

    switch (type) {
      case 'date':
        return (
          <CFormInput
            type="date"
            label={field}
            value={value}
            onChange={(e) => handleServiceFieldChange(field, e.target.value)}
          />
        );
      case 'time':
        return (
          <CFormInput
            type="time"
            label={field}
            value={value}
            onChange={(e) => handleServiceFieldChange(field, e.target.value)}
          />
        );
      case 'number':
        return (
          <CFormInput
            type="number"
            label={field}
            value={value}
            min="0"
            onChange={(e) => handleServiceFieldChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
          />
        );
      case 'textarea':
        return (
          <CFormTextarea
            label={field}
            value={value}
            rows="3"
            onChange={(e) => handleServiceFieldChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
          />
        );
      default:
        return (
          <CFormInput
            type="text"
            label={field}
            value={value}
            onChange={(e) => handleServiceFieldChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
          />
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Request Sent':
        return <CBadge color="info">{status}</CBadge>
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const handleSave = () => {
    try {
      const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]')
      const existingIncharges = JSON.parse(localStorage.getItem('tripIncharges') || '[]')

      const tripToSave = {
        ...trip,
        status: 'Request Sent',
        vendors: vendorList
      }

      localStorage.setItem('trips', JSON.stringify([...existingTrips, tripToSave]))
      localStorage.setItem('tripIncharges', JSON.stringify([...existingIncharges, tripIncharge]))

      navigate('/owner/trips')
    } catch (error) {
      console.error('Error saving trip:', error)
      alert('Error saving trip. Please try again.')
    }
  }

  // Enhanced validation logic
  const isTripValid = trip.tripOwner && trip.tripType && trip.startDate && trip.requestedDate
  const isInchargeValid = tripIncharge.incharge && tripIncharge.remarks
  const isVendorValid = vendorList.length > 0 && vendorList.every(v => v.vendor)

  // Check if all sections are completed (using saved state OR validation)
  const isAllSectionsCompleted = 
    (isTripValid || tripDetailsSaved) && 
    (isVendorValid || vendorDetailsSaved) && 
    (isInchargeValid || inchargeDetailsSaved)

  // Render service-specific fields based on selected service type
  const renderServiceFields = () => {
    const currentServiceFields = getCurrentServiceFields()
    
    return currentServiceFields.map((fieldConfig, index) => (
      <CRow className="mb-3" key={fieldConfig.field}>
        <CCol md={12}>
          {renderServiceFieldInput(fieldConfig)}
        </CCol>
      </CRow>
    ))
  }

  // Render service fields in display table
  const renderServiceFieldsTable = () => {
    const currentServiceFields = getCurrentServiceFields()
    
    return currentServiceFields.map((fieldConfig) => (
      <CTableRow key={fieldConfig.field}>
        <CTableDataCell>{fieldConfig.field}</CTableDataCell>
        <CTableDataCell>{trip.serviceFields[fieldConfig.field] || 'Not specified'}</CTableDataCell>
      </CTableRow>
    ))
  }

  // Save trip details from modal and close it
  const handleSaveTripDetails = () => {
    if (trip.tripType && trip.startDate && trip.requestedDate) {
      setTripDetailsSaved(true)
      setShowTripModal(false)
    } else {
      alert('Please fill all required fields before saving.')
    }
  }

  // Save vendor details from modal and close it
  const handleSaveVendorDetails = () => {
    if (vendorList.length > 0 && vendorList.every(v => v.vendor)) {
      setVendorDetailsSaved(true)
      setShowVendorModal(false)
      // Navigate to next accordion (Trip Incharge)
      setActiveAccordionItem(3)
    } else {
      alert('Please select at least one vendor before saving.')
    }
  }

  // Save incharge details from modal and close it
  const handleSaveInchargeDetails = () => {
    if (tripIncharge.incharge && tripIncharge.remarks) {
      setInchargeDetailsSaved(true)
      setShowInchargeModal(false)
    } else {
      alert('Please fill all fields before saving.')
    }
  }

  // Function to navigate to Vendor Details accordion
  const navigateToVendorDetails = () => {
    setActiveAccordionItem(2)
  }

  // Add loading state
  if (isLoading) {
    return (
      <div className="p-3">
        <CCard>
          <CCardBody className="text-center">
            <p>Loading...</p>
          </CCardBody>
        </CCard>
      </div>
    )
  }

  return (
    <div className="p-3">

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Request Details</h5>
        </CCardHeader>
        <CCardBody>
          <CAccordion activeItemKey={activeAccordionItem}>
            {/* Trip Details */}
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Trip Details</CAccordionHeader>
              <CAccordionBody>
                {isTripValid || tripDetailsSaved ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>Trip Owner</CTableDataCell>
                          <CTableDataCell>{trip.tripOwner || ownerData[0]?.company}</CTableDataCell>
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
                          <CTableDataCell>Requested Date</CTableDataCell>
                          <CTableDataCell>{trip.requestedDate}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Status</CTableDataCell>
                          <CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell>
                        </CTableRow>
                        {trip.information && (
                          <CTableRow>
                            <CTableDataCell>Additional Information</CTableDataCell>
                            <CTableDataCell>{trip.information}</CTableDataCell>
                          </CTableRow>
                        )}
                        {/* Service Specific Fields */}
                        {trip.tripType && renderServiceFieldsTable()}
                      </CTableBody>
                    </CTable>
                    <div className="text-center mt-3">
                      <CButton color="success" onClick={navigateToVendorDetails}>
                        Add Vendor Details
                      </CButton>
                    </div>
                    <div className="text-center mt-2">
                      <CButton color="primary" onClick={() => setShowTripModal(true)}>
                        Edit Trip Details
                      </CButton>
                    </div>
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

            {/* Vendor Details Accordion */}
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>Vendor Details</CAccordionHeader>
              <CAccordionBody>
                {isVendorValid || vendorDetailsSaved ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        {vendorList.map((v, idx) => (
                          <React.Fragment key={idx}>
                            <CTableRow>
                              <CTableDataCell>Vendor</CTableDataCell>
                              <CTableDataCell>{v.vendor}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Contact</CTableDataCell>
                              <CTableDataCell>{v.contact}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Email</CTableDataCell>
                              <CTableDataCell>{v.email}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Mobile</CTableDataCell>
                              <CTableDataCell>{v.mobile}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Type</CTableDataCell>
                              <CTableDataCell>{v.type}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Status</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={v.status === "Active" ? "success" : "secondary"}>
                                  {v.status}
                                </CBadge>
                              </CTableDataCell>
                            </CTableRow>
                            {idx < vendorList.length - 1 && (
                              <CTableRow>
                                <CTableDataCell colSpan="2" className="text-center">
                                  <hr style={{ borderTop: '2px dashed #ccc', margin: '10px 0' }} />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </CTableBody>
                    </CTable>
                    <div className="text-center mt-3">
                      <CButton color="success" onClick={() => setActiveAccordionItem(3)}>
                        Add Trip Incharge
                      </CButton>
                    </div>
                    <div className="text-center mt-2">
                      <CButton color="primary" onClick={() => setShowVendorModal(true)}>
                        Edit Vendor Details
                      </CButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <CButton color="primary" onClick={() => setShowVendorModal(true)}>
                      Add Vendor Details
                    </CButton>
                  </div>
                )}
              </CAccordionBody>
            </CAccordionItem>

            {/* Trip Incharge */}
            <CAccordionItem itemKey={3}>
              <CAccordionHeader>Trip Incharge Contact Details</CAccordionHeader>
              <CAccordionBody>
                {isInchargeValid || inchargeDetailsSaved ? (
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
                    <div className="text-center mt-2">
                      <CButton color="primary" onClick={() => setShowInchargeModal(true)}>
                        Edit Trip Incharge
                      </CButton>
                    </div>
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
            <CButton 
              color="success" 
              size="lg" 
              onClick={handleSave}
              disabled={!isAllSectionsCompleted}
            >
              Save Trip Request
            </CButton>
            {!isAllSectionsCompleted && (
              <p className="text-muted mt-2">
                Please complete all sections before saving the trip request.
              </p>
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* Trip Modal */}
      <CModal visible={showTripModal} onClose={() => setShowTripModal(false)} size="lg">
        <CModalHeader>Trip Details</CModalHeader>
        <CModalBody>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Trip Owner (Company Name)"
                    name="tripOwner"
                    value={trip.tripOwner || ownerData[0]?.company || ''}
                    disabled
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Trip Requested Date"
                    name="requestedDate"
                    value={trip.requestedDate || getCurrentDate()}
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
                    {serviceTypes.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
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

              {/* Service Specific Fields */}
              {trip.tripType && (
                <>
                  <hr />
                  {renderServiceFields()}
                </>
              )}


              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormTextarea
                    label="Additional Information"
                    name="information"
                    rows="3"
                    value={trip.information}
                    onChange={handleTripChange}
                    placeholder="Enter any additional information about the trip"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveTripDetails}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={() => setShowTripModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Vendor Modal */}
      <CModal visible={showVendorModal} onClose={() => setShowVendorModal(false)} size="lg">
        <CModalHeader>Vendor Details</CModalHeader>
        <CModalBody>
          <CForm>
            {/* Multi-select Vendor Dropdown */}
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Select Vendors</label>
                <CFormSelect
                  multiple
                  size="5"
                  value={selectedVendors}
                  onChange={(e) => handleVendorMultiSelect(e.target.selectedOptions)}
                  required
                >
                  {vendors.map((vendor, i) => (
                    <option key={i} value={vendor.company}>
                      {vendor.company}
                    </option>
                  ))}
                </CFormSelect>
                <div className="form-text">
                  Hold Ctrl (or Cmd on Mac) to select multiple vendors
                </div>
              </CCol>
            </CRow>

            {/* Vendor Details Table */}
            {vendorList.map((v, idx) => (
              <div key={idx} className="vendor-section mb-4 p-3 border rounded">
                <CRow className="align-items-center mb-2">
                  <CCol>
                    <h6 className="mb-0">Vendor: {v.vendor}</h6>
                  </CCol>
                  <CCol xs="auto">
                    <CButton color="danger" size="sm" onClick={() => removeVendorRow(idx)}>
                      Remove
                    </CButton>
                  </CCol>
                </CRow>
                
                <CRow className="align-items-end">
                  <CCol md={3}>
                    <CFormInput
                      label="Contact"
                      value={v.contact}
                      onChange={(e) => handleVendorListChange(idx, "contact", e.target.value)}
                      placeholder="Contact"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      label="Email"
                      type="email"
                      value={v.email}
                      onChange={(e) => handleVendorListChange(idx, "email", e.target.value)}
                      placeholder="Email"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput
                      label="Mobile"
                      type="tel"
                      value={v.mobile}
                      onChange={(e) => handleVendorListChange(idx, "mobile", e.target.value)}
                      placeholder="Mobile"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Type"
                      value={v.type}
                      onChange={(e) => handleVendorListChange(idx, "type", e.target.value)}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Event company">Event company</option>
                      <option value="Travel Agency">Travel Agency</option>
                      <option value="Direct Client">Direct Client</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </div>
            ))}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveVendorDetails}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={() => setShowVendorModal(false)}>
            Cancel
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
                  required
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
                  placeholder="Enter trip remarks"
                  required
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveInchargeDetails}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={() => setShowInchargeModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}