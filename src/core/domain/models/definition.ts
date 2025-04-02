// src/core/domain/models/definition.ts
export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
}