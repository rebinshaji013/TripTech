import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CCardBody, CCol, CRow, CForm, CCardHeader,
  CFormInput, CFormSelect, CFormTextarea, CButton,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CModal, CModalHeader, CModalBody, CModalFooter,
  CBadge
} from '@coreui/react'

export default function VNewRequestDetails() {
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
  const [vehicle, setVehicle] = useState({ vehicleType: "", number: "", cost: "" })
  const [driver, setDriver] = useState({ name: "", contact: "" })
  const [tripIncharge, setTripIncharge] = useState({
    incharge: '',
    remarks: '',
    vendorRemarks: '',
  })
  const [tripCost, setTripCost] = useState({ vehicleCost: 0, adhocCost: 0, totalCost: 0 });
  const [trips, setTrips] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [ownerData, setOwnerData] = useState([])
  const [driverData, setDriverData] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(storedTrips);
  }, []);

  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(savedVendors);
  
    const savedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    setVehicleData(savedVehicles);
  }, []);


  useEffect(() => {
    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    setDriverData(storedDrivers );
  }, []);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("voperations") || "[]");
    setOperationData(storedUsers);
  }, []);

   useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("owners") || "[]")
    setOwnerData(storedOwners)
  }, [])

  useEffect(() => {
    const tripData = JSON.parse(localStorage.getItem("selectedTrip"));
    if (tripData) setTrip(tripData);
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); // or however you store it
    setTrip((prev) => ({ ...prev, createdBy: userRole }));
  }, []);

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

  const [showTripModal, setShowTripModal] = useState(false)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showInchargeModal, setShowInchargeModal] = useState(false)
  const [showCostModal, setShowCostModal] = useState(false)

  const handleTripChange = (e) => setTrip({ ...trip, [e.target.name]: e.target.value })
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

  const handleSave = () => {
    const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]")
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]")
    const existingIncharges = JSON.parse(localStorage.getItem('tripIncharges') || '[]')
    const existingCosts = JSON.parse(localStorage.getItem('tripCosts') || '[]')

    localStorage.setItem("trips", JSON.stringify([...existingTrips, trip]))
    localStorage.setItem("vehicles", JSON.stringify([...existingVehicles, vehicle]))
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, driver]))
    localStorage.setItem('tripIncharges', JSON.stringify([...existingIncharges, tripIncharge]))
    localStorage.setItem('tripCosts', JSON.stringify([...existingCosts, tripCost]))

    navigate("/vendor/trips")
  }

  const isTripValid = trip.tripOwner && trip.tripType && trip.startDate && trip.startPoint && trip.endPoint && trip.requestedDate && trip.status
  const isVehicleValid = vehicle.vehicleType && vehicle.number && vehicle.cost
  const isDriverValid = driver.name && driver.contact
  const isInchargeValid = tripIncharge.incharge && tripIncharge.remarks &&  tripIncharge.vendorRemarks
  const isCostValid = tripCost.adhocCost !== "" && tripCost.totalCost >= 0

  return (
    <div className="p-3">
      <CCardHeader className="d-flex justify-content-between align-items-center"> <h5>Trip Request Details</h5> </CCardHeader>
      <CAccordion alwaysOpen>
      {/* Trip Details */}
<CAccordionItem itemKey={1}>
<CAccordionHeader>Trip Details</CAccordionHeader>
<CAccordionBody>
{isTripValid ? (
<>
<CTable bordered striped>
<CTableBody>
<CTableRow><CTableDataCell>Trip Owner</CTableDataCell><CTableDataCell>{trip.tripOwner}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Trip Type</CTableDataCell><CTableDataCell>{trip.tripType}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Start Date</CTableDataCell><CTableDataCell>{trip.startDate}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Start Point</CTableDataCell><CTableDataCell>{trip.startPoint}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>End Point</CTableDataCell><CTableDataCell>{trip.endPoint}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Requested Date</CTableDataCell><CTableDataCell>{trip.requestedDate}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Status</CTableDataCell><CTableDataCell>{getStatusBadge(trip.status)}</CTableDataCell></CTableRow>
</CTableBody>
</CTable>
<CButton color="primary" className="mt-2" onClick={() => setShowTripModal(true)}>Edit</CButton>
</>
) : (
<div className="text-center">
<CButton color="primary" onClick={() => setShowTripModal(true)}>Add Trip Details</CButton>
</div>
)}
</CAccordionBody>
</CAccordionItem>

{/* Vehicle Details */}
<CAccordionItem itemKey={2}>
        <CAccordionHeader>Vehicle Details</CAccordionHeader>
        <CAccordionBody>
          {vehicleList.length > 0 ? (
            <>
              <CTable bordered striped>
                <CTableBody>
                  {vehicleList.map((v, idx) => (
                    <React.Fragment key={idx}>
                      <CTableRow>
                        <CTableDataCell>Vehicle Owner</CTableDataCell>
                        <CTableDataCell>{v.owner}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Vehicle Type</CTableDataCell>
                        <CTableDataCell>{v.vehicleType}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>No. of Vehicles</CTableDataCell>
                        <CTableDataCell>{v.number}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Cost (AED)</CTableDataCell>
                        <CTableDataCell>{v.cost}</CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  ))}
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowVehicleModal(true)}>
                Edit
              </CButton>
            </>
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
<CTableRow><CTableDataCell>Name</CTableDataCell><CTableDataCell>{driver.name}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Contact</CTableDataCell><CTableDataCell>{driver.contact}</CTableDataCell></CTableRow>
</CTableBody>
</CTable>
<CButton color="primary" className="mt-2" onClick={() => setShowDriverModal(true)}>Edit</CButton>
</>
) : (
<div className="text-center">
<CButton color="primary" onClick={() => setShowDriverModal(true)}>Add Driver Details</CButton>
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
<CTableRow><CTableDataCell>Incharge</CTableDataCell><CTableDataCell>{tripIncharge.incharge}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Remarks</CTableDataCell><CTableDataCell>{tripIncharge.remarks}</CTableDataCell></CTableRow>
<CTableRow><CTableDataCell>Vendor Remarks</CTableDataCell><CTableDataCell>{tripIncharge.vendorRemarks}</CTableDataCell></CTableRow>
</CTableBody>
</CTable>
<CButton color="primary" className="mt-2" onClick={() => setShowInchargeModal(true)}>Edit</CButton>
</>
) : (
<div className="text-center">
<CButton color="primary" onClick={() => setShowInchargeModal(true)}>Add Trip Incharge</CButton>
</div>
)}
</CAccordionBody>
</CAccordionItem>


