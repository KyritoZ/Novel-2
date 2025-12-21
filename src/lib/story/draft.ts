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
    length?: string;
    format?: string;
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

const STORAGE_KEY = "gnt.storyDraft.v1";

export function loadDraft(): StoryDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoryDraft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: StoryDraft): void {
  if (typeof window === "undefined") return;
  try {
    draft.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

export function createDraft(): StoryDraft {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    version: "1.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

