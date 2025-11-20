import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody,
  CForm, CFormInput, CFormSelect,
  CButton, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge, CListGroup, CListGroupItem
} from "@coreui/react";

export default function OwnerDetails() {
  const navigate = useNavigate();

  // Owner State
  const [owner, setOwner] = useState({
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

  // Modals
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [ownerAdded, setOwnerAdded] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Dynamic Booking History
  const [bookingHistory, setBookingHistory] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwner((prev) => ({ ...prev, [name]: value }));
  };

  // Save Owner to LocalStorage (trigger feedback modal)
  const handleSaveOwner = () => {
    const existingOwners = JSON.parse(localStorage.getItem("owners") || "[]");
    const updatedOwner = { ...owner };
    localStorage.setItem("owners", JSON.stringify([...existingOwners, updatedOwner]));
    setOwnerAdded(true); 
    alert("Trip Owner details added successfully!");
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
    if (!ownerAdded) return alert("Please add trip owner details first.");
    if (documents.length === 0) return alert("Please upload at least one document.");
  
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));
    setShowFeedback(true);
  };
  
  // Handle activation decision
  const handleActivationDecision = (activate) => {
    const updatedStatus = activate ? "Active" : "Inactive";
    setOwner((prev) => ({ ...prev, status: updatedStatus }));

    // Update the owner in localStorage with the new status
    const allOwners = JSON.parse(localStorage.getItem("owners") || "[]");
    const lastOwnerIndex = allOwners.length - 1;
    if (lastOwnerIndex >= 0) {
      allOwners[lastOwnerIndex].status = updatedStatus;
      localStorage.setItem("owners", JSON.stringify(allOwners));
    }

    setShowFeedback(false);
    navigate("/logistics/owners");
  };

  // Load Bookings dynamically
  useEffect(() => {
    const sampleBookings = [
      { tripId: "2003239008890", status: "Done", ownerCompany: "LogiTrans Pvt Ltd" },
      { tripId: "2003239008891", status: "Draft", ownerCompany: "TransAsia" },
      { tripId: "2003239008892", status: "Completed", ownerCompany: "LogiTrans Pvt Ltd" },
      { tripId: "2003239008893", status: "Cancelled", ownerCompany: "FastGo Logistics" },
    ];

    if (!localStorage.getItem("bookings")) {
      localStorage.setItem("bookings", JSON.stringify(sampleBookings));
    }

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const filtered = allBookings.filter(
      (b) =>
        b.ownerCompany.toLowerCase() === owner.company.toLowerCase() ||
        b.ownerCompany.toLowerCase() === owner.contact.toLowerCase()
    );
    setBookingHistory(filtered);
  }, [owner.company, owner.contact]);

  const hasBookings = bookingHistory && bookingHistory.length > 0;

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Owner Details</h5>
        </CCardHeader>

        <CCardBody>
          {/* Accordion Section for Add Trip Owner */}
          <CAccordion alwaysOpen className="mb-3">
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Add Trip Owner</CAccordionHeader>
              <CAccordionBody>
                <CForm>
                  <CFormInput
                    label="Company Name"
                    name="company"
                    value={owner.company}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Company Contact"
                    name="contact"
                    value={owner.contact}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormSelect
                    label="Company Type"
                    name="type"
                    value={owner.type}
                    onChange={handleChange}
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
                    value={owner.email}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Mobile Number"
                    name="mobile"
                    value={owner.mobile}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Address"
                    name="address"
                    value={owner.address}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Location"
                    name="location"
                    value={owner.location}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormInput
                    label="Country"
                    name="country"
                    value={owner.country}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <div className="text-center">
                    <CButton color="primary" onClick={handleSaveOwner}>
                      Save Trip Owner
                    </CButton>
                  </div>
                </CForm>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>

          {/* Trip Owner Details */}
          {ownerAdded && (
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Trip Owner Information</strong>
            </CCardHeader>
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Company Name</CTableDataCell>
                    <CTableDataCell>{owner.company || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Company Contact</CTableDataCell>
                    <CTableDataCell>{owner.contact || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Company Type</CTableDataCell>
                    <CTableDataCell>{owner.type || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Email</CTableDataCell>
                    <CTableDataCell>{owner.email || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Mobile</CTableDataCell>
                    <CTableDataCell>{owner.mobile || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Address</CTableDataCell>
                    <CTableDataCell>{owner.address || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Location</CTableDataCell>
                    <CTableDataCell>{owner.location || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Country</CTableDataCell>
                    <CTableDataCell>{owner.country || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={owner.status === "Active" ? "success" : "secondary"}>
                        {owner.status}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <CButton color="primary" className="mt-3" onClick={() => setShowOwnerModal(true)}>
                Add / Update
              </CButton>
            </CCardBody>
          </CCard>
          )}

          {/* Booking History — Only visible if bookings exist */}
          {hasBookings && (
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Booking History</strong>
              </CCardHeader>
              <CCardBody>
                <CListGroup>
                  {bookingHistory.slice(0, 2).map((item, index) => (
                    <CListGroupItem key={index}>
                      <strong>Trip ID:</strong> {item.tripId} –{" "}
                      <strong>Status:</strong> {item.status}
                    </CListGroupItem>
                  ))}
                </CListGroup>
                <div className="text-end mt-3">
                  <CButton color="primary" onClick={() => setOpenHistory(true)}>
                    More History
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          )}

          {/* Documents Section — shown only when vendor added */}
          {ownerAdded && (
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

          {ownerAdded && (
            <div className="text-center">
              <CButton color="success" size="lg" onClick={handleSaveAll}>
                Save All
              </CButton>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Owner Modal */}
      <CModal visible={showOwnerModal} onClose={() => setShowOwnerModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Trip Owner</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Company Name"
              name="company"
              value={owner.company}
              onChange={handleChange}
            />
            <CFormInput
              label="Company Contact"
              name="contact"
              value={owner.contact}
              onChange={handleChange}
              className="mt-2"
            />
            <CFormSelect
              label="Company Type"
              name="type"
              value={owner.type}
              onChange={handleChange}
              className="mt-2"
            >
              <option value="">Select Company Type</option>
              <option value="Event company">Event company</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="Direct Client">Direct Client</option>
            </CFormSelect>
            <CFormInput
              label="Email"
              name="email"
              value={owner.email}
              onChange={handleChange}
              className="mt-2"
            />
            <CFormInput
              label="Mobile Number"
              name="mobile"
              value={owner.mobile}
              onChange={handleChange}
              className="mt-2"
            />
            <CFormInput
              label="Address"
              name="address"
              value={owner.address}
              onChange={handleChange}
              className="mt-2"
            />
            <CFormInput
              label="Location"
              name="location"
              value={owner.location}
              onChange={handleChange}
              className="mt-2"
            />
            <CFormInput
              label="Country"
              name="country"
              value={owner.country}
              onChange={handleChange}
              className="mt-2"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowOwnerModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => setShowOwnerModal(false)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Booking History Modal */}
      <CModal visible={openHistory} onClose={() => setOpenHistory(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Full Booking History</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CListGroup>
            {bookingHistory.map((item, index) => (
              <CListGroupItem key={index}>
                <strong>Trip ID:</strong> {item.tripId} –{" "}
                <strong>Status:</strong> {item.status}
              </CListGroupItem>
            ))}
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOpenHistory(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
     
      {/* Document Modal */}
      <CModal visible={showDocModal} onClose={() => setShowDocModal(false)}>
        <CModalHeader>Add Document</CModalHeader>
        <CModalBody>
          <form onSubmit={handleDocumentAdd}>
            <input type="file" name="file" accept="application/pdf" className="form-control" />
            <CModalFooter>
              <CButton color="secondary" type="button" onClick={() => setShowDocModal(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Add
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>

      {/* Feedback Modal */}
      <CModal visible={showFeedback} onClose={() => setShowFeedback(false)}>
        <CModalHeader>
          <CModalTitle>Trip Owner Created</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Trip owner created successfully. Do you want to activate the created trip owner?
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => handleActivationDecision(true)}>
            Yes
          </CButton>
          <CButton color="secondary" onClick={() => handleActivationDecision(false)}>
            No
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}