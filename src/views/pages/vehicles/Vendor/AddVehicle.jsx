import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge,
} from "@coreui/react";

export default function VendorVehicleDetails() {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleClass: "",
    brand: "",
    model: "",
    year: "",
    vehicleSeating: "",
    licensePlate: "",
    registrationExpiry: "",
    assignedDriver: "",
    status: "Inactive",
  });

  const [vehicleAdded, setVehicleAdded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [drivers, setDrivers] = useState([]);

  // Vehicle options
  const vehicleClassOptions = ["Standard", "Luxury", "Premium"];
  
  const brandOptions = [
    "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", 
    "Audi", "Hyundai", "Kia", "Nissan", "Volkswagen",
    "Chevrolet", "Mazda", "Lexus", "Volvo", "Jeep"
  ];

  const modelOptions = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Hilux", "Innova"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "City", "Amaze"],
    "Ford": ["F-150", "Explorer", "Escape", "Mustang", "Focus", "Endeavour"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "A-Class"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Creta", "i20", "Verna"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Sorento", "Rio", "Carens"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail", "Magnite"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Jetta", "Polo", "Virtus"],
    "Chevrolet": ["Malibu", "Equinox", "Tahoe", "Spark", "Trax", "Trailblazer"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "CX-3"],
    "Lexus": ["ES", "RX", "NX", "LS", "UX", "LX"],
    "Volvo": ["XC60", "XC90", "S60", "S90", "XC40", "V90"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Compass", "Renegade", "Cherokee", "Meridian"]
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => (2025 - i).toString());
  const seatingOptions = ["3 Seater", "4 Seater", "5 Seater", "6 Seater", "7 Seater", "8 Seater"];

  // Load drivers from localStorage
  useEffect(() => {
    const driverList = JSON.parse(localStorage.getItem("drivers") || "[]");
    setDrivers(driverList);
  }, []);

  // Handle Vehicle Form Change
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset model when brand changes
    if (name === "brand") {
      setVehicle(prev => ({ 
        ...prev, 
        brand: value,
        model: "" 
      }));
    } else {
      setVehicle(prev => ({ ...prev, [name]: value }));
    }
  };

  // Check registration expiry for notification
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { color: "danger", message: "EXPIRED" };
    } else if (diffDays <= 30) {
      return { color: "warning", message: "EXPIRING SOON" };
    } else {
      return { color: "success", message: "VALID" };
    }
  };

  // Save Vehicle Details
  const handleVehicleSave = () => {
    if (!vehicle.vehicleClass || !vehicle.brand || !vehicle.model) {
      alert("Please fill in all required fields: Vehicle Class, Brand Name, and Model Name");
      return;
    }

    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    localStorage.setItem("vehicles", JSON.stringify([...existingVehicles, vehicle]));
    setVehicleAdded(true);
    alert("Vehicle details added successfully!");
  };

  // Add Document
  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file || file.type !== "application/pdf")
      return alert("Please upload a PDF file.");
    setDocuments((prev) => [...prev, { name: file.name, file }]);
    setShowDocModal(false);
  };

  // Download PDF
  const downloadDocument = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save All Data
  const handleSaveAll = () => {
    if (!vehicleAdded) return alert("Please add vehicle details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");

    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    setShowFeedback(true);
  };

  // Activation Decision
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setVehicle((prev) => ({ ...prev, status: updatedStatus }));

    const allVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const lastVehicleIndex = allVehicles.length - 1;
    if (lastVehicleIndex >= 0) {
      allVehicles[lastVehicleIndex].status = updatedStatus;
      localStorage.setItem("vehicles", JSON.stringify(allVehicles));
    }

    // Reset after save
    setShowFeedback(false);
    setVehicle({
      vehicleClass: "",
      brand: "",
      model: "",
      year: "",
      vehicleSeating: "",
      licensePlate: "",
      registrationExpiry: "",
      assignedDriver: "",
      status: "Inactive",
    });
    setDocuments([]);
    setVehicleAdded(false);

    navigate("/vendor/vehicles");
  };

  const expiryStatus = getExpiryStatus(vehicle.registrationExpiry);

  return (
    <div className="p-3">
      <CCard className="mb-3 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vehicle Details</h5>
        </CCardHeader>
        <CCardBody>
          <CAccordion alwaysOpen>
            {/* Section 1 — Add / Update Vehicle */}
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Add / Update Vehicle</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  {/* Vehicle Class */}
                  <CFormSelect
                    label="Vehicle Class *"
                    name="vehicleClass"
                    value={vehicle.vehicleClass}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  >
                    <option value="">Select Vehicle Class</option>
                    {vehicleClassOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </CFormSelect>

                  {/* Brand Name */}
                  <CFormSelect
                    label="Brand Name *"
                    name="brand"
                    value={vehicle.brand}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  >
                    <option value="">Select Brand</option>
                    {brandOptions.map((brand, idx) => (
                      <option key={idx} value={brand}>{brand}</option>
                    ))}
                  </CFormSelect>

                  {/* Model Name */}
                  <CFormSelect
                    label="Model Name *"
                    name="model"
                    value={vehicle.model}
                    onChange={handleVehicleChange}
                    className="mb-2"
                    disabled={!vehicle.brand}
                  >
                    <option value="">Select Model</option>
                    {vehicle.brand && modelOptions[vehicle.brand]?.map((model, idx) => (
                      <option key={idx} value={model}>{model}</option>
                    ))}
                  </CFormSelect>

                  {/* Year */}
                  <CFormSelect
                    label="Year"
                    name="year"
                    value={vehicle.year}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year, idx) => (
                      <option key={idx} value={year}>{year}</option>
                    ))}
                  </CFormSelect>

                  {/* Vehicle Seating */}
                  <CFormSelect
                    label="Vehicle Seating"
                    name="vehicleSeating"
                    value={vehicle.vehicleSeating}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  >
                    <option value="">Select Seating</option>
                    {seatingOptions.map((seating, idx) => (
                      <option key={idx} value={seating}>{seating}</option>
                    ))}
                  </CFormSelect>

                  {/* License Plate Number */}
                  <CFormInput
                    label="License Plate Number"
                    name="licensePlate"
                    value={vehicle.licensePlate}
                    onChange={handleVehicleChange}
                    className="mb-2"
                    placeholder="e.g., ABC-1234"
                  />

                  {/* Registration Expiry Date */}
                  <CFormInput
                    label="Registration Expiry Date"
                    name="registrationExpiry"
                    type="date"
                    value={vehicle.registrationExpiry}
                    onChange={handleVehicleChange}
                    className="mb-2"
                  />
                  {expiryStatus && (
                    <CBadge color={expiryStatus.color} className="mb-3">
                      {expiryStatus.message}
                    </CBadge>
                  )}

                  {/* Assign Driver */}
                  <CFormSelect
                    label="Assign Driver"
                    name="assignedDriver"
                    value={vehicle.assignedDriver}
                    onChange={handleVehicleChange}
                    className="mb-3"
                  >
                    <option value="">Select Driver</option>
                    {drivers.length > 0 ? (
                      drivers.map((driver, idx) => (
                        <option key={idx} value={driver.name}>
                          {driver.name} - {driver.licenseNumber || "No License"}
                        </option>
                      ))
                    ) : (
                      <option disabled>No drivers available</option>
                    )}
                  </CFormSelect>

                  <div className="text-center">
                    <CButton color="primary" onClick={handleVehicleSave}>
                      Save Vehicle
                    </CButton>
                  </div>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>

            {/* Section 2 — Documents */}
            {vehicleAdded && (
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>Documents</CAccordionHeader>
                <CAccordionBody>
                  {documents.length > 0 ? (
                    <CTable bordered striped>
                      <CTableBody>
                        {documents.map((doc, idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>{doc.name}</CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => downloadDocument(doc.file)}
                              >
                                Download
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  ) : (
                    <p>No documents uploaded yet.</p>
                  )}
                  <CButton color="primary" className="mt-2" onClick={() => setShowDocModal(true)}>
                    Add Document
                  </CButton>
                </CAccordionBody>
              </CAccordionItem>
            )}

            {/* Section 3 — Vehicle Summary */}
            {vehicleAdded && (
              <CAccordionItem itemKey={3}>
                <CAccordionHeader>Vehicle Details Summary</CAccordionHeader>
                <CAccordionBody>
                  <CTable bordered striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Vehicle Class</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleClass || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Brand Name</CTableDataCell>
                        <CTableDataCell>{vehicle.brand || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Model Name</CTableDataCell>
                        <CTableDataCell>{vehicle.model || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Year</CTableDataCell>
                        <CTableDataCell>{vehicle.year || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Vehicle Seating</CTableDataCell>
                        <CTableDataCell>{vehicle.vehicleSeating || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>License Plate</CTableDataCell>
                        <CTableDataCell>{vehicle.licensePlate || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Registration Expiry</CTableDataCell>
                        <CTableDataCell>
                          {vehicle.registrationExpiry || "-"}
                          {expiryStatus && (
                            <CBadge color={expiryStatus.color} className="ms-2">
                              {expiryStatus.message}
                            </CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Assigned Driver</CTableDataCell>
                        <CTableDataCell>{vehicle.assignedDriver || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Status</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={vehicle.status === "Active" ? "success" : "secondary"}>
                            {vehicle.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                  <div className="text-center mt-3">
                    <CButton color="success" size="lg" onClick={handleSaveAll}>
                      Save All
                    </CButton>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            )}
          </CAccordion>
        </CCardBody>
      </CCard>

      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Document</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleDocumentAdd}>
            <input type="file" name="file" accept="application/pdf" className="form-control" />
            <CModalFooter>
              <CButton color="primary" type="submit">
                Add
              </CButton>
              <CButton color="secondary" type="button" onClick={() => setShowDocModal(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>

      {/* Feedback Modal */}
      <CModal visible={showFeedback} onClose={() => setShowFeedback(false)}>
        <CModalHeader>
          <CModalTitle>Vehicle Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Vehicle created successfully. Do you want to activate the created vehicle?
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleActivationDecision(true)}>
            Yes
          </CButton>
          <CButton color="danger" onClick={() => handleActivationDecision(false)}>
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}