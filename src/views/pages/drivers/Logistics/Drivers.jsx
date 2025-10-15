import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilSearch } from "@coreui/icons";

export default function Drivers() {
  const navigate = useNavigate();
  // listing
  const [driverData, setDriverData] = useState([]);
  // modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  // currently selected for view/edit
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editDriver, setEditDriver] = useState(null);
  // toast
  const [toast, setToast] = useState({ show: false, title: "", body: "" });
  const toaster = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("drivers") || "[]");
    // dedupe by license
    const unique = stored.filter((d, i, self) =>
      i === self.findIndex((x) => x.license === d.license)
    );
    setDriverData(unique);
    // ensure localStorage has the deduped list
    localStorage.setItem("drivers", JSON.stringify(unique));
  }, []);

  // util: show toast
  const showToast = (title, body) => {
    setToast({ show: true, title, body });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  // open edit modal (modal contains flat form, docs & reviews)
  const openEditModal = (driver, index) => {
    // create deep copy
    const copy = JSON.parse(JSON.stringify(driver));
    // ensure documents exist and are in expected format [{name, dataUrl}]
    copy.documents = copy.documents || [];
    copy.reviews = copy.reviews || [];
    copy._index = index; // store index to know which to update
    setEditDriver(copy);
    setEditModalVisible(true);
  };

  // open view modal
  const openViewModal = (driver) => {
    setSelectedDriver(driver);
    setViewModalVisible(true);
  };

  // remove
  const handleDeleteDriver = (index) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    const updated = driverData.filter((_, i) => i !== index);
    setDriverData(updated);
    localStorage.setItem("drivers", JSON.stringify(updated));
    showToast("Deleted", "Driver deleted successfully.");
  };

  // edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDriver((prev) => ({ ...prev, [name]: value }));
  };

  // add document (reads file as data URL so it can be persisted in localStorage)
  const handleAddDocument = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return alert("Please upload a PDF file.");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      setEditDriver((prev) => ({
        ...prev,
        documents: [...(prev.documents || []), { name: file.name, dataUrl }],
      }));
      showToast("Document added", file.name);
    };
    reader.readAsDataURL(file);
    // reset input value so same file can be added again if needed
    e.target.value = null;
  };

  // download document from dataUrl
  const downloadDocument = (doc) => {
    try {
      const link = document.createElement("a");
      link.href = doc.dataUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Unable to download file.");
    }
  };

  // remove a document from editDriver
  const handleRemoveDocument = (idx) => {
    setEditDriver((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== idx),
    }));
  };

  // reviews
  const handleAddReview = (rating, comment) => {
    if (!rating || !comment || comment.trim() === "") {
      return alert("Please provide rating and comment.");
    }
    setEditDriver((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), { rating: parseInt(rating, 10), comment }],
    }));
    showToast("Review added", "Review has been added.");
  };

  const removeReview = (idx) => {
    setEditDriver((prev) => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== idx) }));
  };

  const calculateAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(2);
  };

  const handleAddDriver = () => {
    navigate("/logistics/adddriver");
  };

  // save edit back to listing + localStorage
  const handleSaveEdit = () => {
    if (!editDriver.name || !editDriver.contact || !editDriver.license) {
      return alert("Please fill required fields (name, contact, license).");
    }

    // license dedupe: allow same license only for same index; otherwise ensure no other driver has same license
    const duplicateIdx = driverData.findIndex(
      (d, i) => d.license === editDriver.license && i !== editDriver._index
    );
    if (duplicateIdx !== -1) {
      return alert("Another driver with same license exists. License must be unique.");
    }

    const updated = [...driverData];
    // Prepare object to persist (no functions, dataUrls ok)
    const toSave = { ...editDriver };
    delete toSave._index;

    updated[editDriver._index] = toSave;
    setDriverData(updated);
    localStorage.setItem("drivers", JSON.stringify(updated));
    setEditModalVisible(false);
    showToast("Updated", "Driver updated successfully!");
  };

  return (
    <div className="p-3">
      <CToaster ref={toaster} placement="top-end">
        {toast.show && (
          <CToast autohide={true} visible={toast.show} delay={3000}>
            <CToastHeader closeButton>{toast.title}</CToastHeader>
            <CToastBody>{toast.body}</CToastBody>
          </CToast>
        )}
      </CToaster>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Driver Listing</h5>
          <CButton color="primary" size="sm" onClick={handleAddDriver}>
            Add Driver
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Driver Type</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell>License Number</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {driverData.length ? (
                driverData.map((driver, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{driver.type}</CTableDataCell>
                    <CTableDataCell>{driver.name}</CTableDataCell>
                    <CTableDataCell>{driver.location}</CTableDataCell>
                    <CTableDataCell>{driver.contact}</CTableDataCell>
                    <CTableDataCell>{driver.license}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={driver.status === "Active" ? "success" : "secondary"}>
                        {driver.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton size="sm" color="info" variant="ghost" className="me-1" onClick={() => openEditModal(driver, idx)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton size="sm" color="success" variant="ghost" className="me-1" onClick={() => openViewModal(driver)}>
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton size="sm" color="danger" variant="ghost" onClick={() => handleDeleteDriver(idx)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center">
                    No drivers found. Click "Add Driver" to add one.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* EDIT MODAL (flat & scrollable) */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editDriver ? (
            <CForm>
              <CRow className="mb-2">
                <CCol md={6}>
                  <CFormInput label="Driver Name" name="name" value={editDriver.name} onChange={handleEditChange} />
                </CCol>
                <CCol md={6}>
                  <CFormSelect label="Driver Type" name="type" value={editDriver.type} onChange={handleEditChange}>
                    <option value="">Select Type</option>
                    <option value="Vendor based">Vendor based</option>
                    <option value="Driver based">Driver based</option>
                    <option value="Own">Own</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-2">
                <CCol md={6}>
                  <CFormInput label="Contact" name="contact" value={editDriver.contact} onChange={handleEditChange} />
                </CCol>
                <CCol md={6}>
                  <CFormSelect label="Languages Known" name="languages" value={editDriver.languages} onChange={handleEditChange}>
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Arabic">Arabic</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-2">
                <CCol md={4}>
                  <CFormInput label="Experience (years)" name="experience" type="number" value={editDriver.experience} onChange={handleEditChange} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Location" name="location" value={editDriver.location} onChange={handleEditChange} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="License Number" name="license" value={editDriver.license} onChange={handleEditChange} />
                </CCol>
              </CRow>

              <CRow className="mb-2">
                <CCol md={6}>
                  <CFormSelect label="Vendor" name="vendor" value={editDriver.vendor} onChange={handleEditChange}>
                    <option value="">Select Vendor</option>
                    {JSON.parse(localStorage.getItem("vendors") || "[]").map((v, i) => (
                      <option key={i} value={v.company}>{v.company}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormSelect label="Status" name="status" value={editDriver.status} onChange={handleEditChange}>
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Documents */}
              <hr />
              <h6>Documents</h6>
              <CRow className="mb-2">
                <CCol md={8}>
                  <input type="file" accept="application/pdf" onChange={handleAddDocument} className="form-control" />
                </CCol>
              </CRow>

              {(editDriver.documents || []).length > 0 && (
                <div className="mb-2">
                  <strong>Uploaded Documents</strong>
                  <ul>
                    {editDriver.documents.map((d, i) => (
                      <li key={i}>
                        {d.name} &nbsp;
                        <CButton size="sm" color="info" onClick={() => downloadDocument(d)}>Download</CButton>
                        &nbsp;
                        <CButton size="sm" color="danger" onClick={() => handleRemoveDocument(i)}>Remove</CButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              <hr />
              <h6>Reviews & Ratings</h6>
              <div className="mb-2">
                <small>Average Rating: {calculateAverageRating(editDriver.reviews)} / 5</small>
              </div>

              <CRow className="mb-2">
                <CCol md={3}>
                  <CFormSelect id="newRating">
                    <option value={0}>Rating</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </CFormSelect>
                </CCol>
                <CCol md={7}>
                  <CFormInput id="newComment" placeholder="Comment" />
                </CCol>
                <CCol md={2}>
                  <CButton
                    onClick={() => {
                      const ratingEl = document.getElementById("newRating");
                      const commentEl = document.getElementById("newComment");
                      const rating = parseInt(ratingEl.value, 10);
                      const comment = commentEl.value;
                      handleAddReview(rating, comment);
                      commentEl.value = "";
                      ratingEl.value = 0;
                    }}
                  >
                    Add Review
                  </CButton>
                </CCol>
              </CRow>

              {(editDriver.reviews || []).length > 0 && (
                <div>
                  {editDriver.reviews.map((r, i) => (
                    <div key={i} className="d-flex align-items-center mb-2">
                      <div style={{ minWidth: 120 }}><strong>{'★'.repeat(r.rating)}</strong></div>
                      <div style={{ flex: 1 }}>{r.comment}</div>
                      <div>
                        <CButton size="sm" color="danger" onClick={() => removeReview(i)}>Remove</CButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </CForm>
          ) : (
            <p>Loading...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveEdit}>Save Changes</CButton>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>

      {/* VIEW MODAL (read-only) */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Driver Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDriver ? (
            <div>
              <p><strong>Name:</strong> {selectedDriver.name}</p>
              <p><strong>Type:</strong> {selectedDriver.type}</p>
              <p><strong>Contact:</strong> {selectedDriver.contact}</p>
              <p><strong>Languages:</strong> {selectedDriver.languages}</p>
              <p><strong>Experience:</strong> {selectedDriver.experience}</p>
              <p><strong>Location:</strong> {selectedDriver.location}</p>
              <p><strong>License:</strong> {selectedDriver.license}</p>
              <p><strong>Vendor:</strong> {selectedDriver.vendor}</p>
              <p><strong>Status:</strong> <CBadge color={selectedDriver.status === "Active" ? "success" : "secondary"}>{selectedDriver.status}</CBadge></p>

              <hr />
              <h6>Documents</h6>
              {(selectedDriver.documents || []).length === 0 ? (
                <p>No documents</p>
              ) : (
                <ul>
                  {(selectedDriver.documents || []).map((d, i) => (
                    <li key={i}>
                      {d.name} &nbsp;
                      <CButton size="sm" color="info" onClick={() => {
                        // download from dataUrl
                        const link = document.createElement('a');
                        link.href = d.dataUrl;
                        link.download = d.name;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}>
                        Download
                      </CButton>
                    </li>
                  ))}
                </ul>
              )}

              <hr />
              <h6>Reviews</h6>
              {(selectedDriver.reviews || []).length === 0 ? (
                <p>No reviews</p>
              ) : (
                <div>
                  <p><strong>Average:</strong> {calculateAverageRating(selectedDriver.reviews)} / 5</p>
                  {selectedDriver.reviews.map((r, i) => (
                    <div key={i} className="mb-2">{'★'.repeat(r.rating)} — {r.comment}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>No driver selected.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
