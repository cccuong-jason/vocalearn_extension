// src/infrastructure/services/indexeddb-storage-service.ts
import { StorageService } from '../../core/domain/ports/storage-service';
import { VocabularyWord } from '../../core/domain/models/vocabulary';

export class IndexedDBStorageService implements StorageService {
  private readonly DB_NAME = 'vocalearn';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'vocabulary';
  
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for vocabulary words
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('word', 'word', { unique: false });
          store.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
      };
    });
  }
  
  async saveWord(word: VocabularyWord): Promise<VocabularyWord> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      // Check if word already exists (if it has an ID)
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      if (word.id) {
        // Update existing word
        const updateRequest = store.put(word);
        
        updateRequest.onsuccess = () => {
          resolve(word);
        };
        
        updateRequest.onerror = () => {
          reject(new Error('Error updating word'));
        };
      } else {
        // Check if the word text already exists
        const wordIndex = store.index('word');
        const request = wordIndex.getAll(word.word);
        
        request.onsuccess = (event) => {
          const matches = (event.target as IDBRequest).result as VocabularyWord[];
          
          if (matches.length > 0) {
            // Update existing word
            const existingWord = matches[0];
            const updatedWord: VocabularyWord = {
              ...existingWord,
              translation: word.translation,
              notes: word.notes,
              lastReviewed: new Date().toISOString()
            };
            
            const updateRequest = store.put(updatedWord);
            
            updateRequest.onsuccess = () => {
              resolve(updatedWord);
            };
            
            updateRequest.onerror = () => {
              reject(new Error('Error updating word'));
            };
          } else {
            // Add new word
            const addRequest = store.add(word);
            
            addRequest.onsuccess = (event) => {
              const newWord = { ...word, id: (event.target as IDBRequest).result as number };
              resolve(newWord);
            };
            
            addRequest.onerror = () => {
              reject(new Error('Error adding word'));
            };
          }
        };
      }
    });
  }
  
  async getWords(): Promise<VocabularyWord[]> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as VocabularyWord[]);
      };
      
      request.onerror = () => {
        reject(new Error('Error fetching words'));
      };
    });
  }
  
  async getWordById(id: number): Promise<VocabularyWord | null> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result as VocabularyWord;
        resolve(result || null);
      };
      
      request.onerror = () => {
        reject(new Error('Error fetching word'));
      };
    });
  }
  
  async deleteWord(id: number): Promise<boolean> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = () => {
        reject(new Error('Error deleting word'));
      };
    });
  }
  
  async searchWords(query: string): Promise<VocabularyWord[]> {
    const words = await this.getWords();
    const lowerQuery = query.toLowerCase();
    
    return words.filter(word => 
      word.word.toLowerCase().includes(lowerQuery) || 
      word.translation.toLowerCase().includes(lowerQuery) ||
      word.notes.toLowerCase().includes(lowerQuery)
    );
  }
}