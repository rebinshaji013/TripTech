// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';

const App = () => {
  const handleRetry = () => {
    console.log('App retried after error boundary catch');
    // You can add additional recovery logic here
    // For example: resetting certain states, clearing cache, etc.
  };

  const customFallback = (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
        Oops! Something went wrong
      </Text>
      <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
        The app encountered an unexpected error. Please try again.
      </Text>
    </View>
  );

  return (
    <ErrorBoundary
      showDetails={__DEV__} // Show error details only in development
      onRetry={handleRetry}
      fallback={customFallback}
    >
      <Provider store={store}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;