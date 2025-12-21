"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  clearDraft,
  createDraft,
  loadDraft,
  saveDraft,
  type StoryDraft,
} from "@/lib/story/draft";
import { generateCoachCards } from "@/lib/story/coachRules";
import type {
  CoachCard,
  Character,
  Story,
  StoryLength,
  StoryFormat,
  DigitalLayout,
} from "@/lib/story/types";

const STORY_TYPES = [
  "Adventure",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Slice of Life",
  "Comedy",
  "Drama",
  "Thriller",
];

const GENRES = [
  "Superhero",
  "Mecha",
  "Magical Girl",
  "Isekai",
  "Cyberpunk",
  "Steampunk",
  "Historical",
  "Contemporary",
  "Post-Apocalyptic",
  "Urban Fantasy",
];

const FEELS = [
  "Hopeful",
  "Dark",
  "Whimsical",
  "Gritty",
  "Epic",
  "Intimate",
  "Mysterious",
  "Action-Packed",
  "Thoughtful",
  "Fast-Paced",
];

const PROBLEM_TEMPLATES = [
  "Someone must stop a threat before time runs out",
  "A secret must be uncovered to save what matters",
  "A relationship must be mended or lost forever",
  "A choice must be made between two impossible paths",
  "A quest must be completed despite overwhelming odds",
  "A truth must be faced that changes everything",
];

const EMOTIONS = [
  "Hope",
  "Fear",
  "Joy",
  "Anger",
  "Sadness",
  "Love",
  "Determination",
  "Doubt",
  "Excitement",
  "Dread",
  "Relief",
  "Despair",
  "Curiosity",
  "Betrayal",
  "Forgiveness",
];

const LENGTH_FORMATS: Array<{
  label: string;
  length: StoryLength;
  format: StoryFormat;
  layout?: DigitalLayout;
}> = [
  { label: "One-Shot", length: "oneshot", format: "digital", layout: "pages" },
  { label: "Short (3-10 pages)", length: "short", format: "digital", layout: "pages" },
  { label: "Series (multi-chapter)", length: "series", format: "digital", layout: "pages" },
  { label: "Webtoon (episodic)", length: "series", format: "digital", layout: "webtoon" },
  { label: "Print-First (graphic novel)", length: "graphic-novel", format: "print" },
];

