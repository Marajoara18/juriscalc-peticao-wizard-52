
// Test mode utilities for development and testing purposes

/**
 * Activates test mode by setting unlimited calculations
 */
export const activateTestMode = (): void => {
  // Set a flag in localStorage to indicate test mode is active
  localStorage.setItem('testMode', 'active');
  localStorage.setItem('testModeUnlimited', 'true');
  
  console.log('🧪 Test mode activated - unlimited calculations enabled');
};

/**
 * Deactivates test mode
 */
export const deactivateTestMode = (): void => {
  localStorage.removeItem('testMode');
  localStorage.removeItem('testModeUnlimited');
  
  console.log('🧪 Test mode deactivated');
};

/**
 * Checks if test mode is currently active
 */
export const isTestModeActive = (): boolean => {
  return localStorage.getItem('testMode') === 'active';
};

/**
 * Initializes keyboard shortcuts for test mode
 * Returns a cleanup function to remove event listeners
 */
export const initializeTestModeKeyboard = (): (() => void) => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl + Shift + T to toggle test mode
    if (event.ctrlKey && event.shiftKey && event.key === 'T') {
      event.preventDefault();
      
      if (isTestModeActive()) {
        deactivateTestMode();
      } else {
        activateTestMode();
      }
    }
    
    // Ctrl + Shift + U for unlimited calculations (same as test mode)
    if (event.ctrlKey && event.shiftKey && event.key === 'U') {
      event.preventDefault();
      activateTestMode();
    }
  };
  
  // Add event listener
  document.addEventListener('keydown', handleKeydown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };
};

/**
 * Gets test mode status for debugging
 */
export const getTestModeStatus = () => {
  return {
    isActive: isTestModeActive(),
    unlimitedCalculations: localStorage.getItem('testModeUnlimited') === 'true',
    timestamp: new Date().toISOString()
  };
};
