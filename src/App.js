import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

// Logistics Coordinator Pages
const LogisticsDashboard = React.lazy(() =>import('./views/pages/dashboard/Logistics/Dashboard'))
const LogisticsMainChart = React.lazy(() =>import('./views/pages/dashboard/Logistics/MainChart'))
const LogisticsTrips = React.lazy(() =>import('./views/pages/trips/Logistics/Trips'))
const LogisticsNewRequest = React.lazy(() =>import('./views/pages/trips/Logistics/NewRequest'))
const LogisticsBookings = React.lazy(() =>import('./views/pages/bookings/Logistics/Bookings'))
const LogisticsNewBooking = React.lazy(() =>import('./views/pages/bookings/Logistics/NewBooking'))
const LogisticsTripTypes = React.lazy(() =>import('./views/pages/services/Logistics/TripTypes'))
const LogisticsAddTripType = React.lazy(() =>import('./views/pages/services/Logistics/AddTripType'))
const LogisticsInvites = React.lazy(() => import('./views/pages/invite/Logistics/Invite'))
const LogisticsAddInvite = React.lazy(() => import('./views/pages/invite/Logistics/AddInvite'))
const LogisticsVehicles = React.lazy(() => import('./views/pages/vehicles/Logistics/Vehicles'))
const LogisticsAddVehicle = React.lazy(() => import('./views/pages/vehicles/Logistics/AddVehicle'))
const LogisticsDrivers = React.lazy(() => import('./views/pages/drivers/Logistics/Drivers'))
const LogisticsAddDriver = React.lazy(() => import('./views/pages/drivers/Logistics/AddDriver'))
const Vendors = React.lazy(() => import('./views/pages/vendors/Vendor'))
const AddVendor = React.lazy(() => import('./views/pages/vendors/AddVendor'))
const Owners = React.lazy(() => import('./views/pages/owners/Owners'))
const AddOwner = React.lazy(() => import('./views/pages/owners/AddOwner'))
const LogisticsOperations = React.lazy(() => import('./views/pages/operations/Logistics/Operations'))
const LogisticsAddUser = React.lazy(() => import('./views/pages/operations/Logistics/AddUser'))
const LogisticsProfile = React.lazy(() => import('./views/pages/driverlogin/Logistics/Profile'))

// Trip Owner Pages
const OwnerDashboard = React.lazy(() =>import('./views/pages/dashboard/TripOwner/Dashboard'))
const OwnerTrips = React.lazy(() => import('./views/pages/trips/Trip_Owner/Trips'))
const OwnerNewRequest = React.lazy(() =>import('./views/pages/trips/Trip_Owner/NewRequest'))
const OwnerInvites = React.lazy(() => import('./views/pages/invite/TripOwner/Invite'))
const OwnerAddInvite = React.lazy(() => import('./views/pages/invite/TripOwner/AddInvite'))
const OwnerBookings = React.lazy(() =>import('./views/pages/bookings/TripOwner/Bookings'))
const OwnerNewBooking = React.lazy(() =>import('./views/pages/bookings/TripOwner/NewBooking'))
const OwnerOperations = React.lazy(() =>import('./views/pages/operations/Trip_Owner/Operations'))
const OwnerAddUser = React.lazy(() =>import('./views/pages/operations/Trip_Owner/AddUser'))
const OwnerProfile = React.lazy(() => import('./views/pages/driverlogin/Owner/Profile'))

