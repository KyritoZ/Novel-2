import type { StoryFormat, StoryLength, DigitalLayout } from "./types";

export interface StoryDraft {
  id: string;
  version: string;
  step1?: {
    storyType?: string;
    genre?: string;
    feel?: string;
    custom?: string;
  };
  step2?: {
    name?: string;
    role?: string;
    goal?: string;
    fear?: string;
    vibeTags?: string[];
  };
  step3?: {
    problemTemplate?: string;
    customProblem?: string;
  };
  step4?: {
    emotions?: string[];
    intensity?: number;
  };
  step5?: {
    length?: StoryLength;
    format?: StoryFormat;
    layout?: DigitalLayout;
    custom?: string;
  };
  outline?: {
    beginning?: string;
    middle?: string;
    end?: string;
    beats?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_V1 = "gnt.storyDraft.v1";
const STORAGE_KEY_V2 = "gnt.storyDraft.v2";

// Normalize old format values to new types
function normalizeFormat(value: string | undefined): StoryFormat | undefined {
  if (!value) return undefined;
  if (value === "digital" || value === "print") return value;
  // Old values that should map to digital
  if (["oneshot", "short", "series", "webtoon"].includes(value)) return "digital";
  if (value === "print-first") return "print";
  return "digital"; // default fallback
}

function normalizeLength(value: string | undefined): StoryLength | undefined {
  if (!value) return undefined;
  if (["oneshot", "short", "graphic-novel", "series"].includes(value)) {
    return value as StoryLength;
  }
  // Map old values
  if (value === "print-first") return "graphic-novel";
  if (value === "webtoon") return "series";
  return undefined;
}

function normalizeLayout(value: string | undefined, length?: string): DigitalLayout | undefined {
  if (value === "pages" || value === "webtoon") return value;
  // Infer from old length values
  if (length === "webtoon") return "webtoon";
  return undefined;
}

// Repair Step 5: ensure webtoon layout has series length
function repairStep5(draft: StoryDraft): void {
  if (!draft.step5) return;
  
  // If layout is webtoon but length is missing, set length to series
  if (draft.step5.layout === "webtoon" && !draft.step5.length) {
    draft.step5.length = "series";
  }
}

export function loadDraft(): StoryDraft | null {
  if (typeof window === "undefined") return null;
  try {
    // Try v2 first
    let stored = localStorage.getItem(STORAGE_KEY_V2);
    if (stored) {
      const draft = JSON.parse(stored) as StoryDraft;
      // Normalize to ensure type safety
      if (draft.step5) {
        draft.step5.format = normalizeFormat(draft.step5.format);
        draft.step5.length = normalizeLength(draft.step5.length);
        draft.step5.layout = normalizeLayout(draft.step5.layout, draft.step5.length);
        // Repair: ensure webtoon layout has series length
        repairStep5(draft);
      }
      return draft;
    }
    
    // Migrate from v1 if it exists
    stored = localStorage.getItem(STORAGE_KEY_V1);
    if (stored) {
      const oldDraft = JSON.parse(stored) as StoryDraft;
      // Normalize old format
      if (oldDraft.step5) {
        const oldFormat = oldDraft.step5.format || oldDraft.step5.length;
        const oldLength = oldDraft.step5.length;
        
        oldDraft.step5.format = normalizeFormat(oldFormat);
        oldDraft.step5.length = normalizeLength(oldLength);
        oldDraft.step5.layout = normalizeLayout(oldDraft.step5.layout, oldLength);
        
        // Remove invalid format if it was the same as length
        if (oldDraft.step5.format === oldDraft.step5.length) {
          oldDraft.step5.length = normalizeLength(oldLength);
        }
        
        // Repair: ensure webtoon layout has series length
        repairStep5(oldDraft);
      }
      
      oldDraft.version = "2.0";
      // Save as v2 and remove v1
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(oldDraft));
      localStorage.removeItem(STORAGE_KEY_V1);
      return oldDraft;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: StoryDraft): void {
  if (typeof window === "undefined") return;
  try {
    draft.updatedAt = new Date().toISOString();
    draft.version = "2.0";
    // Normalize before saving
    if (draft.step5) {
      draft.step5.format = normalizeFormat(draft.step5.format);
      draft.step5.length = normalizeLength(draft.step5.length);
      draft.step5.layout = normalizeLayout(draft.step5.layout, draft.step5.length);
      // Repair: ensure webtoon layout has series length
      repairStep5(draft);
    }
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(draft));
    // Clean up old v1 if it exists
    localStorage.removeItem(STORAGE_KEY_V1);
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_V1);
    localStorage.removeItem(STORAGE_KEY_V2);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

export function createDraft(): StoryDraft {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    version: "2.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

