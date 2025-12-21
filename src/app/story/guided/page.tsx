"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { generateCoachCards } from "@/lib/story/coachRules";
import type { Character, Location, Scene, Story, Thread } from "@/lib/story/types";
import { clearStoryDraft, saveStoryDraft } from "@/lib/story/storage";

const storyTypes = [
  "personal",
  "fantasy",
  "romance",
  "mystery",
  "slice of life",
  "other",
] as const;

const vibes = ["hopeful", "angry", "shy", "chaotic"] as const;

const ageGroups = ["kid", "teen", "adult", "elder"] as const;

const problemTemplates = [
  "Loss: someone or something important is gone.",
  "Desire: they want something they can't easily reach.",
  "Injustice: the rules are stacked against them.",
  "Mystery: a secret threatens their world.",
  "Change: a sudden shift forces them to adapt.",
];

const emotions = [
  "love",
  "fear",
  "wonder",
  "rage",
  "sadness",
  "humor",
  "heroic",
  "peaceful",
] as const;

const lengthOptions = [
  "short story",
  "one-shot",
  "full graphic novel",
  "ongoing series",
] as const;

const formatOptions = [
  { label: "print pages", value: "print" },
  { label: "webtoon vertical", value: "digital" },
  { label: "both", value: "digital" },
] as const;

type StepId = "type" | "about" | "problem" | "emotion" | "format" | "finish";

