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

export default function TripsListings() {
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
  const [attachments, setAttachments] = useState([]);

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

  // Get service types directly from configuration
  const availableServiceTypes = Object.keys(serviceTypeConfig);

  // Load data
  useEffect(() => {
    setTrips(JSON.parse(localStorage.getItem("trips")) || []);
    setOperationData(JSON.parse(localStorage.getItem("operations")) || []);
    setDrivers(JSON.parse(localStorage.getItem("drivers")) || []);
    setVehicles(JSON.parse(localStorage.getItem("vehicles")) || []);
    setTripCosts(JSON.parse(localStorage.getItem("tripCosts")) || []);
    setTripIncharges(JSON.parse(localStorage.getItem("tripIncharges")) || []);
    setVendors(JSON.parse(localStorage.getItem("vendors") || "[]"));
    setAttachments(JSON.parse(localStorage.getItem("tripAttachments") || "[]"));
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

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Navigate to create new
  const handleNewRequest = () => navigate("/logistics/newrequest");

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
    const linkedDriver = drivers.find((d) => d.tripOwner === trip.tripOwner) || {};
    const linkedVehicle = vehicles.find((v) => v.tripOwner === trip.tripOwner) || {};
    const linkedCost = tripCosts.find((c) => c.tripOwner === trip.tripOwner) || {};
    const linkedIncharge = tripIncharges.find((i) => i.tripOwner === trip.tripOwner) || {};
    const linkedAttachments = attachments.filter((a) => a.tripOwner === trip.tripOwner) || [];

    setEditTrip({ 
      ...trip, 
      driver: linkedDriver,
      vehicle: linkedVehicle,
      cost: linkedCost,
      incharge: linkedIncharge,
      attachments: linkedAttachments
    });
    setEditModalVisible(true);
  };

  const handleEditChange = (e) => {
    setEditTrip({ ...editTrip, [e.target.name]: e.target.value });
  };

  const handleServiceFieldChange = (field, value) => {
    setEditTrip({ 
      ...editTrip, 
      serviceFields: {
        ...editTrip.serviceFields,
        [field]: value
      }
    });
  };

  // Handle vehicle changes
  const handleVehicleChange = (field, value) => {
    setEditTrip({
      ...editTrip,
      vehicle: {
        ...editTrip.vehicle,
        [field]: value
      }
    });
  };

  // Handle driver changes
  const handleDriverChange = (e) => {
    setEditTrip({
      ...editTrip,
      driver: {
        ...editTrip.driver,
        [e.target.name]: e.target.value
      }
    });
  };

  // Handle cost changes
  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setEditTrip({
      ...editTrip,
      cost: {
        ...editTrip.cost,
        [name]: value,
        totalCost: name === 'adhocCost' 
          ? (parseFloat(editTrip.cost?.vehicleCost || 0) + parseFloat(value || 0))
          : (parseFloat(value || 0) + parseFloat(editTrip.cost?.adhocCost || 0))
      }
    });
  };

  // Handle incharge changes
  const handleInchargeChange = (e) => {
    setEditTrip({
      ...editTrip,
      incharge: {
        ...editTrip.incharge,
        [e.target.name]: e.target.value
      }
    });
  };

  // Handle file attachment
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toLocaleDateString(),
      tripOwner: editTrip.tripOwner
    }));
    setEditTrip({
      ...editTrip,
      attachments: [...(editTrip.attachments || []), ...newAttachments]
    });
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setEditTrip({
      ...editTrip,
      attachments: (editTrip.attachments || []).filter(attachment => attachment.id !== id)
    });
  };

  const handleEditSave = () => {
    const updatedTrips = [...trips];
    updatedTrips[selectedTripIndex] = editTrip;
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
    
    // Update other data in localStorage
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const existingCosts = JSON.parse(localStorage.getItem("tripCosts") || "[]");
    const existingIncharges = JSON.parse(localStorage.getItem("tripIncharges") || "[]");
    const existingAttachments = JSON.parse(localStorage.getItem("tripAttachments") || "[]");

    // Update driver
    const driverIndex = existingDrivers.findIndex(d => d.tripOwner === editTrip.tripOwner);
    if (driverIndex !== -1) {
      existingDrivers[driverIndex] = { ...editTrip.driver, tripOwner: editTrip.tripOwner };
    } else {
      existingDrivers.push({ ...editTrip.driver, tripOwner: editTrip.tripOwner });
    }

    // Update vehicle
    const vehicleIndex = existingVehicles.findIndex(v => v.tripOwner === editTrip.tripOwner);
    if (vehicleIndex !== -1) {
      existingVehicles[vehicleIndex] = { ...editTrip.vehicle, tripOwner: editTrip.tripOwner };
    } else {
      existingVehicles.push({ ...editTrip.vehicle, tripOwner: editTrip.tripOwner });
    }

    // Update cost
    const costIndex = existingCosts.findIndex(c => c.tripOwner === editTrip.tripOwner);
    if (costIndex !== -1) {
      existingCosts[costIndex] = { ...editTrip.cost, tripOwner: editTrip.tripOwner };
    } else {
      existingCosts.push({ ...editTrip.cost, tripOwner: editTrip.tripOwner });
    }

    // Update incharge
    const inchargeIndex = existingIncharges.findIndex(i => i.tripOwner === editTrip.tripOwner);
    if (inchargeIndex !== -1) {
      existingIncharges[inchargeIndex] = { ...editTrip.incharge, tripOwner: editTrip.tripOwner };
    } else {
      existingIncharges.push({ ...editTrip.incharge, tripOwner: editTrip.tripOwner });
    }

    // Update attachments
    const filteredAttachments = existingAttachments.filter(a => a.tripOwner !== editTrip.tripOwner);
    const updatedAttachments = [...filteredAttachments, ...(editTrip.attachments || [])];

    localStorage.setItem("drivers", JSON.stringify(existingDrivers));
    localStorage.setItem("vehicles", JSON.stringify(existingVehicles));
    localStorage.setItem("tripCosts", JSON.stringify(existingCosts));
    localStorage.setItem("tripIncharges", JSON.stringify(existingIncharges));
    localStorage.setItem("tripAttachments", JSON.stringify(updatedAttachments));

    setEditModalVisible(false);
  };

  // View trip details
  const handleViewClick = (index) => {
    const trip = trips[index];
    setViewTrip(trip);
    setViewModalVisible(true);
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

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Quotes Listing</h5>
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
                      <CFormSelect label="Trip Owner (Company Name)" name="tripOwner" value={editTrip.tripOwner || ''} onChange={handleEditChange} required>
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
                        value={editTrip.requestedDate || getCurrentDate()} 
                        onChange={handleEditChange} 
                        required 
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect label="Trip Type (Service Type)" name="tripType" value={editTrip.tripType || ''} onChange={handleEditChange} required>
                        <option value="">Select Trip Type</option>
                        {availableServiceTypes.map((serviceType, idx) => (
                          <option key={idx} value={serviceType}>
                            {serviceType}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="date" label="Start Date" name="startDate" value={editTrip.startDate || ''} onChange={handleEditChange} required />
                    </CCol>
                  </CRow>
                  
                  {/* Service Specific Fields */}
                  {editTrip.tripType && serviceTypeConfig[editTrip.tripType] && (
                    <div className="mt-3">
                      <h6>Service Specific Details</h6>
                      <CRow>
                        {serviceTypeConfig[editTrip.tripType].map((fieldConfig, index) => (
                          <CCol md={6} key={fieldConfig.field} className="mb-3">
                            {renderServiceFieldInput(fieldConfig)}
                          </CCol>
                        ))}
                      </CRow>
                    </div>
                  )}
                  
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect label="Status" name="status" value={editTrip.status || ''} onChange={handleEditChange}>
                        <option value="">Select Status</option>
                        <option value="Requested">Requested</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approval">Approval</option>
                        <option value="Rejected">Rejected</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput label="Assigned To" name="assigned" value={editTrip.assigned || ''} onChange={handleEditChange} />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormTextarea label="Additional Information" name="information" rows="3" value={editTrip.information || ''} onChange={handleEditChange} />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Vehicle Details */}
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>Vehicle Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect
                        label="Vehicle Owner (Vendor)"
                        value={editTrip.vehicle?.owner || ""}
                        onChange={(e) => handleVehicleChange("owner", e.target.value)}
                      >
                        <option value="">-- Select Vendor --</option>
                        <option value="Own">Own</option>
                        {vendors.map((vendor, i) => (
                          <option key={i} value={vendor.name}>
                            {vendor.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormSelect
                        label="Vehicle Type"
                        value={editTrip.vehicle?.vehicleType || ""}
                        onChange={(e) => handleVehicleChange("vehicleType", e.target.value)}
                      >
                        <option value="">-- Select Type --</option>
                        {vehicles.map((veh, i) => (
                          <option key={i} value={veh.vehicleType}>
                            {veh.vehicleType}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        label="No. of Vehicles"
                        type="number"
                        min="1"
                        value={editTrip.vehicle?.number || ""}
                        onChange={(e) => handleVehicleChange("number", e.target.value)}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        label="Cost (AED)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editTrip.vehicle?.cost || ""}
                        onChange={(e) => handleVehicleChange("cost", e.target.value)}
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Driver Details */}
            <CAccordionItem itemKey={3}>
              <CAccordionHeader>Driver Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormSelect
                        label="Name"
                        name="name"
                        value={editTrip.driver?.name || ""}
                        onChange={handleDriverChange}
                      >
                        <option value="">-- Select Name --</option>
                        {drivers.map((d, idx) => (
                          <option key={idx} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        label="Contact"
                        name="contact"
                        value={editTrip.driver?.contact || ""}
                        onChange={handleDriverChange}
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Trip Incharge */}
            <CAccordionItem itemKey={4}>
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
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        label="Remarks for Vendor"
                        name="vendorRemarks"
                        value={editTrip.incharge?.vendorRemarks || ""}
                        onChange={handleInchargeChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        label="LC Full Name"
                        name="lcFullName"
                        value={editTrip.incharge?.lcFullName || ""}
                        onChange={handleInchargeChange}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        label="LC Email"
                        name="lcEmail"
                        type="email"
                        value={editTrip.incharge?.lcEmail || ""}
                        onChange={handleInchargeChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        label="LC Mobile"
                        name="lcMobile"
                        value={editTrip.incharge?.lcMobile || ""}
                        onChange={handleInchargeChange}
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Trip Cost */}
            <CAccordionItem itemKey={5}>
              <CAccordionHeader>Trip Cost Details</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput 
                        label="Vehicle Cost" 
                        name="vehicleCost" 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={editTrip.cost?.vehicleCost || 0} 
                        onChange={handleCostChange} 
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput 
                        label="Adhoc Cost" 
                        name="adhocCost" 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={editTrip.cost?.adhocCost || 0} 
                        onChange={handleCostChange} 
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormInput 
                        label="Total Cost" 
                        value={editTrip.cost?.totalCost || 0} 
                        disabled 
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Attachments */}
            <CAccordionItem itemKey={6}>
              <CAccordionHeader>Attachments</CAccordionHeader>
              <CAccordionBody>
                {(editTrip.attachments && editTrip.attachments.length > 0) ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        {editTrip.attachments.map((attachment, index) => (
                          <CTableRow key={attachment.id}>
                            <CTableDataCell>{attachment.name}</CTableDataCell>
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