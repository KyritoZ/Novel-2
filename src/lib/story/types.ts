export type StoryMode = "guided" | "sandbox" | "inspiration";

export type StoryFormat = "digital" | "print";

export interface Story {
  id: string;
  title: string;
  mode: StoryMode;
  format: StoryFormat;
  emotionPalette: string[];
  sensitivityLevel: "all-ages" | "teen" | "mature";
}

export type CharacterRole =
  | "protagonist"
  | "antagonist"
  | "supporting"
  | "ensemble";

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  goal?: string;
  fear?: string;
  flaw?: string;
  strength?: string;
  secret?: string;
}

export interface Location {
  id: string;
  name: string;
  notes?: string;
  rules?: string[];
}

export interface Thread {
  id: string;
  name: string;
  type: "character" | "plot" | "world" | "emotion";
  status: "open" | "at-risk" | "resolved";
}

export interface Scene {
  id: string;
  title: string;
  summary: string;
  characterIds: string[];
  locationId?: string;
  obstacle?: string;
  change?: string;
  emotionalBeat?: string;
}

export interface CoachCard {
  id: string;
  type: "question" | "warning" | "suggestion";
  engine: "Character" | "World" | "Plot" | "Emotion";
  title: string;
  message: string;
  actions: string[];
  options?: string[];
  appliesTo:
    | { type: "story"; id?: string }
    | { type: "character"; id: string }
    | { type: "scene"; id: string }
    | { type: "thread"; id: string };
  priority: "low" | "medium" | "high";
}
