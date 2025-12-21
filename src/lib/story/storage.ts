import type { Character, Location, Scene, Story, Thread } from "./types";

const STORAGE_KEY = "gnt_storyDraft_v1";

export interface StoryDraft {
  story: Story;
  characters: Character[];
  scenes: Scene[];
  threads: Thread[];
  locations: Location[];
}

export function saveStoryDraft(draft: StoryDraft): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadStoryDraft(): StoryDraft | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as StoryDraft;
    if (!parsed || !parsed.story) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearStoryDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