// Vendor Pages
const VendorDashboard = React.lazy(() =>import('./views/pages/dashboard/Vendor/Dashboard'))
const VendorBookings = React.lazy(() =>import('./views/pages/bookings/Vendor/Bookings'))
const VendorInvites = React.lazy(() => import('./views/pages/invite/Vendor/Invite'))
const VendorAddInvite = React.lazy(() => import('./views/pages/invite/Vendor/AddInvite'))
const VendorVehicles = React.lazy(() => import('./views/pages/vehicles/Vendor/Vehicles'))
const VendorAddVehicle = React.lazy(() => import('./views/pages/vehicles/Vendor/AddVehicle'))
const VendorDrivers = React.lazy(() => import('./views/pages/drivers/Vendor/Drivers'))
const VendorAddDriver = React.lazy(() => import('./views/pages/drivers/Vendor/AddDriver'))
const VendorOperations = React.lazy(() =>import('./views/pages/operations/Vendor/Operations'))
const VendorAddUser = React.lazy(() =>import('./views/pages/operations/Vendor/AddUser'))
const VendorProfile = React.lazy(() => import('./views/pages/driverlogin/Vendor/Profile'))

// Errors
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// ------------------- PrivateRoute -------------------
const PrivateRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const role = localStorage.getItem('role') // saved during login/register
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Role-to-base-path mapping
  const roleBasePaths = {
    logistics: '/logistics',
    owner: '/owner',
    vendor: '/vendor',
  }

  const basePath = roleBasePaths[role]

  // Check if user is trying to access outside their base path
  if (basePath && !location.pathname.startsWith(basePath)) {
    return <Navigate to="/404" replace />
  }

  // Check allowed roles explicitly
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/404" replace />
  }

  return children
}

// ------------------- App -------------------
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme',
  )
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme =
      urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) return
    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Logistics Coordinator Routes */}
          <Route
            path="/logistics/*"
            element={
              <PrivateRoute allowedRoles={['logistics']}>
                <DefaultLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<LogisticsDashboard />} />
            <Route path="mainChart" element={<LogisticsMainChart />} />
            <Route path="trips" element={<LogisticsTrips />} />
            <Route path="newrequest" element={<LogisticsNewRequest />} />
            <Route path="bookings" element={<LogisticsBookings />} />
            <Route path="newbooking" element={<LogisticsNewBooking/>} />
            <Route path="triptypes" element={<LogisticsTripTypes />} />
            <Route path="addtriptype" element={<LogisticsAddTripType />} />
            <Route path="invites" element={<LogisticsInvites />} />
            <Route path="addinvite" element={<LogisticsAddInvite />} />
            <Route path="vehicles" element={<LogisticsVehicles />} />
            <Route path="addvehicle" element={<LogisticsAddVehicle />} />
            <Route path="drivers" element={<LogisticsDrivers />} />
            <Route path="adddriver" element={<LogisticsAddDriver />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="addvendor" element={<AddVendor />} />
            <Route path="owners" element={<Owners />} />
            <Route path="addowner" element={<AddOwner />} />
            <Route path="operations" element={<LogisticsOperations />} />
            <Route path="adduser" element={<LogisticsAddUser />} />
            <Route path="profile" element={<LogisticsProfile />} />
          </Route>

          {/* Trip Owner Routes */}
          <Route
            path="/owner/*"
            element={
              <PrivateRoute allowedRoles={['owner']}>
                <DefaultLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="trips" element={<OwnerTrips />} />
            <Route path="newrequest" element={<OwnerNewRequest />} />
            <Route path="invites" element={<OwnerInvites />} />
            <Route path="addinvite" element={<OwnerAddInvite />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="newbooking" element={<OwnerNewBooking/>} />
            <Route path="operations" element={<OwnerOperations />} />
            <Route path="adduser" element={<OwnerAddUser />} />
            <Route path="profile" element={<OwnerProfile />} />
          </Route>

          {/* Vendor Routes */}
          <Route
            path="/vendor/*"
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <DefaultLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="bookings" element={<VendorBookings />} />
            <Route path="invites" element={<VendorInvites />} />
            <Route path="addinvite" element={<VendorAddInvite />} />
            <Route path="vehicles" element={<VendorVehicles />} />
            <Route path="addvehicle" element={<VendorAddVehicle />} />
            <Route path="drivers" element={<VendorDrivers />} />
            <Route path="adddriver" element={<VendorAddDriver />} />
            <Route path="operations" element={<VendorOperations />} />
            <Route path="adduser" element={<VendorAddUser />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
