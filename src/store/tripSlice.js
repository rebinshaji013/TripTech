import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trips: [],
  todaysTrips: [],
  currentTrip: null,
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
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
      }
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ✅ New reducers for trip details + milestones
    setTripDetails: (state, action) => {
      state.currentTrip = {
        ...action.payload,
        milestones: action.payload.milestones || [
          { id: 1, address: '123 Main St. Oak Ave, Anytown', time: '09:00 AM', date: '09-AUG-2025', region: 'Midwest' },
          { id: 2, address: '456 Oak St. Pine Rd, Anytown', time: '09:30 AM', date: '09-AUG-2025', region: 'Midwest' },
          { id: 3, address: '789 Elm St. Maple Ave, Anytown', time: '10:00 AM', date: '09-AUG-2025', region: 'Midwest' },
          { id: 4, address: '321 Cedar St. Birch Blvd, Anytown', time: '10:30 AM', date: '09-AUG-2025', region: 'Midwest' },
        ],
      };
    },

    updateMilestoneStatus: (state, action) => {
      const { milestoneId, checked } = action.payload;
      if (state.currentTrip && state.currentTrip.milestones) {
        state.currentTrip.milestones = state.currentTrip.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, checked }
            : milestone
        );
      }
    },

    confirmTrip: (state) => {
      if (state.currentTrip) {
        state.currentTrip.status = 'confirmed';

        // also update in trips list if present
        const tripIndex = state.trips.findIndex(t => t.id === state.currentTrip.id);
        if (tripIndex !== -1) {
          state.trips[tripIndex].status = 'confirmed';
        }
      }
    },
  },
});

export const {
  setCurrentTrip,
  setTrips,
  setTodaysTrips,
  updateTripStatus,
  setUser,
  setLoading,
  setError,
  clearError,
  setTripDetails,
  updateMilestoneStatus,
  confirmTrip,
} = tripSlice.actions;

export default tripSlice.reducer;
