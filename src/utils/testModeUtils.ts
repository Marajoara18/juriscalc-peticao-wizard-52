/**
 * Utilities for managing unlimited test mode via Local Storage
 */

const TEST_MODE_KEY = 'lovable_user_test_mode';
const UNLIMITED_VALUE = 'unlimited_calculations';

/**
 * Checks if the current user is in unlimited test mode
 */
export const isUnlimitedTestMode = (): boolean => {
  try {
    const testMode = localStorage.getItem(TEST_MODE_KEY);
    return testMode === UNLIMITED_VALUE;
  } catch (error) {
    console.error('Error checking test mode:', error);
    return false;
  }
};

/**
 * Activates unlimited test mode
 */
export const activateTestMode = (): void => {
  try {
    localStorage.setItem(TEST_MODE_KEY, UNLIMITED_VALUE);
    console.log('✅ Test mode activated - unlimited calculations enabled');
  } catch (error) {
    console.error('Error activating test mode:', error);
  }
};

/**
 * Deactivates unlimited test mode
 */
export const deactivateTestMode = (): void => {
  try {
    localStorage.removeItem(TEST_MODE_KEY);
    console.log('✅ Test mode deactivated - normal limits restored');
  } catch (error) {
    console.error('Error deactivating test mode:', error);
  }
};

/**
 * Gets current test mode status
 */
export const getTestModeStatus = (): string => {
  try {
    const testMode = localStorage.getItem(TEST_MODE_KEY);
    return testMode || 'standard';
  } catch (error) {
    console.error('Error getting test mode status:', error);
    return 'standard';
  }
};

/**
 * Secret key combination to activate test mode (Ctrl+Shift+T+E+S+T)
 */
export const initializeTestModeKeyboard = () => {
  let sequence = '';
  const targetSequence = 'CTRLSHIFTTEST';
  
  const handleKeyDown = (event: KeyboardEvent) => {
    // Build sequence string
    let currentKey = '';
    if (event.ctrlKey) currentKey += 'CTRL';
    if (event.shiftKey) currentKey += 'SHIFT';
    if (event.key.toUpperCase().match(/[A-Z]/)) {
      currentKey += event.key.toUpperCase();
    }
    
    if (currentKey) {
      sequence += currentKey;
      
      // Keep only last part of sequence that could match
      if (sequence.length > targetSequence.length) {
        sequence = sequence.slice(-targetSequence.length);
      }
      
      // Check if sequence matches
      if (sequence === targetSequence) {
        const isCurrentlyActive = isUnlimitedTestMode();
        if (isCurrentlyActive) {
          deactivateTestMode();
          alert('🔴 Modo de teste desativado - Limites normais restaurados');
        } else {
          activateTestMode();
          alert('🟢 Modo de teste ativado - Cálculos ilimitados habilitados');
        }
        sequence = ''; // Reset sequence
      }
    }
    
    // Reset sequence after 3 seconds of inactivity
    setTimeout(() => {
      sequence = '';
    }, 3000);
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};
