import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { cilUser, cilLockLocked } from '@coreui/icons'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  // ✅ Reset login fields when visiting login page
  useEffect(() => {
    setUsername('')
    setPassword('')
    setRole('')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('role')
  }, [])

  // Dummy credentials (role-based)
  const credentials = {
    logistics: { username: 'logistics', password: 'logi123' },
    owner: { username: 'owner', password: 'own123' },
    vendor: { username: 'vendor', password: 'vend123' },
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (!role) {
      alert('Please select a role')
      return
    }

    const validUser = credentials[role]

    if (validUser && username === validUser.username && password === validUser.password) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('role', role)

      // Redirect based on role
      if (role === 'logistics') navigate('/logistics/dashboard')
      if (role === 'owner') navigate('/owner/dashboard')
      if (role === 'vendor') navigate('/vendor/dashboard')
    } else {
      alert('Invalid username or password for the selected role')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Username */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Password */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Role Dropdown */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>Role</CInputGroupText>
                      <CFormSelect
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">-- Select Role --</option>
                        <option value="logistics">Logistics Coordinator</option>
                        <option value="owner">Trip Owner</option>
                        <option value="vendor">Vendor</option>
                      </CFormSelect>
                    </CInputGroup>

                    {/* Buttons */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Right side panel */}
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
