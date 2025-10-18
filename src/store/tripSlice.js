// src/redux/slices/tripSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trips: [],
  todaysTrips: [],
  currentTrip: null,
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,

  // Vehicle reservations
  vehicleReservations: [],
  activeVehicleRide: null,

  // Location search and recent searches
  recentSearches: [
    {
      id: '1',
      location: 'Washington Square Park',
      address: 'Grey Art Gallery',
      type: 'recent',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      location: 'A New York Architecture',
      address: 'New York University',
      type: 'recent',
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      location: 'Statesville, FL',
      address: 'Houston',
      type: 'recent',
      timestamp: new Date().toISOString(),
    },
    {
      id: '4',
      location: 'W-303 St',
      address: 'Ding St',
      type: 'recent',
      timestamp: new Date().toISOString(),
    },
  ],

  // Search functionality
  searchQuery: '',
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    // ===== BASIC TRIP MANAGEMENT =====
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
    },

    setTrips: (state, action) => {
      state.trips = action.payload;
    },

    setTodaysTrips: (state, action) => {
      state.todaysTrips = action.payload;
    },

    updateTripStatus: (state, action) => {
      const { tripId, status } = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip) {
        trip.status = status;
        // For rating screen functionality
        if (status === 'reviewed') {
          trip.timeChecked = true;
        } else if (status === 'completed') {
          trip.timeChecked = false;
        }
      }
    },

    // ===== AUTHENTICATION =====
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // ===== LOADING & ERROR STATES =====
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ===== TRIP DETAILS & MILESTONES =====
    setTripDetails: (state, action) => {
      state.currentTrip = {
        ...action.payload,
        milestones: action.payload.milestones || [
          {
            id: 1,
            address: '123 Main St. Oak Ave, Anytown',
            time: '09:00 AM',
            date: '09-AUG-2025',
            region: 'Midwest',
            checked: false,
          },
          {
            id: 2,
            address: '456 Oak St. Pine Rd, Anytown',
            time: '09:30 AM',
            date: '09-AUG-2025',
            region: 'Midwest',
            checked: false,
          },
          {
            id: 3,
            address: '789 Elm St. Maple Ave, Anytown',
            time: '10:00 AM',
            date: '09-AUG-2025',
            region: 'Midwest',
            checked: false,
          },
          {
            id: 4,
            address: '321 Cedar St. Birch Blvd, Anytown',
            time: '10:30 AM',
            date: '09-AUG-2025',
            region: 'Midwest',
            checked: false,
          },
        ],
      };
    },

    updateMilestoneStatus: (state, action) => {
      const { milestoneId, checked } = action.payload;

      // For current trip milestones
      if (state.currentTrip && state.currentTrip.milestones) {
        state.currentTrip.milestones = state.currentTrip.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, checked }
            : milestone
        );
      }

      // For trips in the trips array (used by RatingScreen)
      const trip = state.trips.find(t => t.id === milestoneId);
      if (trip) {
        trip.dateChecked = checked;
      }
    },

    confirmTrip: (state) => {
      if (state.currentTrip) {
        state.currentTrip.status = 'confirmed';

        // Also update in trips list if present
        const tripIndex = state.trips.findIndex(t => t.id === state.currentTrip.id);
        if (tripIndex !== -1) {
          state.trips[tripIndex].status = 'confirmed';
        }
      }
    },

    // ===== SEARCH FUNCTIONALITY =====
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    toggleDateCheck: (state, action) => {
      const tripId = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip) {
        trip.dateChecked = !trip.dateChecked;
      }
    },

    toggleTimeCheck: (state, action) => {
      const tripId = action.payload;
      const trip = state.trips.find(t => t.id === tripId);
      if (trip) {
        trip.timeChecked = !trip.timeChecked;
      }
    },

    // ===== LOCATION SEARCH & MANAGEMENT =====
    setPickupLocation: (state, action) => {
      const { location, address, coordinates } = action.payload;

      if (state.currentTrip) {
        state.currentTrip.pickupLocation = location;
        state.currentTrip.pickupAddress = address;
        state.currentTrip.pickupCoordinates = coordinates;
        state.currentTrip.status = 'pickup_set';
      } else {
        // Create new trip if none exists
        state.currentTrip = {
          id: `trip_${Date.now()}`,
          pickupLocation: location,
          pickupAddress: address,
          pickupCoordinates: coordinates,
          status: 'pickup_set',
          createdAt: new Date().toISOString(),
          milestones: [],
        };
      }

      // Save to recent searches
      const recentSearch = {
        id: `search_${Date.now()}`,
        location,
        address,
        type: 'pickup',
        timestamp: new Date().toISOString(),
      };
      state.recentSearches = [recentSearch, ...state.recentSearches].slice(0, 10);
    },

    setDestinationLocation: (state, action) => {
      const { location, address, coordinates } = action.payload;

      if (state.currentTrip) {
        state.currentTrip.destinationLocation = location;
        state.currentTrip.destinationAddress = address;
        state.currentTrip.destinationCoordinates = coordinates;
        state.currentTrip.status = 'destination_set';

        // Generate milestones based on pickup and destination
        state.currentTrip.milestones = [
          {
            id: 1,
            type: 'pickup',
            address: state.currentTrip.pickupAddress,
            location: state.currentTrip.pickupLocation,
            coordinates: state.currentTrip.pickupCoordinates,
            time: '10:00 AM',
            date: new Date().toISOString().split('T')[0],
            checked: false,
          },
          {
            id: 2,
            type: 'destination',
            address: address,
            location: location,
            coordinates: coordinates,
            time: '10:30 AM',
            date: new Date().toISOString().split('T')[0],
            checked: false,
          }
        ];
      }

      // Save to recent searches
      const recentSearch = {
        id: `search_${Date.now()}`,
        location,
        address,
        type: 'destination',
        timestamp: new Date().toISOString(),
      };
      state.recentSearches = [recentSearch, ...state.recentSearches].slice(0, 10);
    },

    clearTripLocations: (state) => {
      if (state.currentTrip) {
        state.currentTrip.pickupLocation = null;
        state.currentTrip.pickupAddress = null;
        state.currentTrip.pickupCoordinates = null;
        state.currentTrip.destinationLocation = null;
        state.currentTrip.destinationAddress = null;
        state.currentTrip.destinationCoordinates = null;
        state.currentTrip.status = 'initial';
      }
    },

    saveRecentSearch: (state, action) => {
      const { location, address, type = 'search' } = action.payload;
      const recentSearch = {
        id: `search_${Date.now()}`,
        location,
        address,
        type,
        timestamp: new Date().toISOString(),
      };

      // Add to beginning of array and keep only last 10
      state.recentSearches = [recentSearch, ...state.recentSearches].slice(0, 10);
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },

    initializeTripWithLocations: (state, action) => {
      const { pickup, destination } = action.payload;
      state.currentTrip = {
        id: `trip_${Date.now()}`,
        pickupLocation: pickup.location,
        pickupAddress: pickup.address,
        pickupCoordinates: pickup.coordinates,
        destinationLocation: destination.location,
        destinationAddress: destination.address,
        destinationCoordinates: destination.coordinates,
        status: 'locations_set',
        createdAt: new Date().toISOString(),
        estimatedPrice: '€1,43',
        estimatedTime: '30 min',
        milestones: [
          {
            id: 1,
            type: 'pickup',
            address: pickup.address,
            location: pickup.location,
            coordinates: pickup.coordinates,
            time: '10:00 AM',
            date: new Date().toISOString().split('T')[0],
            checked: false,
          },
          {
            id: 2,
            type: 'destination',
            address: destination.address,
            location: destination.location,
            coordinates: destination.coordinates,
            time: '10:30 AM',
            date: new Date().toISOString().split('T')[0],
            checked: false,
          }
        ],
      };
    },

    // ===== VEHICLE RESERVATION SYSTEM =====
    setVehicleReservation: (state, action) => {
      const reservation = {
        id: `vehicle_${Date.now()}`,
        ...action.payload,
        type: 'vehicle_reservation',
        status: 'reserved',
        reservationStartTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      state.currentTrip = reservation;
      state.vehicleReservations.push(reservation);
    },

    startVehicleRide: (state) => {
      if (state.currentTrip && state.currentTrip.type === 'vehicle_reservation') {
        state.currentTrip.status = 'active';
        state.currentTrip.rideStartTime = new Date().toISOString();
        state.activeVehicleRide = state.currentTrip;

        // Update in reservations array
        const reservationIndex = state.vehicleReservations.findIndex(
          r => r.id === state.currentTrip.id
        );
        if (reservationIndex !== -1) {
          state.vehicleReservations[reservationIndex].status = 'active';
          state.vehicleReservations[reservationIndex].rideStartTime = new Date().toISOString();
        }
      }
    },

    releaseVehicle: (state) => {
      if (state.currentTrip && state.currentTrip.type === 'vehicle_reservation') {
        state.currentTrip.status = 'released';
        state.currentTrip.reservationEndTime = new Date().toISOString();
        state.activeVehicleRide = null;

        // Update in reservations array
        const reservationIndex = state.vehicleReservations.findIndex(
          r => r.id === state.currentTrip.id
        );
        if (reservationIndex !== -1) {
          state.vehicleReservations[reservationIndex].status = 'released';
          state.vehicleReservations[reservationIndex].reservationEndTime = new Date().toISOString();
        }
      }
    },

    completeVehicleRide: (state, action) => {
      const { rideId, finalPrice, distance, duration } = action.payload;

      if (state.activeVehicleRide && state.activeVehicleRide.id === rideId) {
        state.activeVehicleRide.status = 'completed';
        state.activeVehicleRide.rideEndTime = new Date().toISOString();
        state.activeVehicleRide.finalPrice = finalPrice;
        state.activeVehicleRide.distance = distance;
        state.activeVehicleRide.duration = duration;

        // Update in reservations array
        const reservationIndex = state.vehicleReservations.findIndex(
          r => r.id === rideId
        );
        if (reservationIndex !== -1) {
          state.vehicleReservations[reservationIndex] = {
            ...state.vehicleReservations[reservationIndex],
            status: 'completed',
            rideEndTime: new Date().toISOString(),
            finalPrice,
            distance,
            duration,
          };
        }

        state.activeVehicleRide = null;
      }
    },

    updateVehicleLocation: (state, action) => {
      const { vehicleId, location } = action.payload;
      if (state.activeVehicleRide && state.activeVehicleRide.vehicle?.id === vehicleId) {
        state.activeVehicleRide.currentLocation = location;
      }
    },

    clearActiveVehicleRide: (state) => {
      state.activeVehicleRide = null;
    },

    setVehicleReservationHistory: (state, action) => {
      state.vehicleReservations = action.payload;
    },

    // ===== UTILITY FUNCTIONS =====
    resetTripState: (state) => {
      state.currentTrip = null;
      state.activeVehicleRide = null;
      state.loading = false;
      state.error = null;
    },

    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
  },
});

// Export all actions
export const {
  // Basic trip management
  setCurrentTrip,
  setTrips,
  setTodaysTrips,
  updateTripStatus,

  // Authentication
  setUser,

  // Loading & error states
  setLoading,
  setError,
  clearError,

  // Trip details & milestones
  setTripDetails,
  updateMilestoneStatus,
  confirmTrip,

  // Search functionality
  setSearchQuery,
  toggleDateCheck,
  toggleTimeCheck,

  // Location search & management
  setPickupLocation,
  setDestinationLocation,
  clearTripLocations,
  saveRecentSearch,
  clearRecentSearches,
  initializeTripWithLocations,

  // Vehicle reservation system
  setVehicleReservation,
  startVehicleRide,
  releaseVehicle,
  completeVehicleRide,
  updateVehicleLocation,
  clearActiveVehicleRide,
  setVehicleReservationHistory,

  // Utility functions
  resetTripState,
  clearCurrentTrip,
} = tripSlice.actions;

export default tripSlice.reducer;