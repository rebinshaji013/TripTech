import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))
const MainChart = React.lazy(() => import('./views/pages/dashboard/MainChart'))
const TripsBookings = React.lazy(() => import('./views/pages/trips/Trips'))
const NewRequestDetails = React.lazy(() => import('./views/pages/trips/NewRequest'))
const Vehicles = React.lazy(() => import('./views/pages/vehicles/Vehicles'))
const AddVehicle = React.lazy(() => import('./views/pages/vehicles/AddVehicle'))
const Drivers = React.lazy(() => import('./views/pages/drivers/Drivers'))
const AddDriver = React.lazy(() => import('./views/pages/drivers/AddDriver'))
const TripCoordinators = React.lazy(() => import('./views/pages/tripcoordinators/TripCoordinators'))
const AddCoordinator = React.lazy(() => import('./views/pages/tripcoordinators/AddCoordinator'))
const Services = React.lazy(() => import('./views/pages/servicesmanagement/Services'))
const AddService = React.lazy(() => import('./views/pages/servicesmanagement/AddService'))
const Owners = React.lazy(() => import('./views/pages/owners/Owners'))
const AddOwner = React.lazy(() => import('./views/pages/owners/AddOwner'))
const Operations = React.lazy(() => import('./views/pages/operations/Operations'))
const AddUser = React.lazy(() => import('./views/pages/operations/AddUser'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Auth wrapper
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

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

    if (isColorModeSet()) {
      return
    }

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

          {/* Protected with DefaultLayout */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          >
            {/* Child routes (no leading slash!) */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mainChart" element={<MainChart />} />
            <Route path="trips" element={<TripsBookings />} />
            <Route path="newrequest" element={<NewRequestDetails />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="addvehicle" element={<AddVehicle />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="adddriver" element={<AddDriver />} />
            <Route path="coordinators" element={<TripCoordinators />} />
            <Route path="addcoordinator" element={<AddCoordinator />} />
            <Route path="services" element={<Services />} />
            <Route path="addservice" element={<AddService />} />
            <Route path="owners" element={<Owners />} />
            <Route path="addowner" element={<AddOwner />} />
            <Route path="operations" element={<Operations />} />
            <Route path="adduser" element={<AddUser />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