const steps: { id: StepId; label: string }[] = [
  { id: "type", label: "Story type" },
  { id: "about", label: "Who is it about" },
  { id: "problem", label: "Core problem" },
  { id: "emotion", label: "Emotional palette" },
  { id: "format", label: "Length & format" },
  { id: "finish", label: "Finish" },
];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function GuidedStoryPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [storyType, setStoryType] = useState<(typeof storyTypes)[number]>(
    "personal",
  );
  const [customStoryType, setCustomStoryType] = useState("");

  const [castType, setCastType] = useState<"protagonist" | "ensemble">(
    "protagonist",
  );
  const [protagonistName, setProtagonistName] = useState("");
  const [protagonistVibe, setProtagonistVibe] = useState(
    vibes[0] as (typeof vibes)[number],
  );
  const [protagonistAge, setProtagonistAge] = useState(
    ageGroups[1] as (typeof ageGroups)[number],
  );

  const [coreProblem, setCoreProblem] = useState("");

  const [emotionPalette, setEmotionPalette] = useState<string[]>([emotions[0]]);

  const [lengthChoice, setLengthChoice] = useState(
    lengthOptions[0] as (typeof lengthOptions)[number],
  );
  const [formatChoice, setFormatChoice] = useState(
    formatOptions[0].value,
  );

  const [hasSaved, setHasSaved] = useState(false);

  const currentStep = steps[activeStepIndex]?.id ?? "type";

  const displayStoryType =
    storyType === "other" && customStoryType.trim().length > 0
      ? customStoryType.trim()
      : storyType;

  const draftStory = useMemo<Story>(() => {
    return {
      id: "draft-story",
      title: `Untitled ${displayStoryType} story`,
      mode: "guided",
      format: formatChoice === "print" ? "print" : "digital",
      emotionPalette,
      sensitivityLevel: "all-ages",
    };
  }, [displayStoryType, emotionPalette, formatChoice]);

  const draftCharacters = useMemo<Character[]>(() => {
    if (castType === "ensemble") {
      return [
        {
          id: "draft-ensemble",
          name: protagonistName.trim() || "Ensemble cast",
          role: "ensemble",
          goal: coreProblem.trim() || "Define what the ensemble is up against.",
          strength: `Shared vibe: ${protagonistVibe}.`,
        },
      ];
    }
    return [
      {
        id: "draft-protagonist",
        name: protagonistName.trim() || "Protagonist",
        role: "protagonist",
        goal: coreProblem.trim() || "Define the goal that drives them.",
        strength: `${protagonistVibe} energy (${protagonistAge})`,
        fear: `Facing ${coreProblem.trim() || "their core problem"}`,
      },
    ];
  }, [castType, coreProblem, protagonistName, protagonistVibe]);

  const draftScenes = useMemo<Scene[]>(() => {
    if (!coreProblem.trim() && !protagonistName.trim()) {
      return [];
    }
    const name = protagonistName.trim() || "the protagonist";
    const problem = coreProblem.trim() || "their core challenge";
    return [
      {
        id: "outline-beginning",
        title: "Beginning",
        summary: `Introduce ${name} in a ${displayStoryType} world. Show ${problem} emerging and why it matters.`,
        characterIds: [draftCharacters[0]?.id ?? ""],
        emotionalBeat: emotionPalette[0] ?? "",
      },
      {
        id: "outline-middle",
        title: "Middle",
        summary: `Complicate ${problem}. Raise stakes in a ${lengthChoice} structure and test ${name}'s ${protagonistVibe} vibe.`,
        characterIds: [draftCharacters[0]?.id ?? ""],
        emotionalBeat: emotionPalette[1] ?? emotionPalette[0] ?? "",
      },
      {
        id: "outline-end",
        title: "End",
        summary: `Resolve or transform ${problem}. Land on an ending suited for ${lengthChoice} with a ${formatChoice} format in mind.`,
        characterIds: [draftCharacters[0]?.id ?? ""],
        emotionalBeat: emotionPalette[0] ?? "",
      },
    ];
  }, [
    coreProblem,
    protagonistName,
    displayStoryType,
    draftCharacters,
    emotionPalette,
    lengthChoice,
    protagonistVibe,
    formatChoice,
  ]);

  const draftThreads = useMemo<Thread[]>(() => {
    if (!coreProblem.trim()) {
      return [];
    }
    return [
      {
        id: "thread-core-problem",
        name: coreProblem.trim().slice(0, 48),
        type: "plot",
        status: "open",
      },
    ];
  }, [coreProblem]);

  const draftLocations = useMemo<Location[]>(() => [], []);

  const coachCards = useMemo(() => {
    return generateCoachCards(draftStory, {
      characters: draftCharacters,
      scenes: draftScenes,
      threads: draftThreads,
      locations: draftLocations,
    });
  }, [draftStory, draftCharacters, draftScenes, draftThreads, draftLocations]);

  function goNext() {
    setActiveStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function goBack() {
    setActiveStepIndex((index) => Math.max(index - 1, 0));
  }

  function toggleEmotion(value: string) {
    setEmotionPalette((current) => {
      if (current.includes(value)) {
        return current.filter((emotion) => emotion !== value);
      }
      if (current.length >= 2) {
        return current;
      }
      return [...current, value];
    });
  }

  function handleSaveDraft() {
    const draftStoryFinal: Story = {
      ...draftStory,
      id: createId("story"),
    };

    const protagonistRole = castType === "ensemble" ? "ensemble" : "protagonist";
    const characterName = protagonistName.trim() ||
      (castType === "ensemble" ? "Ensemble cast" : "Protagonist");

    const characters: Character[] = [
      {
        id: createId("character"),
        name: characterName,
        role: protagonistRole,
        goal: coreProblem.trim() || "Define what drives them.",
        strength: `Vibe: ${protagonistVibe} (${protagonistAge})`,
        fear: `Facing ${coreProblem.trim() || "their core problem"}`,
      },
    ];

    const scenes: Scene[] = draftScenes.map((scene, index) => ({
      ...scene,
      id: createId(`outline-${index + 1}`),
      characterIds: [characters[0].id],
    }));

    const threads: Thread[] = coreProblem.trim()
      ? [
          {
            id: createId("thread"),
            name: coreProblem.trim().slice(0, 64),
            type: "plot",
            status: "open",
          },
        ]
      : [];

    saveStoryDraft({
      story: draftStoryFinal,
      characters,
      scenes,
      threads,
      locations: [],
    });

    setHasSaved(true);
  }

  function handleStartOver() {
    clearStoryDraft();
    setHasSaved(false);
    setActiveStepIndex(0);
  }

  return (
    <main className="studio-page">
      <div className="studio-shell">
        <header className="studio-header">
          <p className="eyebrow">Guided Story Mode</p>
          <h1>Build your story foundation step by step.</h1>
          <p className="lede">
            Answer a few questions to shape your story graph. Suggestions stay
            optional, and you stay in control.
          </p>
        </header>

        <section className="wizard-layout">
          <div className="panel">
            <div className="wizard-progress">
              <span>
                Step {activeStepIndex + 1} of {steps.length}
              </span>
              <div className="wizard-steps">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`wizard-step ${index <= activeStepIndex ? "active" : ""}`}
                  >
                    {step.label}
                  </div>
                ))}
              </div>
            </div>

            {currentStep === "type" && (
              <div className="studio-grid">
                <h2>What kind of story are you telling?</h2>
                <div className="option-grid">
                  {storyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`studio-tab ${storyType === type ? "active" : ""}`}
                      onClick={() => setStoryType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {storyType === "other" && (
                  <div className="form-group">
                    <label htmlFor="custom-story-type">Custom story type</label>
                    <input
                      id="custom-story-type"
                      className="input"
                      value={customStoryType}
                      onChange={(event) => setCustomStoryType(event.target.value)}
                      placeholder="Describe your story type"
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === "about" && (
              <div className="studio-grid">
                <h2>Who is it about?</h2>
                <div className="option-grid">
                  <button
                    type="button"
                    className={`studio-tab ${castType === "protagonist" ? "active" : ""}`}
                    onClick={() => setCastType("protagonist")}
                  >
                    One protagonist
                  </button>
                  <button
                    type="button"
                    className={`studio-tab ${castType === "ensemble" ? "active" : ""}`}
                    onClick={() => setCastType("ensemble")}
                  >
                    Ensemble
                  </button>
                </div>
                {castType === "protagonist" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="protagonist-name">Protagonist name</label>
                      <input
                        id="protagonist-name"
                        className="input"
                        value={protagonistName}
                        onChange={(event) => setProtagonistName(event.target.value)}
                        placeholder="Give them a name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Vibe</label>
                      <div className="option-grid">
                        {vibes.map((vibe) => (
                          <button
                            key={vibe}
                            type="button"
                            className={`studio-tab ${protagonistVibe === vibe ? "active" : ""}`}
                            onClick={() => setProtagonistVibe(vibe)}
                          >
                            {vibe}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Age group</label>
                      <div className="option-grid">
                        {ageGroups.map((age) => (
                          <button
                            key={age}
                            type="button"
                            className={`studio-tab ${protagonistAge === age ? "active" : ""}`}
                            onClick={() => setProtagonistAge(age)}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === "problem" && (
              <div className="studio-grid">
                <h2>What's the core problem?</h2>
                <div className="option-grid">
                  {problemTemplates.map((template) => (
                    <button
                      key={template}
                      type="button"
                      className="studio-tab"
                      onClick={() => setCoreProblem(template)}
                    >
                      {template}
                    </button>
                  ))}
                </div>
                <div className="form-group">
                  <label htmlFor="core-problem">Core problem</label>
                  <textarea
                    id="core-problem"
                    className="input"
                    value={coreProblem}
                    onChange={(event) => setCoreProblem(event.target.value)}
                    rows={4}
                    placeholder="Describe the central challenge"
                  />
                </div>
              </div>
            )}

            {currentStep === "emotion" && (
              <div className="studio-grid">
                <h2>Pick 1–2 primary emotions.</h2>
                <div className="option-grid">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      type="button"
                      className={`studio-tab ${emotionPalette.includes(emotion) ? "active" : ""}`}
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
                <p className="lede">Selected: {emotionPalette.join(", ")}</p>
              </div>
            )}

            {currentStep === "format" && (
              <div className="studio-grid">
                <h2>Choose length and format.</h2>
                <div className="form-group">
                  <label>Length</label>
                  <div className="option-grid">
                    {lengthOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`studio-tab ${lengthChoice === option ? "active" : ""}`}
                        onClick={() => setLengthChoice(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Output format</label>
                  <div className="option-grid">
                    {formatOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className={`studio-tab ${formatChoice === option.value ? "active" : ""}`}
                        onClick={() => setFormatChoice(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "finish" && (
              <div className="studio-grid">
                <h2>Ready to save your draft?</h2>
                <p className="lede">
                  We'll save your story basics, protagonist, and an outline skeleton
                  so you can keep building in Sandbox mode.
                </p>
                <button
                  type="button"
                  className="button"
                  onClick={handleSaveDraft}
                >
                  Save draft
                </button>
                {hasSaved && (
                  <div className="wizard-actions">
                    <Link className="button" href="/story">
                      Open Sandbox
                    </Link>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={handleStartOver}
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="wizard-actions">
              <button
                type="button"
                className="button secondary"
                onClick={goBack}
                disabled={activeStepIndex === 0}
              >
                Back
              </button>
              <button
                type="button"
                className="button"
                onClick={goNext}
                disabled={activeStepIndex === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <aside className="panel">
            <h2>Coach Cards</h2>
            {coachCards.length === 0 ? (
              <div className="gallery-empty">
                <p className="lede">
                  Keep going to unlock coaching tips based on your draft.
                </p>
              </div>
            ) : (
              <div className="coach-grid">
                {coachCards.map((card) => (
                  <div key={card.id} className="coach-card">
                    <p className="eyebrow">
                      {card.engine} · {card.type}
                    </p>
                    <h3>{card.title}</h3>
                    <p className="lede">{card.message}</p>
                    {card.options && (
                      <ul>
                        {card.options.map((option) => (
                          <li key={option}>{option}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
