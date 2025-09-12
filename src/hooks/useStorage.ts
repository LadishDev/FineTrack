import { useState, useEffect, useCallback } from 'react';
import { Fine } from '../types';
import { StorageService, createStorageService } from '../services/storage';

export function useStorage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageService] = useState<StorageService>(() => createStorageService());

  // Load fines on initialization
  useEffect(() => {
    const loadFines = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedFines = await storageService.loadFines();
        setFines(loadedFines);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fines');
        console.error('Error loading fines:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFines();
  }, [storageService]);

  // Add a new fine
  const addFine = useCallback(async (fine: Omit<Fine, 'id'>) => {
    try {
      setError(null);
      const newFine: Fine = {
        ...fine,
        id: Date.now().toString(), // Generate ID locally
      };
      
      await storageService.addFine(newFine);
      setFines(prev => [...prev, newFine]);
      return newFine;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add fine';
      setError(errorMessage);
      console.error('Error adding fine:', err);
      throw new Error(errorMessage);
    }
  }, [storageService]);

  // Update an existing fine
  const updateFine = useCallback(async (id: string, updates: Partial<Fine>) => {
    try {
      setError(null);
      const updatedFine = await storageService.updateFine(id, updates);
      setFines(prev => prev.map(fine => 
        fine.id === id ? updatedFine : fine
      ));
      return updatedFine;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update fine';
      setError(errorMessage);
      console.error('Error updating fine:', err);
      throw new Error(errorMessage);
    }
  }, [storageService]);

  // Delete a fine
  const deleteFine = useCallback(async (id: string) => {
    try {
      setError(null);
      await storageService.deleteFine(id);
      setFines(prev => prev.filter(fine => fine.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete fine';
      setError(errorMessage);
      console.error('Error deleting fine:', err);
      throw new Error(errorMessage);
    }
  }, [storageService]);

  // Manual sync (useful for hybrid mode)
  const syncData = useCallback(async () => {
    if ('syncWithServer' in storageService) {
      try {
        setError(null);
        await (storageService as any).syncWithServer();
        // Reload fines after sync
        const syncedFines = await storageService.loadFines();
        setFines(syncedFines);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync data';
        setError(errorMessage);
        console.error('Error syncing data:', err);
      }
    }
  }, [storageService]);

  // Check if storage is online
  const isOnline = useCallback(() => {
    return storageService.isOnline();
  }, [storageService]);

  return {
    fines,
    loading,
    error,
    addFine,
    updateFine,
    deleteFine,
    syncData,
    isOnline,
    clearError: () => setError(null),
  };
}
