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

export default function NewRequestDetails() {
  const navigate = useNavigate()

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [trips, setTrips] = useState([{
    tripOwner: '',
    tripType: '',
    createdBy: '',
    startDate: '',
    status: '',
    requestedDate: getCurrentDate(), // Set default to current date
    information: '',
    serviceFields: {},
  }]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [vehicleList, setVehicleList] = useState([]);
  const [driver, setDriver] = useState({ name: "", contact: "" })
  const [tripIncharge, setTripIncharge] = useState({
    tripName: "",
    createdBy: "",
    tripIncharge: "",
    incharge: '',
    remarks: '',
    vendorRemarks: '',
    lcFullName: '',
    lcEmail: '',
    lcMobile: '',
  })
  const [tripCost, setTripCost] = useState({ vehicleCost: 0, adhocCost: 0, totalCost: 0 });
  const [vehicleData, setVehicleData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [ownerData, setOwnerData] = useState([])
  const [driverData, setDriverData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Modal states
  const [showTripModal, setShowTripModal] = useState(false)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showInchargeModal, setShowInchargeModal] = useState(false)
  const [showCostModal, setShowCostModal] = useState(false)

  // Service type configuration with field types
  const serviceTypeConfig = {
    "One way transfer": [
      { field: "Date", type: "date" },
      { field: "Pick up Time", type: "time" },
      { field: "Pick up Location", type: "text" },
      { field: "Drop off Location", type: "text" },
      { field: "Number of passengers", type: "number" },
      { field: "Vehicle Type", type: "text" },
      { field: "Special requests", type: "textarea" }
    ],
    "Return Transfer": [
      { field: "Date", type: "date" },
      { field: "Pick up Time", type: "time" },
      { field: "Pick up Location", type: "text" },
      { field: "Drop off Location", type: "text" },
      { field: "Return pick up Location", type: "text" },
      { field: "Return time", type: "time" },
      { field: "Number of passengers", type: "number" },
      { field: "Vehicle Type", type: "text" },
      { field: "Special requests", type: "textarea" }
    ],
    "Airport Transfers - Arrival": [
      { field: "Airport Name", type: "text" },
      { field: "Terminal", type: "text" },
      { field: "Arrival Time", type: "time" },
      { field: "Flight number", type: "text" },
      { field: "Number of Passenger", type: "number" },
      { field: "Vehicle type", type: "text" },
      { field: "Drop off Location", type: "text" }
    ],
    "Airport Transfers - Departure": [
      { field: "Pick up Location", type: "text" },
      { field: "Pick up time", type: "time" },
      { field: "Airport Name", type: "text" },
      { field: "Terminal", type: "text" },
      { field: "Flight number", type: "text" },
      { field: "Number of Passenger", type: "number" },
      { field: "Vehicle Type", type: "text" }
    ],
    "Half Day Service": [
      { field: "Pick up Location", type: "text" },
      { field: "Start time", type: "time" },
      { field: "End Time", type: "time" },
      { field: "Number of Passengers", type: "number" },
      { field: "Vehicle Type", type: "text" },
      { field: "Optional itinerary", type: "textarea" }
    ],
    "Full Day Service": [
      { field: "Pick up Location", type: "text" },
      { field: "Start time", type: "time" },
      { field: "End Time", type: "time" },
      { field: "Number of Passengers", type: "number" },
      { field: "Vehicle Type", type: "text" },
      { field: "Optional itinerary", type: "textarea" }
    ],
    "24 hours Service": [
      { field: "Pick up Location", type: "text" },
      { field: "Start time", type: "time" },
      { field: "End Time", type: "time" },
      { field: "Number of Passengers", type: "number" },
      { field: "Vehicle Type", type: "text" },
      { field: "Optional itinerary", type: "textarea" }
    ]
  };

  // Helper function to get input type based on field configuration
  const getInputType = (fieldConfig) => {
    return fieldConfig.type;
  };

  // Get service types directly from configuration
  const availableServiceTypes = Object.keys(serviceTypeConfig);

  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(savedVendors);
  
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    setVehicleData(savedVehicles);
  }, []);

  useEffect(() => {
    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    setDriverData(storedDrivers);
  }, []);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("operations") || "[]");
    setOperationData(storedUsers);
  }, []);

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("owners") || "[]")
    setOwnerData(storedOwners)
  }, [])

  // Initialize createdBy only once when component mounts
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setTrips(prev => prev.map(trip => ({
        ...trip,
        createdBy: userRole
      })));
    }
  }, []);

  // Update service fields when trip type changes
  useEffect(() => {
    const currentTrip = trips[currentTripIndex];
    if (currentTrip?.tripType && serviceTypeConfig[currentTrip.tripType]) {
      const fields = serviceTypeConfig[currentTrip.tripType];
      const initialFields = {};
      fields.forEach(fieldConfig => {
        initialFields[fieldConfig.field] = currentTrip.serviceFields?.[fieldConfig.field] || '';
      });
      
      const updatedTrips = [...trips];
      updatedTrips[currentTripIndex] = {
        ...currentTrip,
        serviceFields: initialFields
      };
      setTrips(updatedTrips);
    }
  }, [trips[currentTripIndex]?.tripType]);

  // --- Automatically update trip cost whenever vehicleList changes ---
  useEffect(() => {
    const totalVehicleCost = vehicleList.reduce((sum, v) => {
      const cost = parseFloat(v.cost) || 0;
      const count = parseInt(v.number) || 0;
      return sum + cost * count;
    }, 0);

    setTripCost((prev) => ({
      ...prev,
      vehicleCost: totalVehicleCost,
      totalCost: totalVehicleCost + (parseFloat(prev.adhocCost) || 0),
    }));
  }, [vehicleList]);
  
  // --- Handle change for dynamic vehicle rows ---
  const handleVehicleListChange = (index, field, value) => {
    const updated = [...vehicleList];
    updated[index][field] = value;
    setVehicleList(updated);
  };

  // --- Handle change for service fields ---
  const handleServiceFieldChange = (field, value) => {
    const updatedTrips = [...trips];
    updatedTrips[currentTripIndex] = {
      ...updatedTrips[currentTripIndex],
      serviceFields: {
        ...updatedTrips[currentTripIndex].serviceFields,
        [field]: value
      }
    };
    setTrips(updatedTrips);
  };

  // --- Add new vehicle row ---
  const addVehicleRow = () => {
    setVehicleList([
      ...vehicleList,
      { owner: "", vehicleType: "", number: "", cost: "" }
    ]);
  };

  // --- Remove vehicle row ---
  const removeVehicleRow = (index) => {
    const updated = [...vehicleList];
    updated.splice(index, 1);
    setVehicleList(updated);
  };

  // --- Add new trip ---
  const addNewTrip = () => {
    const userRole = localStorage.getItem("userRole");
    setTrips(prev => [...prev, {
      tripOwner: '',
      tripType: '',
      createdBy: userRole || '',
      startDate: '',
      status: '',
      requestedDate: getCurrentDate(), // Set default to current date for new trips too
      information: '',
      serviceFields: {},
    }]);
    setCurrentTripIndex(trips.length);
  };

  // --- Remove trip ---
  const removeTrip = (index) => {
    if (trips.length > 1) {
      const updatedTrips = trips.filter((_, i) => i !== index);
      setTrips(updatedTrips);
      if (currentTripIndex >= index) {
        setCurrentTripIndex(Math.max(0, currentTripIndex - 1));
      }
    }
  };

  // --- Handle trip change ---
  const handleTripChange = (e) => {
    const { name, value } = e.target;
    const updatedTrips = [...trips];
    updatedTrips[currentTripIndex] = {
      ...updatedTrips[currentTripIndex],
      [name]: value
    };
    
    // Reset service fields when trip type changes
    if (name === 'tripType') {
      updatedTrips[currentTripIndex].serviceFields = {};
    }
    
    setTrips(updatedTrips);
  }

  // --- Handle file attachment ---
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toLocaleDateString()
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // --- Remove attachment ---
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const handleDriverChange = (e) => setDriver({ ...driver, [e.target.name]: e.target.value })
  const handleInchargeChange = (e) => setTripIncharge({ ...tripIncharge, [e.target.name]: e.target.value })
  const handleTripCostChange = (e) => {
    const { name, value } = e.target;
    setTripCost((prev) => {
      const updated = { ...prev, [name]: value };
      updated.totalCost = (parseFloat(updated.vehicleCost) || 0) + (parseFloat(updated.adhocCost) || 0);
      return updated;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Requested": return <CBadge color="info">{status}</CBadge>
      case "Quoted": return <CBadge color="warning">{status}</CBadge>
      case "Approved": return <CBadge color="success">{status}</CBadge>
      case "Rejected": return <CBadge color="danger">{status}</CBadge>
      default: return <CBadge color="secondary">{status}</CBadge>
    }
  }

  // Render appropriate input component based on field type
  const renderServiceFieldInput = (fieldConfig) => {
    const { field, type } = fieldConfig;
    const value = currentTrip.serviceFields?.[field] || '';

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

  const handleSave = () => {
    const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]")
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]")
    const existingIncharges = JSON.parse(localStorage.getItem('tripIncharges') || '[]')
    const existingCosts = JSON.parse(localStorage.getItem('tripCosts') || '[]')
    const existingAttachments = JSON.parse(localStorage.getItem('tripAttachments') || '[]')

    // Save all trips with service fields
    localStorage.setItem("trips", JSON.stringify([...existingTrips, ...trips]))
    localStorage.setItem("vehicles", JSON.stringify([...existingVehicles, ...vehicleList]))
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, driver]))
    localStorage.setItem('tripIncharges', JSON.stringify([...existingIncharges, tripIncharge]))
    localStorage.setItem('tripCosts', JSON.stringify([...existingCosts, tripCost]))
    localStorage.setItem('tripAttachments', JSON.stringify([...existingAttachments, ...attachments]))

    navigate("/logistics/trips")
  }

  const currentTrip = trips[currentTripIndex];
  
  // FIXED: Improved validation to show trip details when basic info is filled
  const isTripValid = currentTrip?.tripOwner && currentTrip?.tripType && currentTrip?.startDate && currentTrip?.requestedDate && currentTrip?.status
  
  // FIXED: Improved vehicle validation to show details when at least one vehicle is added with basic info
  const isVehicleValid = vehicleList.length > 0 && vehicleList.some(v => v.vehicleType || v.number || v.cost || v.owner)
  
  const isDriverValid = driver.name && driver.contact
  const isInchargeValid = tripIncharge.incharge && tripIncharge.remarks && tripIncharge.vendorRemarks && tripIncharge.lcFullName && tripIncharge.lcEmail && tripIncharge.lcMobile
  const isCostValid = tripCost.adhocCost !== "" && tripCost.totalCost >= 0

  // Display service fields in trip details
  const renderServiceFieldsDisplay = () => {
    if (!currentTrip?.tripType || !currentTrip?.serviceFields || Object.keys(currentTrip.serviceFields).length === 0) return null;

    return (
      <>
        {Object.entries(currentTrip.serviceFields).map(([field, value]) => (
          value && (
            <CTableRow key={field}>
              <CTableDataCell><strong>{field}</strong></CTableDataCell>
              <CTableDataCell>{value}</CTableDataCell>
            </CTableRow>
          )
        ))}
      </>
    );
  };

  // FIXED: Function to display trip details with all available information
  const renderTripDetails = () => {
    if (!currentTrip) return null;

    return (
      <>
        <CTable bordered striped>
          <CTableBody>
            <CTableRow>
              <CTableDataCell><strong>Trip Owner</strong></CTableDataCell>
              <CTableDataCell>{currentTrip.tripOwner}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell><strong>Trip Type</strong></CTableDataCell>
              <CTableDataCell>{currentTrip.tripType}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell><strong>Start Date</strong></CTableDataCell>
              <CTableDataCell>{currentTrip.startDate}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell><strong>Requested Date</strong></CTableDataCell>
              <CTableDataCell>{currentTrip.requestedDate}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell><strong>Status</strong></CTableDataCell>
              <CTableDataCell>{getStatusBadge(currentTrip.status)}</CTableDataCell>
            </CTableRow>
            {currentTrip.information && (
              <CTableRow>
                <CTableDataCell><strong>Additional Information</strong></CTableDataCell>
                <CTableDataCell>{currentTrip.information}</CTableDataCell>
              </CTableRow>
            )}
            {renderServiceFieldsDisplay()}
          </CTableBody>
        </CTable>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <CButton color="primary" onClick={() => setShowTripModal(true)}>
            Edit
          </CButton>
          <div>
            <CButton color="info" onClick={addNewTrip} className="me-2">
              + Add Another Trip
            </CButton>
            {trips.length > 1 && (
              <CButton color="danger" onClick={() => removeTrip(currentTripIndex)}>
                Remove Current Trip
              </CButton>
            )}
          </div>
        </div>
      </>
    );
  };

  // FIXED: Function to display vehicle details
  const renderVehicleDetails = () => {
    if (vehicleList.length === 0) return null;

    return (
      <>
        <CTable bordered striped>
          <CTableBody>
            {vehicleList.map((v, idx) => (
              <React.Fragment key={idx}>
                <CTableRow className="table-primary">
                  <CTableDataCell colSpan="2" className="text-center">
                    <strong>Vehicle {idx + 1}</strong>
                  </CTableDataCell>
                </CTableRow>
                {v.owner && (
                  <CTableRow>
                    <CTableDataCell><strong>Vehicle Owner</strong></CTableDataCell>
                    <CTableDataCell>{v.owner}</CTableDataCell>
                  </CTableRow>
                )}
                {v.vehicleType && (
                  <CTableRow>
                    <CTableDataCell><strong>Vehicle Type</strong></CTableDataCell>
                    <CTableDataCell>{v.vehicleType}</CTableDataCell>
                  </CTableRow>
                )}
                {v.number && (
                  <CTableRow>
                    <CTableDataCell><strong>No. of Vehicles</strong></CTableDataCell>
                    <CTableDataCell>{v.number}</CTableDataCell>
                  </CTableRow>
                )}
                {v.cost && (
                  <CTableRow>
                    <CTableDataCell><strong>Cost (AED)</strong></CTableDataCell>
                    <CTableDataCell>{v.cost}</CTableDataCell>
                  </CTableRow>
                )}
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
        <CButton color="primary" className="mt-2" onClick={() => setShowVehicleModal(true)}>
          Edit
        </CButton>
      </>
    );
  };

  return (
    <div className="p-3">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Trip Request Details</h5>
      </CCardHeader>

      {/* Trip Selection */}
      {trips.length > 1 && (
        <div className="mb-3">
          <CFormSelect 
            value={currentTripIndex} 
            onChange={(e) => setCurrentTripIndex(parseInt(e.target.value))}
            label="Select Trip to View/Edit"
          >
            {trips.map((trip, index) => (
              <option key={index} value={index}>
                Trip {index + 1} - {trip.tripType || 'No Type Selected'}
              </option>
            ))}
          </CFormSelect>
        </div>
      )}
    
      <CAccordion alwaysOpen>
        {/* Trip Details - FIXED: Now shows details when data is entered */}
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>
            Trip Details {trips.length > 1 && `(Trip ${currentTripIndex + 1} of ${trips.length})`}
          </CAccordionHeader>
          <CAccordionBody>
            {isTripValid ? (
              renderTripDetails()
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowTripModal(true)}>
                  Add Trip Details
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>
    
        {/* Vehicle Details - FIXED: Now shows details when vehicles are added */}
        <CAccordionItem itemKey={2}>
          <CAccordionHeader>Vehicle Details</CAccordionHeader>
          <CAccordionBody>
            {isVehicleValid ? (
              renderVehicleDetails()
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowVehicleModal(true)}>
                  Add Vehicle Details
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>
    
        {/* Driver Details */}
        <CAccordionItem itemKey={3}>
          <CAccordionHeader>Driver Details</CAccordionHeader>
          <CAccordionBody>
            {isDriverValid ? (
              <>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell><strong>Name</strong></CTableDataCell>
                      <CTableDataCell>{driver.name}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell><strong>Contact</strong></CTableDataCell>
                      <CTableDataCell>{driver.contact}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CButton color="primary" className="mt-2" onClick={() => setShowDriverModal(true)}>
                  Edit
                </CButton>
              </>
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowDriverModal(true)}>
                  Add Driver Details
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>
    
        {/* Trip Incharge – Only show if trip was created by TO */}
        {currentTrip?.createdBy === "TO" && (
          <CAccordionItem itemKey={4}>
            <CAccordionHeader>Trip Incharge Contact Details</CAccordionHeader>
            <CAccordionBody>
              {isInchargeValid ? (
                <>
                  <CTable bordered striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell><strong>Incharge</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.incharge}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell><strong>Remarks</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.remarks}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell><strong>Vendor Remarks</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.vendorRemarks}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell><strong>LC Full Name</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.lcFullName}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell><strong>Email</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.lcEmail}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell><strong>Mobile</strong></CTableDataCell>
                        <CTableDataCell>{tripIncharge.lcMobile}</CTableDataCell>
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
        )}
    
        {/* Trip Cost */}
        <CAccordionItem itemKey={5}>
          <CAccordionHeader>Trip Cost Details</CAccordionHeader>
          <CAccordionBody>
            {(tripCost.vehicleCost > 0 || tripCost.adhocCost > 0) ? (
              <>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell><strong>Vehicle Cost</strong></CTableDataCell>
                      <CTableDataCell>{tripCost.vehicleCost}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell><strong>Adhoc Cost</strong></CTableDataCell>
                      <CTableDataCell>{tripCost.adhocCost}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell><strong>Total Cost</strong></CTableDataCell>
                      <CTableDataCell><strong>{tripCost.totalCost}</strong></CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CButton color="primary" className="mt-2" onClick={() => setShowCostModal(true)}>
                  Edit
                </CButton>
              </>
            ) : (
              <div className="text-center">
                <CButton color="primary" onClick={() => setShowCostModal(true)}>
                  Add Trip Cost
                </CButton>
              </div>
            )}
          </CAccordionBody>
        </CAccordionItem>

        {/* Attachments */}
        <CAccordionItem itemKey={6}>
          <CAccordionHeader>Attachments</CAccordionHeader>
          <CAccordionBody>
            {attachments.length > 0 ? (
              <>
                <CTable bordered striped>
                  <CTableBody>
                    {attachments.map((attachment, index) => (
                      <CTableRow key={attachment.id}>
                        <CTableDataCell><strong>{attachment.name}</strong></CTableDataCell>
                        <CTableDataCell>{(attachment.size / 1024).toFixed(2)} KB</CTableDataCell>
                        <CTableDataCell>{attachment.uploadDate}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" size="sm" onClick={() => removeAttachment(attachment.id)}>
                            Remove
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </>
            ) : (
              <div className="text-center">
                <p>No attachments added</p>
              </div>
            )}
            
            <div className="mt-3">
              <CFormInput
                type="file"
                multiple
                onChange={handleFileUpload}
                label="Upload Attachments"
              />
              <small className="text-muted">You can upload multiple files at once</small>
            </div>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    
      {/* Main Save Button */}
      <div className="text-center mt-3">
        <CButton color="success" size="lg" onClick={handleSave}>
          Save Trip Request ({trips.length} {trips.length === 1 ? 'Trip' : 'Trips'})
        </CButton>
      </div>

      {/* Trip Modal */}
      <CModal visible={showTripModal} onClose={() => setShowTripModal(false)} size="lg">
        <CModalHeader>
          Trip Details {trips.length > 1 && `(Trip ${currentTripIndex + 1})`}
        </CModalHeader>
        <CModalBody>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect label="Trip Owner (Company Name)" name="tripOwner" value={currentTrip?.tripOwner || ''} onChange={handleTripChange} required>
                    <option value="">-- Select TO --</option>
                    {ownerData.map((owner, idx) => (
                      <option key={idx} value={owner.company}>
                        {owner.company}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput 
                    type="date" 
                    label="Trip Requested Date" 
                    name="requestedDate" 
                    value={currentTrip?.requestedDate || getCurrentDate()} 
                    onChange={handleTripChange} 
                    required 
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect label="Trip Type (Service Type)" name="tripType" value={currentTrip?.tripType || ''} onChange={handleTripChange} required>
                    <option value="">Select Trip Type</option>
                    {availableServiceTypes.map((serviceType, idx) => (
                      <option key={idx} value={serviceType}>
                        {serviceType}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput type="date" label="Start Date" name="startDate" value={currentTrip?.startDate || ''} onChange={handleTripChange} required />
                </CCol>
              </CRow>
              
              
              {/* Service Specific Fields */}
              {currentTrip?.tripType && serviceTypeConfig[currentTrip.tripType] && (
                <div className="mt-3">
                  <CRow>
                    {serviceTypeConfig[currentTrip.tripType].map((fieldConfig, index) => (
                      <CCol md={6} key={fieldConfig.field} className="mb-3">
                        {renderServiceFieldInput(fieldConfig)}
                      </CCol>
                    ))}
                  </CRow>
                </div>
              )}
              
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect label="Status" name="status" value={currentTrip?.status || ''} onChange={handleTripChange}>
                    <option value="">Select Status</option>
                    <option value="Requested">Requested</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormTextarea label="Additional Information" name="information" rows="3" value={currentTrip?.information || ''} onChange={handleTripChange} />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowTripModal(false)}>Close</CButton>
          <CButton color="primary" onClick={() => setShowTripModal(false)}>Save Changes</CButton>
        </CModalFooter>
      </CModal>

      {/* Vehicle Modal - FIXED: Now properly shows vendor names */}
      <CModal visible={showVehicleModal} onClose={() => setShowVehicleModal(false)} size="lg">
        <CModalHeader>Vehicle Details</CModalHeader>
        <CModalBody>
          <CForm>
            {vehicleList.map((v, idx) => (
              <CRow key={idx} className="align-items-end mb-3">
                <CCol md={3}>
                  <CFormSelect
                    label="Vehicle Owner (Vendor)"
                    value={v.owner}
                    onChange={(e) => handleVehicleListChange(idx, "owner", e.target.value)}
                  >
                    <option value="">-- Select Vendor --</option>
                    <option value="Own">Own</option>
                    {vendors.map((vendor, i) => (
                      <option key={i} value={vendor.company}>
                        {vendor.company}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    label="Vehicle Type"
                    value={v.vehicleType}
                    onChange={(e) => handleVehicleListChange(idx, "vehicleType", e.target.value)}
                  >
                    <option value="">-- Select Type --</option>
                    {vehicleData.map((veh, i) => (
                      <option key={i} value={veh.vehicleType}>
                        {veh.vehicleType}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    label="No. of Vehicles"
                    type="number"
                    min="1"
                    value={v.number}
                    onChange={(e) => handleVehicleListChange(idx, "number", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    label="Cost (AED)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.cost}
                    onChange={(e) => handleVehicleListChange(idx, "cost", e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <CButton color="danger" onClick={() => removeVehicleRow(idx)}>
                    Remove
                  </CButton>
                </CCol>
              </CRow>
            ))}

            <div className="text-center mt-3">
              <CButton color="success" onClick={addVehicleRow}>
                + Add Vehicle
              </CButton>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowVehicleModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Driver Modal */}
      <CModal visible={showDriverModal} onClose={() => setShowDriverModal(false)}>
        <CModalHeader>Driver Details</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Name"
              name="name"
              value={driver.name}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedDriver = driverData.find((d) => d.name === selectedName);
                setDriver({
                  name: selectedName,
                  contact: selectedDriver ? selectedDriver.contact : "",
                });
              }}
            >
              <option value="">-- Select Name --</option>
              {driverData.map((d, idx) => (
                <option key={idx} value={d.name}>
                  {d.name}
                </option>
              ))}
            </CFormSelect>
            <CFormInput
              label="Contact"
              name="contact"
              value={driver.contact}
              disabled
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDriverModal(false)}>Close</CButton>
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
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Remarks for Vendor"
                  name="vendorRemarks"
                  value={tripIncharge.vendorRemarks}
                  onChange={handleInchargeChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowInchargeModal(false)}>Ok</CButton>
        </CModalFooter>
      </CModal>

      {/* Cost Modal */}
      <CModal visible={showCostModal} onClose={() => setShowCostModal(false)}>
        <CModalHeader>Trip Cost</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput 
              label="Adhoc Cost" 
              name="adhocCost" 
              type="number" 
              min="0"
              step="0.01"
              value={tripCost.adhocCost} 
              onChange={handleTripCostChange} 
            />
            <CFormInput label="Total Cost" value={tripCost.totalCost} disabled />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCostModal(false)}>Ok</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}