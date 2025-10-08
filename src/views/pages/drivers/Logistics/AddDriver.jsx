import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from "@coreui/react";

export default function DriverDetails() {
  const navigate = useNavigate();

  const [basicDetails, setBasicDetails] = useState({
    name: "",
    type: "",
    contact: "",
    languages: "",
    experience: "",
    location: "",
    license: "",
    status: "",
  });

  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState([
  ]);

  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  // --- Handlers ---
  const handleBasicChange = (e) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };

  const handleSaveBasic = () => {
    const existing = JSON.parse(localStorage.getItem("drivers") || "[]");
    localStorage.setItem("drivers", JSON.stringify([...existing, basicDetails]));
    setShowBasicModal(false);
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (file && file.type === "application/pdf") {
      setDocuments([...documents, { name: file.name, file }]);
      setShowDocModal(false);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const downloadDocument = (file) => {
    if (!file) return alert("No file to download");
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAll = () => {
    const existingDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    localStorage.setItem("drivers", JSON.stringify([...existingDrivers, basicDetails]));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));
    localStorage.setItem("reviews", JSON.stringify(reviews));
    navigate("/logistics/drivers");
  };

  const handleAddReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim() !== "") {
      setReviews([...reviews, newReview]);
      setNewReview({ rating: 0, comment: "" });
      setShowReviewModal(false);
    } else {
      alert("Please enter rating and comment.");
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(2);
  };

  return (
    <div className="p-3">
      <CCard className="mb-4">
        <CCardHeader>
          <h5>Driver Details</h5>
        </CCardHeader>
        <CCardBody>
          {/* Basic Details */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Basic Details</strong>
              <CButton color="primary" size="sm" className="float-end" onClick={() => setShowBasicModal(true)}>
                Add / Update
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-2">
                <CCol md={4}><strong>Name:</strong> {basicDetails.name || "-"}</CCol>
                <CCol md={4}><strong>Type:</strong> {basicDetails.type || "-"}</CCol>
                <CCol md={4}><strong>Contact:</strong> {basicDetails.contact || "-"}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>Languages:</strong> {basicDetails.languages || "-"}</CCol>
                <CCol md={4}><strong>Experience:</strong> {basicDetails.experience || "-"}</CCol>
                <CCol md={4}><strong>Location:</strong> {basicDetails.location || "-"}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={4}><strong>License:</strong> {basicDetails.license || "-"}</CCol>
                <CCol md={4}><strong>Status:</strong> 
                  {basicDetails.status ? (
                    <CBadge color={basicDetails.status === "Active" ? "success" : "secondary"}>
                      {basicDetails.status}
                    </CBadge>
                  ) : "-"}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Reviews & Ratings */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Reviews & Ratings</strong>
              <CButton color="primary" size="sm" className="float-end" onClick={() => setShowReviewModal(true)}>
                Add Review
              </CButton>
            </CCardHeader>
            <CCardBody>
              <p><strong>Average Rating:</strong> {calculateAverageRating()} / 5</p>
              {reviews.map((rev, idx) => (
                <CRow key={idx} className="mb-2 align-items-center">
                  <CCol md={2}>
                    <CBadge color="warning">{'★'.repeat(rev.rating)}</CBadge>
                  </CCol>
                  <CCol md={10}>{rev.comment}</CCol>
                </CRow>
              ))}
            </CCardBody>
          </CCard>

          {/* Documents Section */}
          <CCard className="mb-3">
            <CCardHeader>
            <strong>Documents</strong>
              <CButton color="primary" size="sm" className="float-end" onClick={() => setShowDocModal(true)}>
                Add Document
              </CButton>
            </CCardHeader>
            <CCardBody>
              {documents.length > 0 ? (
                <ul>
                  {documents.map((doc, idx) => (
                    <li key={idx} className="mb-1">
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => downloadDocument(doc.file)}
                      >
                        {doc.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents uploaded</p>
              )}
            </CCardBody>
          </CCard>

          {/* Save Button */}
          <div className="text-center mt-3">
            <CButton color="success" onClick={handleSaveAll}>Save Driver</CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal: Basic Details */}
      <CModal visible={showBasicModal} onClose={() => setShowBasicModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Basic Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput label="Driver Name" name="name" value={basicDetails.name} onChange={handleBasicChange} />
            </CCol>
            <CCol md={6}>
              <CFormSelect label="Driver Type" name="type" value={basicDetails.type} onChange={handleBasicChange}>
                <option value="">Select Type</option>
                <option value="Vendor based">Vendor based</option>
                <option value="Driver based">Driver based</option>
                <option value="Own">Own</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput label="Contact" name="contact" value={basicDetails.contact} onChange={handleBasicChange} />
            </CCol>
            <CCol md={6}>
              <CFormSelect label="Languages Known" name="languages" value={basicDetails.languages} onChange={handleBasicChange}>
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic">Arabic</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput label="Experience" name="experience" type="number" value={basicDetails.experience} onChange={handleBasicChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput label="Location" name="location" value={basicDetails.location} onChange={handleBasicChange} />
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput label="License Number" name="license" value={basicDetails.license} onChange={handleBasicChange} />
            </CCol>
            <CCol md={6}>
              <CFormSelect label="Status" name="status" value={basicDetails.status} onChange={handleBasicChange}>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowBasicModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveBasic}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal: Add Review */}
      <CModal visible={showReviewModal} onClose={() => setShowReviewModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Review</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-2">
            <CCol md={4}>
              <CFormSelect label="Rating" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}>
                <option value={0}>Select Rating</option>
                <option value={1}>1 ★</option>
                <option value={2}>2 ★★</option>
                <option value={3}>3 ★★★</option>
                <option value={4}>4 ★★★★</option>
                <option value={5}>5 ★★★★★</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                label="Comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowReviewModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddReview}>Add</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Document Upload */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Document</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleAddDocument}>
            <CFormInput type="file" name="file" accept="application/pdf" />
            <div className="mt-3 text-end">
              <CButton color="secondary" className="me-2" onClick={() => setShowDocModal(false)}>Cancel</CButton>
              <CButton color="primary" type="submit">Add</CButton>
            </div>
          </form>
        </CModalBody>
      </CModal>
    </div>
  );
}
