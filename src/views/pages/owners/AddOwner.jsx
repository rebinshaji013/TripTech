import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard, CCardHeader, CCardBody, CCardTitle,
  CRow, CCol, CForm, CFormLabel, CFormInput, CFormSelect,
  CButton, CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter,
  CListGroup, CListGroupItem,
  CTable, CTableBody, CTableRow, CTableDataCell,
  CBadge,
} from "@coreui/react";


export default function OwnerDetails() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState({
    type: "",
    name: "",
    location: "",
    status: "",
  });

  const [openHistory, setOpenHistory] = useState(false);
  const [documents, setDocuments] = useState([{ name: "", file: null }]);

  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const handleChange = (e) =>
  setOwner({ ...owner, [e.target.name]: e.target.value });


  const handleDocumentAdd = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return alert("Please upload a file.");
    if (file.type !== "application/pdf") return alert("Only PDF allowed.");
    setDocuments([...documents, { name: file.name, file }]);
    setShowDocModal(false);
  };
  

  const downloadDocument = (file) => {
    if (!file) return alert("No file available.");
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleSaveOwner = () => {
    const existingOwners = JSON.parse(localStorage.getItem("owners") || "[]");
    const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");

    localStorage.setItem("owners", JSON.stringify([...existingOwners, owner]));
    localStorage.setItem("documents", JSON.stringify([...existingDocs, ...documents]));

    navigate("/logistics/owners"); // go back to listing page
  };

  return (
    <div className="p-4">
      <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Trip Owner Details</h5>
        </CCardHeader>
        <CCardBody>
          {/* Vehicle Details */}
          <CCard className="mb-3">
          <CCardHeader>
          <strong>Owner Details</strong>
          </CCardHeader>  
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>TO Type</CTableDataCell>
                    <CTableDataCell>{owner.type || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>TO Name</CTableDataCell>
                    <CTableDataCell>{owner.name || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>TO Location</CTableDataCell>
                    <CTableDataCell>{owner.location || "-"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={owner.status === "Active" ? "success" : "secondary"}>
                        {owner.status || "-"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowOwnerModal(true)}>
                 Add / Update
             </CButton>
            </CCardBody>
          </CCard>

          {/* Booking History */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Booking History</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                <CListGroupItem>
                  <strong>Trip ID:</strong> 2003239008890 – <strong>Status:</strong> Done
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Trip ID:</strong> 2003239008891 – <strong>Status:</strong> Draft
                </CListGroupItem>
              </CListGroup>
              <div className="text-end mt-3">
                <CButton color="primary" onClick={() => setOpenHistory(true)}>
                  More History
                </CButton>
              </div>
            </CCardBody>
          </CCard>

          {/* Documents */}
          <CCard className="mb-3">
          <CCardHeader>    
          <strong>Documents</strong>
          </CCardHeader>  
            <CCardBody>
              <CTable bordered striped>
                <CTableBody>
                  {documents.map((doc, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{doc.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm" color="info" onClick={() => downloadDocument(doc.file)}>
                          Download
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CButton color="primary" className="mt-2" onClick={() => setShowDocModal(true)}>
                Add Document
              </CButton>
            </CCardBody>
          </CCard>


          {/* Save Button */}
          <div className="text-center">
            <CButton color="success" onClick={handleSaveOwner}>
              Save
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Owner Modal */}
      <CModal visible={showOwnerModal} onClose={() => setShowOwnerModal(false)}>
        <CModalHeader>Update Owner</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="TO Type"
              name="type"
              value={owner.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
              <option value="Other">Other</option>
            </CFormSelect>
            <CFormInput
              label="TO Name"
              name="name"
              value={owner.name}
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
            <CFormSelect
              label="Status"
              name="status"
              value={owner.status}
              onChange={handleChange}
              className="mt-2"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
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
            <CListGroupItem>
              <strong>Trip ID:</strong> 2003239008890 – <strong>Status:</strong> Done
            </CListGroupItem>
            <CListGroupItem>
              <strong>Trip ID:</strong> 2003239008891 – <strong>Status:</strong> Draft
            </CListGroupItem>
            <CListGroupItem>
              <strong>Trip ID:</strong> 2003239008892 – <strong>Status:</strong> Cancelled
            </CListGroupItem>
            <CListGroupItem>
              <strong>Trip ID:</strong> 2003239008893 – <strong>Status:</strong> Completed
            </CListGroupItem>
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
            <input type="file" name="file" accept="application/pdf" className="w-full" />
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
    </div>
  );
}
