import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CFormSelect,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CBadge,
  CForm,
} from "@coreui/react";

export default function NewBooking() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");
  const [oneWay, setOneWay] = useState({
    date: "",
    time: "",
    passengers: "",
    status: "",
    pickup: "",
    dropoff: "",
  });
  const [returnTrip, setReturnTrip] = useState({
    onwardDate: "",
    time: "",
    passengers: "",
    status: "",
    pickup: "",
    dropoff: "",
  });

  // Vehicle Details State - Updated to match reference structure
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleClass: "",
    brand: "",
    model: "",
    year: "",
    vehicleSeating: "",
  });

  // Driver Details State - Added from reference code
  const [driver, setDriver] = useState({ 
    name: "", 
    contact: "" 
  });

  // Trip Cost State
  const [tripCost, setTripCost] = useState({
    vehicleCost: 0,
    adhocCost: 0,
    totalCost: 0,
  });

  // Attachments State
  const [attachments, setAttachments] = useState([]);

  // Modal States
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);

  // Vehicle data options
  const [drivers, setDrivers] = useState([]);
  
  // Brand options
  const brandOptions = [
    "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", 
    "Audi", "Hyundai", "Kia", "Nissan", "Volkswagen",
    "Chevrolet", "Mazda", "Lexus", "Volvo", "Jeep"
  ];

  // Model options based on brand
  const modelOptions = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Hilux"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "City"],
    "Ford": ["F-150", "Explorer", "Escape", "Mustang", "Focus"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Creta", "i20"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Sorento", "Rio"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Jetta", "Polo"],
    "Chevrolet": ["Malibu", "Equinox", "Tahoe", "Spark", "Trax"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30"],
    "Lexus": ["ES", "RX", "NX", "LS", "UX"],
    "Volvo": ["XC60", "XC90", "S60", "S90", "XC40"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Compass", "Renegade", "Cherokee"]
  };

  // Year options from 2015 to 2025
  const yearOptions = Array.from({ length: 11 }, (_, i) => (2025 - i).toString());

  // Load drivers from localStorage
  useEffect(() => {
    const driverList = JSON.parse(localStorage.getItem("drivers") || "[]");
    setDrivers(driverList);
  }, []);

  // Calculate total cost whenever vehicle cost or adhoc cost changes
  useEffect(() => {
    setTripCost((prev) => ({
      ...prev,
      totalCost: (parseFloat(prev.vehicleCost) || 0) + (parseFloat(prev.adhocCost) || 0),
    }));
  }, [tripCost.vehicleCost, tripCost.adhocCost]);

  const handleSave = () => {
    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    // Flatten booking object so all fields are stored
    const newBooking =
      tripType === "oneway"
        ? {
            id: Date.now(), // unique ID
            tripType,
            date: oneWay.date,
            time: oneWay.time,
            passengers: oneWay.passengers,
            status: oneWay.status,
            pickup: oneWay.pickup,
            dropoff: oneWay.dropoff,
            vehicleDetails,
            driver,
            tripCost,
            attachments,
          }
        : {
            id: Date.now(),
            tripType,
            onwardDate: returnTrip.onwardDate,
            time: returnTrip.time,
            passengers: returnTrip.passengers,
            status: returnTrip.status,
            pickup: returnTrip.pickup,
            dropoff: returnTrip.dropoff,
            vehicleDetails,
            driver,
            tripCost,
            attachments,
          };

    localStorage.setItem(
      "bookings",
      JSON.stringify([...existingBookings, newBooking])
    );

    navigate("/logistics/bookings");
  };

  // Handle file upload for attachments
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toLocaleDateString(),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  // Handle vehicle details change
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset model when brand changes
    if (name === "brand") {
      setVehicleDetails((prev) => ({ 
        ...prev, 
        brand: value,
        model: "" 
      }));
    } else {
      setVehicleDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle driver details change
  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    
    // If name is selected from dropdown, auto-fill contact
    if (name === "name") {
      const selectedDriver = drivers.find((d) => d.name === value);
      setDriver({
        name: value,
        contact: selectedDriver ? selectedDriver.contact : "",
      });
    } else {
      setDriver((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle trip cost change
  const handleTripCostChange = (e) => {
    const { name, value } = e.target;
    setTripCost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if vehicle details are valid
  const isVehicleValid = vehicleDetails.vehicleClass && vehicleDetails.brand && vehicleDetails.model;

  // Check if driver details are valid
  const isDriverValid = driver.name && driver.contact;

  // Check if trip cost is valid
  const isCostValid = tripCost.totalCost >= 0;

  return (
    <div className="p-3">
      <CCard>
        <CCardHeader>
          <h5>Booking Details</h5>
        </CCardHeader>
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

          <CAccordion alwaysOpen>
            {/* Booking Details Accordion */}
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Booking Details</CAccordionHeader>
              <CAccordionBody>
                {/* One Way Transfer Form */}
                {tripType === "oneway" && (
                  <CCard className="mb-3">
                    <CCardBody>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel>Date:</CFormLabel>
                          <CFormInput
                            type="date"
                            value={oneWay.date}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, date: e.target.value })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Pick-up Time:</CFormLabel>
                          <CFormInput
                            type="time"
                            value={oneWay.time}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, time: e.target.value })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>No. of Passengers:</CFormLabel>
                          <CFormInput
                            type="number"
                            value={oneWay.passengers}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, passengers: e.target.value })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Status:</CFormLabel>
                          <select
                            id="statusOneWay"
                            className="form-select"
                            value={oneWay.status}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, status: e.target.value })
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Change Requested">Change Requested</option>
                            <option value="Driver Updated">Driver Updated</option>
                          </select>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel>Pick-up Location:</CFormLabel>
                          <CFormInput
                            value={oneWay.pickup}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, pickup: e.target.value })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Drop-off Location:</CFormLabel>
                          <CFormInput
                            value={oneWay.dropoff}
                            onChange={(e) =>
                              setOneWay({ ...oneWay, dropoff: e.target.value })
                            }
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                )}

                {/* Return Transfer Form */}
                {tripType === "return" && (
                  <CCard className="mb-3">
                    <CCardBody>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel>Date (Onward):</CFormLabel>
                          <CFormInput
                            type="date"
                            value={returnTrip.onwardDate}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                onwardDate: e.target.value,
                              })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Pick-up Time:</CFormLabel>
                          <CFormInput
                            type="time"
                            value={returnTrip.time}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                time: e.target.value,
                              })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>No. of Passengers:</CFormLabel>
                          <CFormInput
                            type="number"
                            value={returnTrip.passengers}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                passengers: e.target.value,
                              })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Status:</CFormLabel>
                          <select
                            id="statusReturn"
                            className="form-select"
                            value={returnTrip.status}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Change Requested">Change Requested</option>
                            <option value="Driver Updated">Driver Updated</option>
                          </select>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CFormLabel>Pick-up Location:</CFormLabel>
                          <CFormInput
                            value={returnTrip.pickup}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                pickup: e.target.value,
                              })
                            }
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel>Drop-off Location:</CFormLabel>
                          <CFormInput
                            value={returnTrip.dropoff}
                            onChange={(e) =>
                              setReturnTrip({
                                ...returnTrip,
                                dropoff: e.target.value,
                              })
                            }
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                )}
              </CAccordionBody>
            </CAccordionItem>

            {/* Vehicle Details Accordion */}
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>Vehicle Details</CAccordionHeader>
              <CAccordionBody>
                {isVehicleValid ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>Vehicle Class</CTableDataCell>
                          <CTableDataCell>{vehicleDetails.vehicleClass || "-"}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Brand Name</CTableDataCell>
                          <CTableDataCell>{vehicleDetails.brand || "-"}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Model Name</CTableDataCell>
                          <CTableDataCell>{vehicleDetails.model || "-"}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Year</CTableDataCell>
                          <CTableDataCell>{vehicleDetails.year || "-"}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Vehicle Seating</CTableDataCell>
                          <CTableDataCell>{vehicleDetails.vehicleSeating || "-"}</CTableDataCell>
                        </CTableRow>
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

            {/* Driver Details Accordion - Added from reference code */}
            <CAccordionItem itemKey={3}>
              <CAccordionHeader>Driver Details</CAccordionHeader>
              <CAccordionBody>
                {isDriverValid ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>Name</CTableDataCell>
                          <CTableDataCell>{driver.name}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>Contact</CTableDataCell>
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

            {/* Trip Cost Accordion */}
            <CAccordionItem itemKey={4}>
              <CAccordionHeader>Trip Cost Details</CAccordionHeader>
              <CAccordionBody>
                {isCostValid ? (
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
                          <CTableDataCell>
                            <strong>Total Cost</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <strong>{tripCost.totalCost}</strong>
                          </CTableDataCell>
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

            {/* Attachments Accordion */}
            <CAccordionItem itemKey={5}>
              <CAccordionHeader>Attachments</CAccordionHeader>
              <CAccordionBody>
                {attachments.length > 0 ? (
                  <>
                    <CTable bordered striped>
                      <CTableBody>
                        {attachments.map((attachment, index) => (
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

          {/* Save Button */}
          <div className="text-center mt-3">
            <CButton color="success" size="lg" onClick={handleSave}>
              Save Booking
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Vehicle Details Modal */}
      <CModal visible={showVehicleModal} onClose={() => setShowVehicleModal(false)} size="lg">
        <CModalHeader>Vehicle Details</CModalHeader>
        <CModalBody>
          <CForm>
            {/* Vehicle Class */}
            <CFormSelect
              label="Vehicle Class *"
              name="vehicleClass"
              value={vehicleDetails.vehicleClass}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Vehicle Class</option>
              <option value="Standard">Standard</option>
              <option value="Luxury">Luxury</option>
              <option value="Premium">Premium</option>
            </CFormSelect>

            {/* Brand Name */}
            <CFormSelect
              label="Brand Name *"
              name="brand"
              value={vehicleDetails.brand}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Brand</option>
              {brandOptions.map((brand, idx) => (
                <option key={idx} value={brand}>
                  {brand}
                </option>
              ))}
            </CFormSelect>

            {/* Model Name */}
            <CFormSelect
              label="Model Name *"
              name="model"
              value={vehicleDetails.model}
              onChange={handleVehicleChange}
              className="mb-2"
              disabled={!vehicleDetails.brand}
            >
              <option value="">Select Model</option>
              {vehicleDetails.brand && modelOptions[vehicleDetails.brand]?.map((model, idx) => (
                <option key={idx} value={model}>
                  {model}
                </option>
              ))}
            </CFormSelect>

            {/* Year */}
            <CFormSelect
              label="Year"
              name="year"
              value={vehicleDetails.year}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>

            {/* Vehicle Seating */}
            <CFormSelect
              label="Vehicle Seating"
              name="vehicleSeating"
              value={vehicleDetails.vehicleSeating}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Seating</option>
              <option value="3 Seater">3 Seater</option>
              <option value="4 Seater">4 Seater</option>
              <option value="5 Seater">5 Seater</option>
              <option value="6 Seater">6 Seater</option>
              <option value="7 Seater">7 Seater</option>
              <option value="8 Seater">8 Seater</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowVehicleModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => setShowVehicleModal(false)}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Driver Details Modal - Added from reference code */}
      <CModal visible={showDriverModal} onClose={() => setShowDriverModal(false)}>
        <CModalHeader>Driver Details</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Name"
              name="name"
              value={driver.name}
              onChange={handleDriverChange}
            >
              <option value="">-- Select Name --</option>
              {drivers.map((d, idx) => (
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
          <CButton color="secondary" onClick={() => setShowDriverModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Trip Cost Modal */}
      <CModal visible={showCostModal} onClose={() => setShowCostModal(false)}>
        <CModalHeader>Trip Cost</CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Vehicle Cost:</CFormLabel>
              <CFormInput
                name="vehicleCost"
                type="number"
                value={tripCost.vehicleCost}
                onChange={handleTripCostChange}
                placeholder="Enter vehicle cost"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Adhoc Cost:</CFormLabel>
              <CFormInput
                name="adhocCost"
                type="number"
                value={tripCost.adhocCost}
                onChange={handleTripCostChange}
                placeholder="Enter adhoc cost"
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel>Total Cost:</CFormLabel>
              <CFormInput value={tripCost.totalCost} disabled />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCostModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => setShowCostModal(false)}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}