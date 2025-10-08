import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilUser,
  cilGlobeAlt,
  cilEnvelopeClosed,
  cilPhone,
  cilHome,
} from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.companyName || !formData.fullName || !formData.email || !formData.role) {
      alert('Please fill all mandatory fields: Company Name, Full Name, Email, Role')
      return
    }

    // Save user data locally (replace this with API integration later)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('role', formData.role)
    localStorage.setItem('userData', JSON.stringify(formData))

    // Redirect user by role → same structure as App.jsx
    if (formData.role === 'logistics') navigate('/login')
    if (formData.role === 'owner') navigate('/login')
    if (formData.role === 'vendor') navigate('/login')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your company account</p>

                  {/* Company Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBuilding} />
                    </CInputGroupText>
                    <CFormInput
                      name="companyName"
                      placeholder="Company Name *"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Full Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="fullName"
                      placeholder="Person Full Name *"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Website */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilGlobeAlt} />
                    </CInputGroupText>
                    <CFormInput
                      name="website"
                      placeholder="Company Website (Optional)"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Phone */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  {/* Address */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHome} />
                    </CInputGroupText>
                    <CFormInput
                      name="address"
                      placeholder="Company Address (Optional)"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  {/* Role Selection */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>Role *</CInputGroupText>
                    <CFormSelect
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      <option value="logistics">Logistics Coordinator</option>
                      <option value="owner">Trip Owner</option>
                      <option value="vendor">Vendor</option>
                    </CFormSelect>
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
