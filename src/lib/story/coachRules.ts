import {
  Character,
  CoachCard,
  Location,
  Scene,
  Story,
  Thread,
} from "./types";

interface CoachContext {
  characters: Character[];
  scenes: Scene[];
  threads: Thread[];
  locations: Location[];
}

export function generateCoachCards(
  story: Story,
  ctx: CoachContext,
): CoachCard[] {
  const cards: CoachCard[] = [];

  const noCharacters = ctx.characters.length === 0;
  if (noCharacters) {
    cards.push({
      id: "story-no-characters",
      type: "question",
      engine: "Character",
      title: "Who is this story about?",
      message:
        "Start with the people. Add at least one protagonist so goals and stakes are clear.",
      options: ["One protagonist", "Ensemble cast"],
      actions: ["Add protagonist", "Define their goal"],
      appliesTo: { type: "story", id: story.id },
      priority: "high",
    });
  }

  const protagonistFlawOptions = [
    "Overconfidence that blinds them to risks",
    "Trust issues that keep allies at arm's length",
    "Impatience that triggers reckless shortcuts",
    "Guilt that derails focus when stakes rise",
    "Obsession that overrides healthier choices",
  ];

  ctx.characters
    .filter((character) => character.role === "protagonist")
    .filter((character) => character.goal && !character.flaw)
    .forEach((character) => {
      cards.push({
        id: `protagonist-flaw-${character.id}`,
        type: "suggestion",
        engine: "Character",
        title: `${character.name} has a goal but no flaw yet`,
        message:
          "Pick a flaw that collides with their goal to create tension and growth.",
        options: protagonistFlawOptions,
        actions: ["Choose a flaw", "Show how it complicates the goal"],
        appliesTo: { type: "character", id: character.id },
        priority: "medium",
      });
    });

  const scenesWithObstacles = ctx.scenes.filter((scene) => Boolean(scene.obstacle));
  if (ctx.scenes.length >= 3 && scenesWithObstacles.length === 0) {
    cards.push({
      id: "scenes-add-obstacles",
      type: "suggestion",
      engine: "Plot",
      title: "Scenes need obstacles",
      message:
        "You have momentum, but the scenes lack obstacles. Add friction so choices matter.",
      options: [
        "Gatekeeper blocks progress until a price is paid",
        "Resource loss forces a detour",
        "Ally disagreement splits the path",
        "Hidden timer reveals a looming deadline",
        "Misinformation triggers a risky decision",
      ],
      actions: ["Mark at least one obstacle", "Show its fallout in the next scene"],
      appliesTo: { type: "story", id: story.id },
      priority: "medium",
    });
  }

  return cards;
}
