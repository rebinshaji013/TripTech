import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from "@coreui/react";

export default function DriverDetails() {
  const navigate = useNavigate();

  const [driver, setDriver] = useState({
    name: "",
    type: "",
    contact: "",
    languages: "",
    experience: "",
    location: "",
    license: "",
    vendor: "",
    status: "Inactive",
  });

  const [vendors, setVendors] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [driverAdded, setDriverAdded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load vendors from localStorage
  useEffect(() => {
    const storedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(storedVendors);
  }, []);

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleAddDocument = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setDocuments([...documents, { name: file.name, file }]);
      alert("Document added successfully!");
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const downloadDocument = (file) => {
    if (!(file instanceof Blob)) return alert("Invalid file.");
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim() !== "") {
      setReviews([...reviews, newReview]);
      setNewReview({ rating: 0, comment: "" });
    } else {
      alert("Please enter both rating and comment.");
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(2);
  };

  const handleSaveDriver = () => {
    if (!driver.name || !driver.contact || !driver.type) {
      alert("Please fill out required driver details.");
      return;
    }

    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const newDriver = { ...driver, documents, reviews };
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, newDriver]));

    setDriverAdded(true);
    alert("Driver details added successfully!");
  };

  const handleSaveAll = () => {
    if (!driverAdded) return alert("Please add driver details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");
    setShowFeedback(true);
  };

  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    const allDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const lastDriverIndex = allDrivers.length - 1;

    if (lastDriverIndex >= 0) {
      allDrivers[lastDriverIndex].status = updatedStatus;
      localStorage.setItem("drivers", JSON.stringify(allDrivers));
    }

    setShowFeedback(false);
    navigate("/logistics/drivers");
  };

  return (
    <div className="p-3">
      <CCard>
        <CCardBody>
          <h5 className="mb-3">Driver Management</h5>

          {/* Accordion Section */}
          <CAccordion alwaysOpen>

            {/* 1️⃣ Add Driver */}
            <CAccordionItem itemKey="1">
              <CAccordionHeader>Add / Update Driver</CAccordionHeader>
              <CAccordionBody>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      label="Driver Name"
                      name="name"
                      value={driver.name}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect
                      label="Driver Type"
                      name="type"
                      value={driver.type}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Vendor based">Vendor based</option>
                      <option value="Driver based">Driver based</option>
                      <option value="Own">Own</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      label="Contact"
                      name="contact"
                      value={driver.contact}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect
                      label="Languages Known"
                      name="languages"
                      value={driver.languages}
                      onChange={handleChange}
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Arabic">Arabic</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormInput
                      label="Experience (years)"
                      name="experience"
                      type="number"
                      value={driver.experience}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      label="Location"
                      name="location"
                      value={driver.location}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      label="License Number"
                      name="license"
                      value={driver.license}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                {/* Vendor Selection */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    {vendors.length > 0 ? (
                      <CFormSelect
                        label="Select Vendor"
                        name="vendor"
                        value={driver.vendor}
                        onChange={handleChange}
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map((v, idx) => (
                          <option key={idx} value={v.company}>
                            {v.company}
                          </option>
                        ))}
                      </CFormSelect>
                    ) : (
                      <p>No vendors found. Please add vendors first in Vendor Management.</p>
                    )}
                  </CCol>
                </CRow>

                <div className="text-end">
                  <CButton color="primary" onClick={handleSaveDriver}>
                    Save Driver
                  </CButton>
                </div>
              </CAccordionBody>
            </CAccordionItem>

            {/* 2️⃣ Show Driver Details if added */}
            {driverAdded && (
              <CAccordionItem itemKey="2">
                <CAccordionHeader>Driver Details Summary</CAccordionHeader>
                <CAccordionBody>
                  <CTable bordered striped>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Name</CTableDataCell>
                        <CTableDataCell>{driver.name}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Type</CTableDataCell>
                        <CTableDataCell>{driver.type}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Contact</CTableDataCell>
                        <CTableDataCell>{driver.contact}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Experience</CTableDataCell>
                        <CTableDataCell>{driver.experience} years</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>License</CTableDataCell>
                        <CTableDataCell>{driver.license}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Vendor</CTableDataCell>
                        <CTableDataCell>{driver.vendor || "-"}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Status</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={driver.status === "Active" ? "success" : "secondary"}>
                            {driver.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CAccordionBody>
              </CAccordionItem>
            )}

            {/* 3️⃣ Documents Section (only if document added) */}
            {driverAdded && (
              <CAccordionItem itemKey="3">
                <CAccordionHeader>Documents</CAccordionHeader>
                <CAccordionBody>
                  <CFormInput
                    type="file"
                    accept="application/pdf"
                    onChange={handleAddDocument}
                  />
                  {documents.length > 0 && (
                    <ul className="mt-3">
                      {documents.map((doc, idx) => (
                        <li key={idx}>
                          {doc.name}{" "}
                          <CButton
                            size="sm"
                            color="info"
                            onClick={() => downloadDocument(doc.file)}
                          >
                            Download
                          </CButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            )}

            {/* 4️⃣ Reviews Section (only if added) */}
            {driverAdded && (
              <CAccordionItem itemKey="4">
                <CAccordionHeader>Reviews & Ratings</CAccordionHeader>
                <CAccordionBody>
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormSelect
                        label="Rating"
                        value={newReview.rating}
                        onChange={(e) =>
                          setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                        }
                      >
                        <option value={0}>Select Rating</option>
                        <option value={1}>1 ★</option>
                        <option value={2}>2 ★★</option>
                        <option value={3}>3 ★★★</option>
                        <option value={4}>4 ★★★★</option>
                        <option value={5}>5 ★★★★★</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={9}>
                      <CFormInput
                        label="Comment"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({ ...newReview, comment: e.target.value })
                        }
                      />
                    </CCol>
                  </CRow>
                  <CButton color="primary" onClick={handleAddReview}>
                    Add Review
                  </CButton>

                  {reviews.length > 0 && (
                    <>
                      <p className="mt-3">
                        <strong>Average Rating:</strong> {calculateAverageRating()} / 5
                      </p>
                      {reviews.map((r, idx) => (
                        <div key={idx} className="mb-2">
                          <CBadge color="warning">{'★'.repeat(r.rating)}</CBadge> {r.comment}
                        </div>
                      ))}
                    </>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            )}
          </CAccordion>

          {/* Save All Button */}
          {driverAdded && (
            <div className="text-center mt-4">
              <CButton color="success" size="lg" onClick={handleSaveAll}>
                Save All
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Feedback Modal */}
      <CModal visible={showFeedback} onClose={() => setShowFeedback(false)}>
        <CModalHeader>
          <CModalTitle>Driver Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Driver created successfully. Do you want to activate the created driver?
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
