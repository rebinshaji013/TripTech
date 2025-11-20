import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilViewQuilt,
  cilClipboard,
  cilTag,
  cilCarAlt,
  cilUser,
  cilPeople,
  cilSettings,
  cilUserPlus,
  cilTouchApp,
  cilLayers,
  cilPaperPlane,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// Get role from localStorage
const role = localStorage.getItem('role') || ''

let _nav = []

if (role === 'logistics') {
  _nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/logistics/dashboard',
      icon: <CIcon icon={cilViewQuilt} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Managements',
    },
    {
      component: CNavItem,
      name: 'Trip Invite',
      to: '/logistics/invites',
      icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Trip Owners',
      to: '/logistics/owners',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Quotes',
      to: '/logistics/trips',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Bookings',
      to: '/logistics/bookings',
      icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Trip Types',
      to: '/logistics/triptypes',
      icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Vendors',
      to: '/logistics/vendors',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Operations Team',
      to: '/logistics/operations',
      icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Vehicles',
      to: '/logistics/vehicles',
      icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Drivers',
      to: '/logistics/drivers',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Profile',
      to: '/logistics/profile',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ]
} else if (role === 'owner') {
  _nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/owner/dashboard',
      icon: <CIcon icon={cilViewQuilt} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Managements',
    },
    {
      component: CNavItem,
      name: 'Trip Invite',
      to: '/owner/invites',
      icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Trips',
      to: '/owner/trips',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Bookings',
      to: '/owner/bookings',
      icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Users',
      to: '/owner/operations',
      icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Profile',
      to: '/owner/profile',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ]
} else if (role === 'vendor') {
  _nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/vendor/dashboard',
      icon: <CIcon icon={cilViewQuilt} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Managements',
    },
    {
      component: CNavItem,
      name: 'Trip Invite',
      to: '/vendor/invites',
      icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Bookings',
      to: '/vendor/bookings',
      icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'Trip Types',
    //   to: '/vendor/triptypes',
    //   icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    // },
    {
      component: CNavItem,
      name: 'Vehicles',
      to: '/vendor/vehicles',
      icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Drivers',
      to: '/vendor/drivers',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Users',
      to: '/vendor/operations',
      icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Profile',
      to: '/vendor/profile',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ]
}

export default _nav
