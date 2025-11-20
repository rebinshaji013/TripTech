import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton, CCard, CCardHeader, CCardBody,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CModal, CModalHeader, CModalBody, CModalFooter,
  CForm, CFormInput, CFormSelect, CFormTextarea,
  CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CRow, CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilControl, cilMagnifyingGlass } from "@coreui/icons";

export default function TOTripsListings() {
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
  const [ownerData, setOwnerData] = useState([]);
  const [vendors, setVendors] = useState([]);

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
  ];

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load data
  useEffect(() => {
    setTrips(JSON.parse(localStorage.getItem("trips")) || []);
    setOperationData(JSON.parse(localStorage.getItem("owneroperations")) || []);
    setDrivers(JSON.parse(localStorage.getItem("drivers")) || []);
    setVehicles(JSON.parse(localStorage.getItem("vehicles")) || []);
    setTripCosts(JSON.parse(localStorage.getItem("tripCosts")) || []);
    setTripIncharges(JSON.parse(localStorage.getItem("tripIncharges")) || []);
    setVendors(JSON.parse(localStorage.getItem("vendors") || "[]"));
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
  const handleNewRequest = () => navigate("/owner/newrequest");

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
    const trip = trips[index];
    
    // Get linked data
    const linkedIncharge = tripIncharges.find((i) => i.tripOwner === trip.tripOwner) || {};
    
    setEditTrip({ 
      ...trip, 
      incharge: linkedIncharge,
      vendors: trip.vendors || [],
      serviceFields: trip.serviceFields || {}
    });
    setEditModalVisible(true);
  };

  const handleTripChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tripType') {
      const selectedService = serviceTypes.find(service => service.name === value);
      setEditTrip({ 
        ...editTrip, 
        [name]: value,
        serviceFields: selectedService ? initializeServiceFields(selectedService.fields) : {}
      });
    } else {
      setEditTrip({ ...editTrip, [name]: value });
    }
  };

  const handleServiceFieldChange = (fieldName, value) => {
    setEditTrip({
      ...editTrip,
      serviceFields: {
        ...editTrip.serviceFields,
        [fieldName]: value
      }
    });
  };

  const handleInchargeChange = (e) => {
    setEditTrip({
      ...editTrip,
      incharge: {
        ...editTrip.incharge,
        [e.target.name]: e.target.value
      }
    });
  };

  // Vendor handling functions
  const handleVendorMultiSelect = (selectedOptions) => {
    const selectedVendorNames = Array.from(selectedOptions).map(option => option.value);
    
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
    
    setEditTrip({
      ...editTrip,
      vendors: updatedVendorList
    });
  };

  const handleVendorListChange = (index, field, value) => {
    const updated = [...editTrip.vendors];
    updated[index][field] = value;
    setEditTrip({
      ...editTrip,
      vendors: updated
    });
  };

  const removeVendorRow = (index) => {
    const updatedVendorList = [...editTrip.vendors];
    updatedVendorList.splice(index, 1);
    setEditTrip({
      ...editTrip,
      vendors: updatedVendorList
    });
  };

  // Initialize service fields with empty values
  const initializeServiceFields = (fields) => {
    const initialFields = {};
    fields.forEach(field => {
      initialFields[field.field] = editTrip.serviceFields?.[field.field] || '';
    });
    return initialFields;
  };

  // Get current service type fields
  const getCurrentServiceFields = () => {
    const selectedService = serviceTypes.find(service => service.name === editTrip.tripType);
    return selectedService ? selectedService.fields : [];
  };

  // Render appropriate input component based on field type
  const renderServiceFieldInput = (fieldConfig) => {
    const { field, type } = fieldConfig;
    const value = editTrip.serviceFields?.[field] || '';

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

  const handleEditSave = () => {
    const updatedTrips = [...trips];
    updatedTrips[selectedTripIndex] = editTrip;
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
    
    // Update trip incharges in localStorage
    const existingIncharges = JSON.parse(localStorage.getItem('tripIncharges') || '[]');
    const inchargeIndex = existingIncharges.findIndex(i => i.tripOwner === editTrip.tripOwner);
    
    if (inchargeIndex !== -1) {
      existingIncharges[inchargeIndex] = { ...editTrip.incharge, tripOwner: editTrip.tripOwner };
    } else {
      existingIncharges.push({ ...editTrip.incharge, tripOwner: editTrip.tripOwner });
    }
    
    localStorage.setItem('tripIncharges', JSON.stringify(existingIncharges));
    setEditModalVisible(false);
  };

  // View trip details
  const handleViewClick = (index) => {
    const trip = trips[index];
    setViewTrip(trip);
    setViewModalVisible(true);
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

      {/* ===== Enhanced Edit Trip Modal ===== */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="xl">
        <CModalHeader>Edit Trip Details</CModalHeader>
        <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <CAccordion alwaysOpen>
            {/* Trip Details */}
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Trip Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        label="Trip Owner (Company Name)"
                        name="tripOwner"
                        value={editTrip.tripOwner || ownerData[0]?.company || ''}
                        onChange={handleTripChange}
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="date"
                        label="Trip Requested Date"
                        name="requestedDate"
                        value={editTrip.requestedDate || getCurrentDate()}
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
                        value={editTrip.tripType || ''}
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
                        value={editTrip.startDate || ''}
                        onChange={handleTripChange}
                        required
                      />
                    </CCol>
                  </CRow>

                  {/* Service Specific Fields */}
                  {editTrip.tripType && (
                    <>
                      <hr />
                      <h6>Service Specific Details</h6>
                      <CRow>
                        {getCurrentServiceFields().map((fieldConfig, index) => (
                          <CCol md={6} key={fieldConfig.field} className="mb-3">
                            {renderServiceFieldInput(fieldConfig)}
                          </CCol>
                        ))}
                      </CRow>
                    </>
                  )}

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect label="Status" name="status" value={editTrip.status || ''} onChange={handleTripChange}>
                        <option value="">Select Status</option>
                        <option value="Requested">Requested</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approval">Approval</option>
                        <option value="Rejected">Rejected</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput label="Assigned To" name="assigned" value={editTrip.assigned || ''} onChange={handleTripChange} />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormTextarea 
                        label="Additional Information" 
                        name="information" 
                        rows="3" 
                        value={editTrip.information || ''} 
                        onChange={handleTripChange} 
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Vendor Details */}
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>Vendor Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  {/* Multi-select Vendor Dropdown */}
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <label className="form-label">Select Vendors</label>
                      <CFormSelect
                        multiple
                        size="5"
                        value={editTrip.vendors?.map(v => v.vendor) || []}
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
                  {editTrip.vendors?.map((v, idx) => (
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
              </CAccordionBody>
            </CAccordionItem>

            {/* Trip Incharge */}
            <CAccordionItem itemKey={3}>
              <CAccordionHeader>Trip Incharge Contact Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect
                        label="Trip Incharge / Coordinator"
                        name="incharge"
                        value={editTrip.incharge?.incharge || ""}
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
                        value={editTrip.incharge?.remarks || ""}
                        onChange={handleInchargeChange}
                        placeholder="Enter trip remarks"
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditSave}>Save Changes</CButton>
        </CModalFooter>
      </CModal>

      {/* ===== View Trip Modal ===== */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>Trip Details</CModalHeader>
        <CModalBody>
          {viewTrip ? (
            <>
              <h6>Trip Owner: {viewTrip.tripOwner}</h6>
              <p><strong>Trip Type:</strong> {viewTrip.tripType}</p>
              <p><strong>Start Date:</strong> {viewTrip.startDate}</p>
              <p><strong>Requested Date:</strong> {viewTrip.requestedDate}</p>
              <p><strong>Status:</strong> {viewTrip.status}</p>
              <p><strong>Assigned To:</strong> {viewTrip.assigned || "-"}</p>
              <p><strong>Information:</strong> {viewTrip.information || "N/A"}</p>
              
              {/* Display Service Specific Fields */}
              {viewTrip.serviceFields && Object.keys(viewTrip.serviceFields).length > 0 && (
                <>
                  <hr />
                  <h6>Service Specific Details:</h6>
                  {Object.entries(viewTrip.serviceFields).map(([field, value]) => (
                    value && (
                      <p key={field}><strong>{field}:</strong> {value}</p>
                    )
                  ))}
                </>
              )}

              {/* Display Vendor Details */}
              {viewTrip.vendors && viewTrip.vendors.length > 0 && (
                <>
                  <hr />
                  <h6>Vendor Details:</h6>
                  {viewTrip.vendors.map((vendor, idx) => (
                    <div key={idx} className="mb-2">
                      <p><strong>Vendor {idx + 1}:</strong> {vendor.vendor}</p>
                      <p><strong>Contact:</strong> {vendor.contact}</p>
                      <p><strong>Email:</strong> {vendor.email}</p>
                      <p><strong>Mobile:</strong> {vendor.mobile}</p>
                      <p><strong>Type:</strong> {vendor.type}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Display Incharge Details */}
              {viewTrip.incharge && (
                <>
                  <hr />
                  <h6>Trip Incharge:</h6>
                  <p><strong>Incharge:</strong> {viewTrip.incharge.incharge}</p>
                  <p><strong>Remarks:</strong> {viewTrip.incharge.remarks}</p>
                </>
              )}
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