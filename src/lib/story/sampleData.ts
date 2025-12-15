import { generateCoachCards } from "./coachRules";
import { Character, Location, Scene, Story, Thread } from "./types";

const story: Story = {
  id: "story-001",
  title: "Beacon Over Gallow Harbor",
  mode: "guided",
  format: "digital",
  emotionPalette: ["hope", "dread", "determination"],
  sensitivityLevel: "all-ages",
};

const characters: Character[] = [
  {
    id: "char-aurora",
    name: "Aurora Hale",
    role: "protagonist",
    goal: "Reignite the harbor beacon to protect incoming ships",
    strength: "Mechanical intuition and stubborn optimism",
    fear: "Letting the town down when the storms arrive",
    secret: "She broke the beacon once by ignoring safety protocols",
  },
  {
    id: "char-corbin",
    name: "Corbin Lark",
    role: "supporting",
    goal: "Keep the smugglers away from the supply routes",
    flaw: "Keeps secrets that erode trust",
    strength: "Streetwise and quick with contingency plans",
  },
];

const locations: Location[] = [
  {
    id: "loc-tower",
    name: "Signal Tower",
    notes: "Wind-scoured tower with rusted gears and limited power.",
    rules: ["Noise at night draws patrol drones", "No heavy equipment past the stairwell"],
  },
];

const threads: Thread[] = [
  {
    id: "thread-beacon",
    name: "Beacon Restoration",
    type: "plot",
    status: "open",
  },
];

const scenes: Scene[] = [
  {
    id: "scene-1",
    title: "Survey the Ruined Beacon",
    summary: "Aurora inspects the broken light while Corbin warns of patrol routes.",
    characterIds: ["char-aurora", "char-corbin"],
    locationId: "loc-tower",
    emotionalBeat: "resolve",
  },
  {
    id: "scene-2",
    title: "Storm Front Looms",
    summary: "Clouds gather as the town questions if the beacon will ever shine again.",
    characterIds: ["char-aurora"],
    locationId: "loc-tower",
    change: "A deadline emerges with the incoming storm.",
    emotionalBeat: "pressure",
  },
  {
    id: "scene-3",
    title: "A Rusted Gear Gives Way",
    summary: "The mechanism seizes just as power returns, threatening to snap the shaft.",
    characterIds: ["char-aurora", "char-corbin"],
    locationId: "loc-tower",
    change: "Repair attempt stalls at the worst moment.",
    emotionalBeat: "urgency",
  },
];

export const sampleStory = story;
export const sampleCharacters = characters;
export const sampleLocations = locations;
export const sampleThreads = threads;
export const sampleScenes = scenes;

export const sampleCoachCards = generateCoachCards(story, {
  characters,
  scenes,
  threads,
  locations,
});
