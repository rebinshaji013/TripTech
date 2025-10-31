// src/components/ErrorBoundary.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to your error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);

    // You can also send this to your error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return (
          <View style={styles.fallbackContainer}>
            {this.props.fallback}
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Icon
              source="alert-circle-outline"
              size={80}
              color="#FF6B6B"
              style={styles.errorIcon}
            />

            <Text style={styles.title}>Something Went Wrong</Text>

            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Don't worry, our team has been notified.
            </Text>

            <Text style={styles.retryCount}>
              Retry attempt: {this.state.retryCount + 1}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
              >
                <Icon source="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={this.handleReset}
              >
                <Icon source="home" size={20} color="#007AFF" />
                <Text style={styles.resetButtonText}>Go Home</Text>
              </TouchableOpacity>
            </View>

            {/* Error details - only shown in development */}
            {this.props.showDetails && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorDetailsTitle}>Error Details (Development):</Text>
                <Text style={styles.errorMessage}>
                  {this.state.error.toString()}
                </Text>
                <Text style={styles.errorStack}>
                  {this.state.errorInfo?.componentStack}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryCount: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#999',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600',
  },
  errorDetails: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: height * 0.3,
    width: '100%',
  },
  errorDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Urbanist-Bold',
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 10,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;