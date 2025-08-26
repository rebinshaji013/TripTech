import { 
  setTodaysTrips, 
  setLoading, 
  setError, 
  setTripDetails // ✅ make sure this exists in tripSlice
} from './tripSlice';

// Mock API call to fetch today's trips
export const fetchTodaysTrips = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    const todaysTrips = [
      {
        id: '001',
        time: '09:00 AM',
        date: '09-AUG-2025',
        pickup: '123 Main St. Oak Ave, Amytown',
        passengerName: 'John Smith',
      },
      {
        id: '002',
        time: '02:00 PM',
        date: '09-AUG-2025',
        pickup: '789 Pine Ln. Oak Ave, Amytown',
        passengerName: 'Sarah Johnson',
      },
      {
        id: '003',
        time: '07:00 PM',
        date: '09-AUG-2025',
        pickup: '456 Oak Ave, Main St. Amytown',
        passengerName: 'Michael Brown',
      },
      {
        id: '004',
        time: '09:00 PM',
        date: '09-AUG-2025',
        pickup: '321 Elm St. Maple Ave, Amytown',
        passengerName: 'Emily Davis',
      },
    ];
    
    dispatch(setTodaysTrips(todaysTrips));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch trips'));
    dispatch(setLoading(false));
  }
};

// Search trips by ID or passenger name
export const searchTrips = (searchTerm) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { todaysTrips } = getState().trip;
    
    if (!searchTerm) {
      // If search term is empty, reset to all trips
      dispatch(fetchTodaysTrips());
      return;
    }
    
    const filteredTrips = todaysTrips.filter(trip => 
      trip.id.includes(searchTerm) || 
      trip.passengerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    dispatch(setTodaysTrips(filteredTrips));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Search failed'));
    dispatch(setLoading(false));
  }
};

// ✅ Fetch trip details by ID
export const fetchTripDetails = (tripId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - replace with actual API call
    const tripDetails = {
      id: tripId,
      time: '09:00 AM',
      date: '09-AUG-2025',
      pickupAddress: '123 Main St. Oak Ave, Anytown',
      passengerName: 'Elhon Miller',
      phoneNumber: '+16557987-6543',
      status: 'upcoming',
      // Milestones or extra details can be added later
    };
    
    dispatch(setTripDetails(tripDetails));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch trip details'));
    dispatch(setLoading(false));
  }
};
