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
} from "@coreui/react"
import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

export default function Owners() {
  const navigate = useNavigate()
  const [ownerData, setOwnerData] = useState([])

  const handleAddOwner = () => {
    navigate("/logistics/addowner") // navigate to Trip Owner details screen
  }

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("owners") || "[]")
    setOwnerData(storedOwners)
  }, [])

  const handleDeleteOwner = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this owner?")
    if (!confirmDelete) return

    const updatedOwners = ownerData.filter((_, i) => i !== index)
    setOwnerData(updatedOwners)
    localStorage.setItem("owners", JSON.stringify(updatedOwners))
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
                <CTableHeaderCell scope="col">TO Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">TO Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">TO Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {ownerData.length > 0 ? (
                ownerData.map((owner, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{owner.type}</CTableDataCell>
                    <CTableDataCell>{owner.name}</CTableDataCell>
                    <CTableDataCell>{owner.location}</CTableDataCell>
                    <CTableDataCell>{owner.status}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="info"
                        variant="outline"
                        className="me-2"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        size="sm"
                        color="secondary"
                        variant="outline"
                        className="me-2"
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
                  <CTableDataCell colSpan={5} className="text-center text-muted">
                    No owners found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}