export default function GuidedStoryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<StoryDraft | null>(null);
  const [coachCards, setCoachCards] = useState<CoachCard[]>([]);
  const [showCoachPanel, setShowCoachPanel] = useState(false);

  useEffect(() => {
    const loaded = loadDraft();
    if (loaded) {
      setDraft(loaded);
      // Determine current step based on what's filled
      if (loaded.outline) {
        setCurrentStep(6);
      } else if (loaded.step5) {
        setCurrentStep(5);
      } else if (loaded.step4) {
        setCurrentStep(4);
      } else if (loaded.step3) {
        setCurrentStep(3);
      } else if (loaded.step2) {
        setCurrentStep(2);
      } else if (loaded.step1) {
        setCurrentStep(2);
      }
    } else {
      setDraft(createDraft());
    }
  }, []);

  const updateCoachCards = useCallback(() => {
    if (!draft) return;

    const story: Story = {
      id: draft.id,
      title: "Untitled Story",
      mode: "guided",
      format: draft.step5?.format || "digital",
      emotionPalette: draft.step4?.emotions || [],
      sensitivityLevel: "all-ages",
    };

    const character: Character | undefined = draft.step2?.name
      ? {
          id: "draft-char-1",
          name: draft.step2.name,
          role: (draft.step2.role as any) || "protagonist",
          goal: draft.step2.goal,
          fear: draft.step2.fear,
        }
      : undefined;

    const cards = generateCoachCards(story, {
      characters: character ? [character] : [],
      scenes: [],
      threads: [],
      locations: [],
    });

    // Add custom coach cards based on draft state
    if (!draft.step1?.storyType && !draft.step1?.custom) {
      cards.push({
        id: "draft-step1",
        type: "question",
        engine: "Plot",
        title: "What kind of story is this?",
        message: "Start by choosing a story type or describing your own.",
        actions: ["Select a type", "Or write your own"],
        appliesTo: { type: "story" },
        priority: "high",
      });
    }

    if (draft.step2 && !draft.step2.name) {
      cards.push({
        id: "draft-step2-name",
        type: "question",
        engine: "Character",
        title: "Who is your main character?",
        message: "Give them a name to make them real.",
        actions: ["Enter a name"],
        appliesTo: { type: "story" },
        priority: "high",
      });
    }

    if (draft.step2?.name && !draft.step2.goal) {
      cards.push({
        id: "draft-step2-goal",
        type: "suggestion",
        engine: "Character",
        title: "What does your character want?",
        message: "A clear goal drives the story forward and creates stakes.",
        actions: ["Define their goal"],
        appliesTo: { type: "character", id: "draft-char-1" },
        priority: "medium",
      });
    }

    if (draft.step2?.goal && !draft.step2.fear) {
      cards.push({
        id: "draft-step2-fear",
        type: "suggestion",
        engine: "Character",
        title: "What does your character fear?",
        message: "Fear creates internal conflict and raises the stakes.",
        actions: ["Add a fear"],
        appliesTo: { type: "character", id: "draft-char-1" },
        priority: "medium",
      });
    }

    if (draft.step3 && !draft.step3.problemTemplate && !draft.step3.customProblem) {
      cards.push({
        id: "draft-step3",
        type: "question",
        engine: "Plot",
        title: "What's the core problem?",
        message: "The central conflict drives your story.",
        actions: ["Choose a template", "Or write your own"],
        appliesTo: { type: "story" },
        priority: "high",
      });
    }

    if (draft.step4 && (!draft.step4.emotions || draft.step4.emotions.length === 0)) {
      cards.push({
        id: "draft-step4",
        type: "suggestion",
        engine: "Emotion",
        title: "What emotions should readers feel?",
        message: "An emotional palette guides the tone and pacing.",
        actions: ["Select emotions"],
        appliesTo: { type: "story" },
        priority: "medium",
      });
    }

    setCoachCards(cards);
  }, [draft]);

  useEffect(() => {
    if (draft) {
      saveDraft(draft);
      updateCoachCards();
    }
  }, [draft, updateCoachCards]);

  function updateDraft(updates: Partial<StoryDraft>) {
    if (!draft) return;
    setDraft({ ...draft, ...updates });
  }

  function handleStep1(type: "storyType" | "genre" | "feel", value: string) {
    updateDraft({
      step1: {
        ...draft?.step1,
        [type]: value,
      },
    });
  }

  function handleStep1Custom(value: string) {
    updateDraft({
      step1: {
        ...draft?.step1,
        custom: value,
      },
    });
  }

  function handleStep2(field: string, value: string | string[]) {
    updateDraft({
      step2: {
        ...draft?.step2,
        [field]: value,
      },
    });
  }

  function handleStep3(template?: string, custom?: string) {
    updateDraft({
      step3: {
        problemTemplate: template,
        customProblem: custom,
      },
    });
  }

  function handleStep4(emotions: string[], intensity?: number) {
    updateDraft({
      step4: {
        emotions,
        // Preserve existing intensity if not provided, default to 5
        intensity: intensity ?? draft?.step4?.intensity ?? 5,
      },
    });
  }

  function handleStep5(updates: {
    length?: StoryLength;
    format?: StoryFormat;
    layout?: DigitalLayout;
    custom?: string;
  }) {
    updateDraft({
      step5: {
        ...draft?.step5,
        ...updates,
      },
    });
  }

  function generateOutline() {
    if (!draft) return;

    const beats: string[] = [];
    const characterName = draft.step2?.name || "The protagonist";
    const goal = draft.step2?.goal || "achieve their goal";
    const problem = draft.step3?.problemTemplate || draft.step3?.customProblem || "face a challenge";

    beats.push(`${characterName} is introduced in their ordinary world`);
    beats.push(`The problem emerges: ${problem}`);
    beats.push(`${characterName} decides to act and pursue ${goal}`);
    beats.push(`Obstacles arise that test ${characterName}'s resolve`);
    beats.push(`The stakes escalate as time or resources run low`);
    beats.push(`${characterName} faces their greatest fear or obstacle`);
    beats.push(`Resolution: ${characterName} succeeds, fails, or transforms`);

    const beginning = `${characterName} lives in their normal world. ${problem} disrupts everything, forcing them to make a choice.`;
    const middle = `${characterName} pursues ${goal} but faces increasing obstacles. Their fears and flaws create complications.`;
    const end = `The final confrontation tests everything ${characterName} has learned. The outcome reflects their growth.`;

    updateDraft({
      outline: {
        beginning,
        middle,
        end,
        beats: beats.slice(0, Math.max(3, Math.min(7, beats.length))),
      },
    });

    setCurrentStep(6);
  }

  function handleOutlineUpdate(field: "beginning" | "middle" | "end" | "beats", value: string | string[]) {
    if (!draft?.outline) return;
    updateDraft({
      outline: {
        ...draft.outline,
        [field]: value,
      },
    });
  }

  function handleReset() {
    if (confirm("Reset your draft? This cannot be undone.")) {
      clearDraft();
      setDraft(createDraft());
      setCurrentStep(1);
    }
  }

  function handleSendToSandbox() {
    if (draft) {
      saveDraft(draft);
      router.push("/story");
    }
  }

  if (!draft) {
    return <div>Loading...</div>;
  }

  return (
    <main className="dashboard">
      <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1400px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <p className="eyebrow">Guided Story Mode v1</p>
                <h1>Step {currentStep} of 6</h1>
              </div>
              <button type="button" className="button secondary" onClick={handleReset}>
                Reset draft
              </button>
            </div>

            {/* Step 1: Story Type/Genre/Feel */}
            {currentStep === 1 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>What kind of story is this?</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Choose a story type, genre, or feel—or describe your own.
                  </p>
                </div>

                <div className="form-group">
                  <label>Story Type</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {STORY_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`studio-tab ${draft.step1?.storyType === type ? "active" : ""}`}
                        onClick={() => handleStep1("storyType", type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Genre (optional)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        className={`studio-tab ${draft.step1?.genre === genre ? "active" : ""}`}
                        onClick={() => handleStep1("genre", genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Feel (optional)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {FEELS.map((feel) => (
                      <button
                        key={feel}
                        type="button"
                        className={`studio-tab ${draft.step1?.feel === feel ? "active" : ""}`}
                        onClick={() => handleStep1("feel", feel)}
                      >
                        {feel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Or describe your own</label>
                  <input
                    className="input"
                    placeholder="e.g., A coming-of-age story about..."
                    value={draft.step1?.custom || ""}
                    onChange={(e) => handleStep1Custom(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!draft.step1?.storyType && !draft.step1?.custom}
                  >
                    Next: Character
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Main Character */}
            {currentStep === 2 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>Who is your main character?</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Give them a name, role, goal, and fear. Add vibe tags if you want.
                  </p>
                </div>

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    className="input"
                    placeholder="e.g., Alex"
                    value={draft.step2?.name || ""}
                    onChange={(e) => handleStep2("name", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["protagonist", "anti-hero", "ensemble"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        className={`studio-tab ${draft.step2?.role === role ? "active" : ""}`}
                        onClick={() => handleStep2("role", role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Goal</label>
                  <input
                    className="input"
                    placeholder="What do they want to achieve?"
                    value={draft.step2?.goal || ""}
                    onChange={(e) => handleStep2("goal", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Fear</label>
                  <input
                    className="input"
                    placeholder="What do they fear most?"
                    value={draft.step2?.fear || ""}
                    onChange={(e) => handleStep2("fear", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Vibe Tags (optional)</label>
                  <input
                    className="input"
                    placeholder="e.g., mysterious, determined, quirky (comma-separated)"
                    value={draft.step2?.vibeTags?.join(", ") || ""}
                    onChange={(e) => {
                      const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                      handleStep2("vibeTags", tags);
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setCurrentStep(3)}
                  >
                    Next: Problem
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(3)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Core Problem */}
            {currentStep === 3 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>What&apos;s the core problem?</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Choose a template or write your own conflict.
                  </p>
                </div>

                <div className="form-group">
                  <label>Templates</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {PROBLEM_TEMPLATES.map((template) => (
                      <button
                        key={template}
                        type="button"
                        className={`studio-tab ${draft.step3?.problemTemplate === template ? "active" : ""}`}
                        onClick={() => handleStep3(template)}
                        style={{ textAlign: "left", justifyContent: "flex-start" }}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Or write your own</label>
                  <textarea
                    className="input"
                    placeholder="Describe the core conflict..."
                    rows={4}
                    value={draft.step3?.customProblem || ""}
                    onChange={(e) => handleStep3(undefined, e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setCurrentStep(4)}
                  >
                    Next: Emotions
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(4)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Emotional Palette */}
            {currentStep === 4 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>What emotions should readers feel?</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Select emotions that will guide your story&apos;s tone and pacing.
                  </p>
                </div>

                <div className="form-group">
                  <label>Emotions (multi-select)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {EMOTIONS.map((emotion) => {
                      const isSelected = draft.step4?.emotions?.includes(emotion) || false;
                      return (
                        <button
                          key={emotion}
                          type="button"
                          className={`studio-tab ${isSelected ? "active" : ""}`}
                          onClick={() => {
                            const current = draft.step4?.emotions || [];
                            const updated = isSelected
                              ? current.filter((e) => e !== emotion)
                              : [...current, emotion];
                            // Preserve existing intensity when toggling emotions
                            handleStep4(updated, draft.step4?.intensity);
                          }}
                        >
                          {emotion}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>Intensity (optional)</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={draft.step4?.intensity || 5}
                    onChange={(e) => handleStep4(draft.step4?.emotions || [], Number(e.target.value))}
                    className="input"
                  />
                  <span style={{ fontSize: "14px", color: "rgba(var(--foreground-rgb), 0.7)" }}>
                    {draft.step4?.intensity || 5} / 10
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(3)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setCurrentStep(5)}
                  >
                    Next: Format
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(5)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Length/Format */}
            {currentStep === 5 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>What&apos;s the length and format?</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Choose how long your story will be and its primary format.
                  </p>
                </div>

                <div className="form-group">
                  <label>Length/Format</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {LENGTH_FORMATS.map((option, index) => {
                      const isSelected =
                        draft.step5?.length === option.length &&
                        draft.step5?.format === option.format &&
                        (!option.layout || draft.step5?.layout === option.layout);
                      return (
                        <button
                          key={index}
                          type="button"
                          className={`studio-tab ${isSelected ? "active" : ""}`}
                          onClick={() =>
                            handleStep5({
                              length: option.length,
                              format: option.format,
                              layout: option.layout,
                            })
                          }
                          style={{ textAlign: "left", justifyContent: "flex-start" }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>Or describe your own</label>
                  <input
                    className="input"
                    placeholder="e.g., A 3-volume manga series..."
                    value={draft.step5?.custom || ""}
                    onChange={(e) => handleStep5({ custom: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(4)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={generateOutline}
                  >
                    Generate Outline
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={generateOutline}
                  >
                    Skip to Outline
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Outline */}
            {currentStep === 6 && (
              <div className="studio-grid">
                <div>
                  <h2 style={{ marginBottom: "12px" }}>Your Story Outline</h2>
                  <p className="lede" style={{ marginBottom: "24px" }}>
                    Edit the generated outline to match your vision.
                  </p>
                </div>

                <div className="form-group">
                  <label>Beginning</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={draft.outline?.beginning || ""}
                    onChange={(e) => handleOutlineUpdate("beginning", e.target.value)}
                    placeholder="How does your story begin?"
                  />
                </div>

                <div className="form-group">
                  <label>Middle</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={draft.outline?.middle || ""}
                    onChange={(e) => handleOutlineUpdate("middle", e.target.value)}
                    placeholder="What happens in the middle?"
                  />
                </div>

                <div className="form-group">
                  <label>End</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={draft.outline?.end || ""}
                    onChange={(e) => handleOutlineUpdate("end", e.target.value)}
                    placeholder="How does it end?"
                  />
                </div>

                <div className="form-group">
                  <label>Story Beats</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(draft.outline?.beats || []).map((beat, index) => (
                      <input
                        key={index}
                        className="input"
                        value={beat}
                        onChange={(e) => {
                          const updated = [...(draft.outline?.beats || [])];
                          updated[index] = e.target.value;
                          handleOutlineUpdate("beats", updated);
                        }}
                        placeholder={`Beat ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setCurrentStep(5)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={handleSendToSandbox}
                  >
                    Send to Story Sandbox
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Coach Cards Sidebar */}
        <aside className="panel" style={{ width: "320px", maxHeight: "calc(100vh - 120px)", overflowY: "auto", position: "sticky", top: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px" }}>Coach Cards</h2>
            <button
              type="button"
              className="button secondary"
              onClick={() => setShowCoachPanel(!showCoachPanel)}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              {showCoachPanel ? "Hide" : "Show"}
            </button>
          </div>

          {showCoachPanel && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {coachCards.length === 0 ? (
                <p className="lede" style={{ fontSize: "14px" }}>
                  Keep going! Coach cards will appear as you fill out the wizard.
                </p>
              ) : (
                coachCards.map((card) => (
                  <div
                    key={card.id}
                    className="gallery-card"
                    style={{ padding: "12px", background: card.priority === "high" ? "#fff5f5" : "#fff" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span className="eyebrow" style={{ fontSize: "10px" }}>{card.engine}</span>
                      {card.priority === "high" && (
                        <span style={{ fontSize: "10px", color: "rgb(var(--accent-rgb))" }}>High</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>{card.title}</h3>
                    <p style={{ fontSize: "13px", marginBottom: "8px", color: "rgba(var(--foreground-rgb), 0.8)" }}>
                      {card.message}
                    </p>
                    {card.options && card.options.length > 0 && (
                      <div style={{ marginBottom: "8px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Options:</p>
                        <ul style={{ fontSize: "12px", paddingLeft: "20px" }}>
                          {card.options.slice(0, 3).map((option, i) => (
                            <li key={i}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.actions && card.actions.length > 0 && (
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Actions:</p>
                        <ul style={{ fontSize: "12px", paddingLeft: "20px" }}>
                          {card.actions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
