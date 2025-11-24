import { logUserAction } from './googleSheets';

export async function logAction(actionData) {
  try {
    const enhancedData = {
      timestamp: new Date().toISOString(),
      userId: 'anonymous',
      ...actionData
    };

    await logUserAction(enhancedData);
    console.log('✅ Log registrado:', actionData.action);
    return true;
  } catch (error) {
    console.error('❌ Error registrando log:', error);
    return false;
  }
}

export const ActionTypes = {
  PAGE_VIEW: 'PAGE_VIEW',
  BUTTON_CLICK: 'BUTTON_CLICK',
  TEST_START: 'TEST_START',
  TEST_SELECTION: 'TEST_SELECTION',
  TEST_ORDER: 'TEST_ORDER',
  TEST_COMPLETE: 'TEST_COMPLETE',
  NAVIGATION: 'NAVIGATION'
};