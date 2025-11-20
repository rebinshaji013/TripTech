import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge,
} from "@coreui/react";

export default function VendorDetails() {
  const navigate = useNavigate();

  const [vendor, setVendor] = useState({
    company: "",
    contact: "",
    type: "",
    email: "",
    mobile: "",
    address: "",
    location: "",
    country: "",
    status: "Inactive",
  });

  const [vendorAdded, setVendorAdded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleClass: "",
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    status: "Active"
  });

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

  // Handle input change
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  // Handle vehicle input change
  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "brand") {
      setNewVehicle(prev => ({ 
        ...prev, 
        brand: value,
        model: "" // Reset model when brand changes
      }));
    } else {
      setNewVehicle(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle vendor save
  const handleVendorSave = () => {
    const existingVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const vendorWithVehicles = { ...vendor, vehicles: vehicles };
    localStorage.setItem("vendors", JSON.stringify([...existingVendors, vendorWithVehicles]));
    setVendorAdded(true);
    alert("Vendor details added successfully!");
  };

  // Handle document upload
  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file || file.type !== "application/pdf")
      return alert("Please upload a PDF file.");
    setDocuments((prev) => [...prev, { name: file.name, file }]);
    setShowDocModal(false);
  };

  // Handle vehicle add
  const handleVehicleAdd = (e) => {
    e.preventDefault();
    if (!newVehicle.vehicleClass || !newVehicle.brand || !newVehicle.model) {
      alert("Please fill in all required vehicle fields.");
      return;
    }

    const vehicleWithId = {
      ...newVehicle,
      id: Date.now().toString(),
      vendorCompany: vendor.company
    };

    setVehicles(prev => [...prev, vehicleWithId]);
    setNewVehicle({
      vehicleClass: "",
      brand: "",
      model: "",
      year: "",
      licensePlate: "",
      status: "Active"
    });
    setShowVehicleModal(false);
    alert("Vehicle added successfully!");
  };

  // Remove vehicle
  const handleRemoveVehicle = (vehicleId) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?")) return;
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
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

  // Save all vendor data
  const handleSaveAll = () => {
    if (!vendorAdded) return alert("Please add vendor details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");

    const existingVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    
    // Update vendor with vehicles
    const updatedVendors = existingVendors.map(v => 
      v.company === vendor.company ? { ...v, vehicles: vehicles } : v
    );
    
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));
    setShowFeedback(true);
  };

  // Handle activation modal response
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setVendor((prev) => ({ ...prev, status: updatedStatus }));

    const allVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const lastVendorIndex = allVendors.length - 1;
    if (lastVendorIndex >= 0) {
      allVendors[lastVendorIndex].status = updatedStatus;
      localStorage.setItem("vendors", JSON.stringify(allVendors));
    }

    setShowFeedback(false);
    navigate("/logistics/vendors");
  };

  return (
    <div className="p-3">
      {/* Vehicle Count Badge */}
      {vendorAdded && (
        <div className="mb-3">
          <CBadge color="info" className="fs-6 p-2">
            Total Vehicles: {vehicles.length}
          </CBadge>
        </div>
      )}

      <CCard className="mb-3 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vendor Details</h5>
        </CCardHeader>
        <CCardBody>

          {/* Accordion Section for Add Vendor */}
          <CAccordion alwaysOpen className="mb-3">
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Add Vendor</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CFormInput
                    label="Company Name"
                    name="company"
                    value={vendor.company}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Company Contact"
                    name="contact"
                    value={vendor.contact}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormSelect
                    label="Company Type"
                    name="type"
                    value={vendor.type}
                    onChange={handleVendorChange}
                    className="mb-2"
                  >
                    <option value="">Select Company Type</option>
                    <option value="Event company">Event company</option>
                    <option value="Travel Agency">Travel Agency</option>
                    <option value="Direct Client">Direct Client</option>
                  </CFormSelect>
                  <CFormInput
                    label="Email"
                    name="email"
                    value={vendor.email}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Mobile Number"
                    name="mobile"
                    value={vendor.mobile}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Address"
                    name="address"
                    value={vendor.address}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Location"
                    name="location"
                    value={vendor.location}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Country"
                    name="country"
                    value={vendor.country}
                    onChange={handleVendorChange}
                    className="mb-2"
                  />
                  <div className="text-center">
                    <CButton color="primary" onClick={handleVendorSave}>
                      Save Vendor
                    </CButton>
                  </div>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>

          {/* Vendor Details Section — shown only if added */}
          {vendorAdded && (
            <CCard className="mb-3">
              <CCardHeader><strong>Vendor Details</strong></CCardHeader>
              <CCardBody>
                <CTable bordered striped>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Company Name</CTableDataCell>
                      <CTableDataCell>{vendor.company || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Company Contact</CTableDataCell>
                      <CTableDataCell>{vendor.contact || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Company Type</CTableDataCell>
                      <CTableDataCell>{vendor.type || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Email</CTableDataCell>
                      <CTableDataCell>{vendor.email || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Mobile Number</CTableDataCell>
                      <CTableDataCell>{vendor.mobile || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Address</CTableDataCell>
                      <CTableDataCell>{vendor.address || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Location</CTableDataCell>
                      <CTableDataCell>{vendor.location || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Country</CTableDataCell>
                      <CTableDataCell>{vendor.country || "-"}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Status</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vendor.status === "Active" ? "success" : "secondary"}>
                          {vendor.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {/* Vehicles Section — shown only when vendor added */}
          {vendorAdded && (
            <CCard className="mb-3">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Vendor Vehicles</strong>
                <CButton color="primary" size="sm" onClick={() => setShowVehicleModal(true)}>
                  Add Vehicle
                </CButton>
              </CCardHeader>
              <CCardBody>
                {vehicles.length > 0 ? (
                  <CTable bordered striped>
                    <CTableBody>
                      {vehicles.map((vehicle, idx) => (
                        <CTableRow key={vehicle.id}>
                          <CTableDataCell>{vehicle.vehicleClass}</CTableDataCell>
                          <CTableDataCell>{vehicle.brand}</CTableDataCell>
                          <CTableDataCell>{vehicle.model}</CTableDataCell>
                          <CTableDataCell>{vehicle.year}</CTableDataCell>
                          <CTableDataCell>{vehicle.licensePlate || "-"}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={vehicle.status === "Active" ? "success" : "secondary"}>
                              {vehicle.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="danger"
                              variant="outline"
                              onClick={() => handleRemoveVehicle(vehicle.id)}
                            >
                              Remove
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p className="text-muted">No vehicles added yet. Click "Add Vehicle" to add vehicles.</p>
                )}
              </CCardBody>
            </CCard>
          )}

          {/* Documents Section — shown only when vendor added */}
          {vendorAdded && (
            <CCard className="mb-3">
              <CCardHeader><strong>Documents</strong></CCardHeader>
              <CCardBody>
                {documents.length > 0 ? (
                  <CTable bordered striped>
                    <CTableBody>
                      {documents.map((doc, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{doc.name}</CTableDataCell>
                          <CTableDataCell>
                            {doc.file && (
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => downloadDocument(doc.file)}
                              >
                                Download
                              </CButton>
                            )}
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
              </CCardBody>
            </CCard>
          )}

          {vendorAdded && (
            <div className="text-center">
              <CButton color="success" size="lg" onClick={handleSaveAll}>
                Save All
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Add Vehicle Modal */}
      <CModal visible={showVehicleModal} onClose={() => setShowVehicleModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Vehicle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleVehicleAdd}>
            <CFormSelect
              label="Vehicle Class *"
              name="vehicleClass"
              value={newVehicle.vehicleClass}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Vehicle Class</option>
              {vehicleClassOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Brand Name *"
              name="brand"
              value={newVehicle.brand}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Brand</option>
              {brandOptions.map((brand, idx) => (
                <option key={idx} value={brand}>{brand}</option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Model Name *"
              name="model"
              value={newVehicle.model}
              onChange={handleVehicleChange}
              className="mb-2"
              disabled={!newVehicle.brand}
            >
              <option value="">Select Model</option>
              {newVehicle.brand && modelOptions[newVehicle.brand]?.map((model, idx) => (
                <option key={idx} value={model}>{model}</option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Year"
              name="year"
              value={newVehicle.year}
              onChange={handleVehicleChange}
              className="mb-2"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </CFormSelect>

            <CFormInput
              label="License Plate"
              name="licensePlate"
              value={newVehicle.licensePlate}
              onChange={handleVehicleChange}
              className="mb-3"
              placeholder="e.g., ABC-1234"
            />

            <CModalFooter>
              <CButton color="primary" type="submit">
                Add Vehicle
              </CButton>
              <CButton color="secondary" type="button" onClick={() => setShowVehicleModal(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>

      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>Add Document</CModalHeader>
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
          <CModalTitle>Vendor Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Vendor created successfully. Do you want to activate the created vendor?
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