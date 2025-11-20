import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CBadge,
  CListGroup,
  CListGroupItem,
} from "@coreui/react"
import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

export default function Owners() {
  const navigate = useNavigate()
  const [ownerData, setOwnerData] = useState([])

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState(null)
  const [editForm, setEditForm] = useState({
    company: "",
    contact: "",
    email: "",
    location: "",
    status: "",
    type: "",
    address: "",
    mobile: "",
    country: "",
  })

  // View modal
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewOwner, setViewOwner] = useState(null)
  const [bookingHistory, setBookingHistory] = useState([])

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("owners") || "[]")
    setOwnerData(storedOwners)
  }, [])

  // Add owner navigation
  const handleAddOwner = () => {
    navigate("/logistics/addowner")
  }

  // Delete owner
  const handleDeleteOwner = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this owner?")
    if (!confirmDelete) return

    const updatedOwners = ownerData.filter((_, i) => i !== index)
    setOwnerData(updatedOwners)
    localStorage.setItem("owners", JSON.stringify(updatedOwners))
  }

  // Open edit modal
  const handleEditOwner = (index) => {
    const ownerToEdit = ownerData[index]
    setSelectedOwnerIndex(index)
    setEditForm({ ...ownerToEdit })
    setShowEditModal(true)
  }

  // Save edited owner
  const handleSaveEdit = () => {
    if (!editForm.company || !editForm.contact) {
      alert("Company and Company Contact are required!")
      return
    }

    const updatedOwners = [...ownerData]
    updatedOwners[selectedOwnerIndex] = { ...editForm }
    setOwnerData(updatedOwners)
    localStorage.setItem("owners", JSON.stringify(updatedOwners))
    setShowEditModal(false)
    alert("Owner details updated successfully!")
  }

  // Edit input change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  // View owner modal
  const handleViewOwner = (owner) => {
    setViewOwner(owner)
    setShowViewModal(true)

    // Load mock booking data (for demo)
    const sampleBookings = [
      { tripId: "2003239008890", status: "Done", ownerCompany: "LogiTrans Pvt Ltd" },
      { tripId: "2003239008891", status: "Draft", ownerCompany: "TransAsia" },
      { tripId: "2003239008892", status: "Completed", ownerCompany: "LogiTrans Pvt Ltd" },
      { tripId: "2003239008893", status: "Cancelled", ownerCompany: "FastGo Logistics" },
    ]

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    if (allBookings.length === 0) {
      localStorage.setItem("bookings", JSON.stringify(sampleBookings))
    }

    const filteredBookings = (allBookings.length ? allBookings : sampleBookings).filter(
      (b) =>
        b.ownerCompany.toLowerCase() === owner.company.toLowerCase() ||
        b.ownerCompany.toLowerCase() === owner.contact.toLowerCase()
    )
    setBookingHistory(filteredBookings)
  }

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Trip Owner Listing</h5>
          <CButton color="primary" onClick={handleAddOwner}>
            Add Owner
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CTable bordered hover responsive align="middle">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Company Name</CTableHeaderCell>
                <CTableHeaderCell>Company Contact</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Location</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {ownerData.length > 0 ? (
                ownerData.map((owner, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{owner.company || "-"}</CTableDataCell>
                    <CTableDataCell>{owner.contact || "-"}</CTableDataCell>
                    <CTableDataCell>{owner.email || "-"}</CTableDataCell>
                    <CTableDataCell>{owner.location || "-"}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={owner.status === "Active" ? "success" : "secondary"}>
                        {owner.status || "Inactive"}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="outline"
                        className="me-2"
                        onClick={() => handleEditOwner(idx)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="secondary"
                        variant="outline"
                        className="me-2"
                        onClick={() => handleViewOwner(owner)}
                      >
                        <CIcon icon={cilMagnifyingGlass} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        variant="outline"
                        onClick={() => handleDeleteOwner(idx)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    No owners found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* ===== Edit Owner Modal ===== */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Trip Owner</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Company Name"
              name="company"
              value={editForm.company}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormInput
              label="Company Contact"
              name="contact"
              value={editForm.contact}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormSelect
              label="Company Type"
              name="type"
              value={editForm.type}
              onChange={handleEditChange}
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
              value={editForm.email}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormInput
              label="Mobile Number"
              name="mobile"
              value={editForm.mobile}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormInput
              label="Address"
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormInput
              label="Location"
              name="location"
              value={editForm.location}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormInput
              label="Country"
              name="country"
              value={editForm.country}
              onChange={handleEditChange}
              className="mb-2"
            />
            <CFormSelect
              label="Status"
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ===== View Owner Modal ===== */}
      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Trip Owner Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewOwner ? (
            <>
              <h6 className="mb-3">Basic Information</h6>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Company Name</CTableDataCell>
                    <CTableDataCell>{viewOwner.company || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Company Contact</CTableDataCell>
                    <CTableDataCell>{viewOwner.contact || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Company Type</CTableDataCell>
                    <CTableDataCell>{viewOwner.type || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Email</CTableDataCell>
                    <CTableDataCell>{viewOwner.email || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Mobile Number</CTableDataCell>
                    <CTableDataCell>{viewOwner.mobile || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Address</CTableDataCell>
                    <CTableDataCell>{viewOwner.address || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Location</CTableDataCell>
                    <CTableDataCell>{viewOwner.location || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Country</CTableDataCell>
                    <CTableDataCell>{viewOwner.country || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={viewOwner.status === "Active" ? "success" : "secondary"}>
                        {viewOwner.status || "Inactive"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <h6 className="mt-4 mb-3">Booking History</h6>
              {bookingHistory.length > 0 ? (
                <CListGroup>
                  {bookingHistory.map((b, i) => (
                    <CListGroupItem key={i}>
                      <strong>Trip ID:</strong> {b.tripId} &nbsp; | &nbsp;
                      <strong>Status:</strong> {b.status}
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <p className="text-muted">No booking history found.</p>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}