{/* Trip Cost */}
<CAccordionItem itemKey={5}>
  <CAccordionHeader>Trip Cost Details</CAccordionHeader>
  <CAccordionBody>
    {(tripCost.vehicleCost > 0 || tripCost.adhocCost > 0) ? (
      <>
        <CTable bordered striped>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>Vehicle Cost</CTableDataCell>
              <CTableDataCell>{tripCost.vehicleCost}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Adhoc Cost</CTableDataCell>
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
</CAccordion>
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
                <CFormSelect label="Trip Owner (Company Name)" name="tripOwner" value={trip.tripOwner} onChange={handleTripChange} required >
                <option value="">-- Select TO --</option>
                  {ownerData.map((owner, idx) => (
                <option key={idx} value={owner.name}>
                  {owner.name}
                </option>
              ))}
                </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput type="date" label="Trip Requested Date" name="requestedDate" value={trip.requestedDate} onChange={handleTripChange} required />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect label="Trip Type (Service Type)" name="tripType" value={trip.tripType} onChange={handleTripChange} required>
                    <option value="">Select Trip Type</option>
                    <option value="Halfday Trip">Halfday Trip</option>
                    <option value="Fullday Trip">Fullday Trip</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormInput type="date" label="Start Date" name="startDate" value={trip.startDate} onChange={handleTripChange} required />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput type="text" label="Start Point" name="startPoint" value={trip.startPoint} onChange={handleTripChange} required />
                </CCol>
                <CCol md={6}>
                  <CFormInput type="text" label="End Point" name="endPoint" value={trip.endPoint} onChange={handleTripChange} required />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect label="Status" name="status" value={trip.status} onChange={handleTripChange}>
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
                  <CFormTextarea label="Additional Information" name="information" rows="3" value={trip.information} onChange={handleTripChange} />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowTripModal(false)}>Ok</CButton>
        </CModalFooter>
      </CModal>

 {/* Vehicle Modal */}
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
                <option key={i} value={vendor.name}>
                  {vendor.name}
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
              value={v.number}
              onChange={(e) => handleVehicleListChange(idx, "number", e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              label="Cost (AED)"
              type="number"
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
    <CButton color="secondary" onClick={() => setShowVehicleModal(false)}>Ok</CButton>
  </CModalFooter>
</CModal>

{/* Driver Modal */}
<CModal visible={showDriverModal} onClose={() => setShowDriverModal(false)}>
  <CModalHeader>Driver Details</CModalHeader>
  <CModalBody>
    <CForm>
      <CFormInput label="Name" name="name" value={driver.name} onChange={handleDriverChange} />
      <CFormInput label="Contact" name="contact" value={driver.contact} onChange={handleDriverChange} />
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setShowDriverModal(false)}>Ok</CButton>
  </CModalFooter>
</CModal>

{/* Incharge Modal */}
<CModal visible={showInchargeModal} onClose={() => setShowInchargeModal(false)}>
        <CModalHeader>Trip Incharge</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect label="Trip Incharge / Coordinator" name="incharge" value={tripIncharge.incharge} onChange={handleInchargeChange}>
                <option value="">-- Select User --</option>
                {operationData.map((operation, idx) => (
                      <option key={idx} value={operation.name}>
                        {operation.name}
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput label="Trip Remarks" name="remarks" value={tripIncharge.remarks} onChange={handleInchargeChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Vendor Remarks" name="vendorRemarks" value={tripIncharge.vendorRemarks} onChange={handleInchargeChange} />
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
      <CFormInput label="Adhoc Cost" name="adhocCost" type="number" value={tripCost.adhocCost} onChange={handleTripCostChange} />
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
