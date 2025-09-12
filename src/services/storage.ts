import { Fine } from '../types';

export interface StorageService {
  loadFines(): Promise<Fine[]>;
  saveFines(fines: Fine[]): Promise<void>;
  addFine(fine: Fine): Promise<Fine>;
  updateFine(id: string, updates: Partial<Fine>): Promise<Fine>;
  deleteFine(id: string): Promise<void>;
  isOnline(): boolean;
}

// Local Storage Implementation (Offline)
export class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'finetrack-fines';

  async loadFines(): Promise<Fine[]> {
    try {
      const savedFines = localStorage.getItem(this.STORAGE_KEY);
      return savedFines ? JSON.parse(savedFines) : [];
    } catch (error) {
      console.error('Error loading fines from localStorage:', error);
      return [];
    }
  }

  async saveFines(fines: Fine[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fines));
    } catch (error) {
      console.error('Error saving fines to localStorage:', error);
      throw new Error('Failed to save fines offline');
    }
  }

  async addFine(fine: Fine): Promise<Fine> {
    const fines = await this.loadFines();
    fines.push(fine);
    await this.saveFines(fines);
    return fine;
  }

  async updateFine(id: string, updates: Partial<Fine>): Promise<Fine> {
    const fines = await this.loadFines();
    const index = fines.findIndex(fine => fine.id === id);
    
    if (index === -1) {
      throw new Error(`Fine with id ${id} not found`);
    }

    const updatedFine = { ...fines[index], ...updates };
    fines[index] = updatedFine;
    await this.saveFines(fines);
    return updatedFine;
  }

  async deleteFine(id: string): Promise<void> {
    const fines = await this.loadFines();
    const filteredFines = fines.filter(fine => fine.id !== id);
    await this.saveFines(filteredFines);
  }

  isOnline(): boolean {
    return false; // Local storage is always "offline"
  }
}

// Database Implementation (Online) - Ready for future use
export class DatabaseService implements StorageService {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string, apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }

  async loadFines(): Promise<Fine[]> {
    try {
      const response = await fetch(`${this.apiUrl}/fines`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error loading fines from database:', error);
      throw new Error('Failed to load fines from server');
    }
  }

  async saveFines(_fines: Fine[]): Promise<void> {
    // For database implementation, we might not need this bulk save method
    // Individual operations (add, update, delete) are preferred
    throw new Error('Bulk save not implemented for database service');
  }

  async addFine(fine: Fine): Promise<Fine> {
    try {
      const response = await fetch(`${this.apiUrl}/fines`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(fine),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding fine to database:', error);
      throw new Error('Failed to add fine to server');
    }
  }

  async updateFine(id: string, updates: Partial<Fine>): Promise<Fine> {
    try {
      const response = await fetch(`${this.apiUrl}/fines/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating fine in database:', error);
      throw new Error('Failed to update fine on server');
    }
  }

  async deleteFine(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/fines/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting fine from database:', error);
      throw new Error('Failed to delete fine from server');
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

// Hybrid Storage Service (Offline-first with sync)
export class HybridStorageService implements StorageService {
  private localService: LocalStorageService;
  private databaseService: DatabaseService;
  private syncQueue: Array<{ operation: string; data: any }> = [];

  constructor(apiUrl: string, apiKey?: string) {
    this.localService = new LocalStorageService();
    this.databaseService = new DatabaseService(apiUrl, apiKey);
    this.loadSyncQueue();
  }

  private loadSyncQueue() {
    try {
      const queue = localStorage.getItem('finetrack-sync-queue');
      this.syncQueue = queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  private saveSyncQueue() {
    try {
      localStorage.setItem('finetrack-sync-queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  private addToSyncQueue(operation: string, data: any) {
    this.syncQueue.push({ operation, data });
    this.saveSyncQueue();
  }

  async syncWithServer(): Promise<void> {
    if (!navigator.onLine || this.syncQueue.length === 0) {
      return;
    }

    const failedOperations = [];

    for (const item of this.syncQueue) {
      try {
        switch (item.operation) {
          case 'add':
            await this.databaseService.addFine(item.data);
            break;
          case 'update':
            await this.databaseService.updateFine(item.data.id, item.data.updates);
            break;
          case 'delete':
            await this.databaseService.deleteFine(item.data.id);
            break;
        }
      } catch (error) {
        console.error('Sync operation failed:', error);
        failedOperations.push(item);
      }
    }

    this.syncQueue = failedOperations;
    this.saveSyncQueue();
  }

  async loadFines(): Promise<Fine[]> {
    try {
      if (navigator.onLine) {
        // Try to load from server first
        const serverFines = await this.databaseService.loadFines();
        // Update local storage with server data
        await this.localService.saveFines(serverFines);
        return serverFines;
      }
    } catch (error) {
      console.warn('Failed to load from server, using local data:', error);
    }

    // Fallback to local storage
    return await this.localService.loadFines();
  }

  async saveFines(fines: Fine[]): Promise<void> {
    // Always save locally first
    await this.localService.saveFines(fines);

    if (navigator.onLine) {
      try {
        // Try to sync individual operations instead of bulk save
        await this.syncWithServer();
      } catch (error) {
        console.warn('Failed to sync with server:', error);
      }
    }
  }

  async addFine(fine: Fine): Promise<Fine> {
    // Always save locally first
    const savedFine = await this.localService.addFine(fine);

    if (navigator.onLine) {
      try {
        await this.databaseService.addFine(fine);
      } catch (error) {
        console.warn('Failed to add fine to server, queuing for sync:', error);
        this.addToSyncQueue('add', fine);
      }
    } else {
      this.addToSyncQueue('add', fine);
    }

    return savedFine;
  }

  async updateFine(id: string, updates: Partial<Fine>): Promise<Fine> {
    // Always update locally first
    const updatedFine = await this.localService.updateFine(id, updates);

    if (navigator.onLine) {
      try {
        await this.databaseService.updateFine(id, updates);
      } catch (error) {
        console.warn('Failed to update fine on server, queuing for sync:', error);
        this.addToSyncQueue('update', { id, updates });
      }
    } else {
      this.addToSyncQueue('update', { id, updates });
    }

    return updatedFine;
  }

  async deleteFine(id: string): Promise<void> {
    // Always delete locally first
    await this.localService.deleteFine(id);

    if (navigator.onLine) {
      try {
        await this.databaseService.deleteFine(id);
      } catch (error) {
        console.warn('Failed to delete fine from server, queuing for sync:', error);
        this.addToSyncQueue('delete', { id });
      }
    } else {
      this.addToSyncQueue('delete', { id });
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

// Storage factory to create the appropriate service
export function createStorageService(): StorageService {
  const config = {
    // You can change this to switch storage modes
    mode: 'local' as 'local' | 'database' | 'hybrid',
    apiUrl: 'https://your-api-url.com/api', // Will be configurable later
    apiKey: undefined as string | undefined,
  };

  switch (config.mode) {
    case 'database':
      return new DatabaseService(config.apiUrl, config.apiKey);
    case 'hybrid':
      return new HybridStorageService(config.apiUrl, config.apiKey);
    case 'local':
    default:
      return new LocalStorageService();
  }
}
