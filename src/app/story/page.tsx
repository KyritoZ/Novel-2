"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  sampleCharacters,
  sampleCoachCards,
  sampleScenes,
  sampleStory,
} from "@/lib/story/sampleData";
import { loadDraft } from "@/lib/story/draft";

export default function StoryPage() {
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    const loaded = loadDraft();
    if (loaded) {
      setDraft(loaded);
    }
  }, []);

  const story = draft
    ? {
        title: draft.step2?.name
          ? `${draft.step2.name}'s Story`
          : "Untitled Story",
        mode: "guided" as const,
        format: draft.step5?.format || "digital",
        emotionPalette: draft.step4?.emotions || [],
      }
    : sampleStory;

  return (
    <main className="dashboard">
      <div style={{ width: "min(1000px, 100%)" }}>
        <section className="card">
          <p className="eyebrow">Story Sandbox</p>
          <h1>{story.title}</h1>
          <p className="lede">
            Mode: {story.mode} · Format: {story.format}
            {story.emotionPalette.length > 0 && (
              <> · Emotion palette: {story.emotionPalette.join(", ")}</>
            )}
          </p>
          {draft && (
            <div style={{ marginTop: "16px", padding: "16px", background: "#f7f8fb", borderRadius: "10px" }}>
              <p style={{ fontWeight: 600, marginBottom: "8px" }}>From Guided Story Mode:</p>
              {draft.step2?.name && <p>Character: {draft.step2.name}</p>}
              {draft.step2?.goal && <p>Goal: {draft.step2.goal}</p>}
              {draft.step3?.problemTemplate && <p>Problem: {draft.step3.problemTemplate}</p>}
              {draft.step3?.customProblem && <p>Problem: {draft.step3.customProblem}</p>}
              {draft.outline && (
                <div style={{ marginTop: "12px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "4px" }}>Outline:</p>
                  {draft.outline.beginning && (
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Beginning:</strong> {draft.outline.beginning}
                    </p>
                  )}
                  {draft.outline.middle && (
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>Middle:</strong> {draft.outline.middle}
                    </p>
                  )}
                  {draft.outline.end && (
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                      <strong>End:</strong> {draft.outline.end}
                    </p>
                  )}
                  {draft.outline.beats && draft.outline.beats.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <p style={{ fontWeight: 600, marginBottom: "4px" }}>Beats:</p>
                      <ul style={{ fontSize: "14px", paddingLeft: "20px" }}>
                        {draft.outline.beats.map((beat: string, i: number) => (
                          <li key={i}>{beat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <p style={{ marginTop: "16px" }}>
            Characters: {sampleCharacters.length} · Scenes: {sampleScenes.length}
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <Link href="/story/guided" className="button secondary">
              Back to Guided Mode
            </Link>
            <Link href="/" className="button secondary">
              Dashboard
            </Link>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <p className="eyebrow">Coach Cards</p>
          <div style={{ display: "grid", gap: "16px" }}>
            {sampleCoachCards.map((card) => (
              <div key={card.id} className="gallery-card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px" }}>{card.engine}</span>
                  {card.priority === "high" && (
                    <span style={{ fontSize: "10px", color: "rgb(var(--accent-rgb))" }}>High</span>
                  )}
                </div>
                <h2 style={{ fontSize: "16px", marginBottom: "6px" }}>{card.title}</h2>
                <p style={{ marginBottom: "12px" }}>{card.message}</p>
                {card.options && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontWeight: 600, marginBottom: "4px" }}>Options:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      {card.options.map((option) => (
                        <li key={option}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "4px" }}>Actions:</p>
                  <ul style={{ paddingLeft: "20px" }}>
                    {card.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
