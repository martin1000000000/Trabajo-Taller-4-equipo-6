'use client';
import { useCallback } from 'react';

export function useLogger() {
  const logAction = useCallback(async (actionData) => {
    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) {
        console.error('Error al registrar log');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error de red al registrar log:', error);
      return false;
    }
  }, []);

  return { logAction };
}