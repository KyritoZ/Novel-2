\"use client\";

import Link from \"next/link\";
import { useEffect, useMemo, useState } from \"react\";
import { generateCoachCards } from \"@/lib/story/coachRules\";
import {
  sampleCharacters,
  sampleScenes,
  sampleStory,
  sampleThreads,
  sampleLocations,
} from \"@/lib/story/sampleData\";
import type { Character, Location, Scene, Story, Thread } from \"@/lib/story/types\";
import { loadStoryDraft } from \"@/lib/story/storage\";

interface StoryViewState {
  story: Story;
  characters: Character[];
  scenes: Scene[];
  threads: Thread[];
  locations: Location[];
}

export default function StoryPage() {
  const [draft, setDraft] = useState<StoryViewState | null>(null);

  useEffect(() => {
    const storedDraft = loadStoryDraft();
    if (storedDraft) {
      setDraft(storedDraft);
    }
  }, []);

  const story = draft?.story ?? sampleStory;
  const characters = draft?.characters ?? sampleCharacters;
  const scenes = draft?.scenes ?? sampleScenes;
  const threads = draft?.threads ?? sampleThreads;
  const locations = draft?.locations ?? sampleLocations;

  const coachCards = useMemo(() => {
    return generateCoachCards(story, { characters, scenes, threads, locations });
  }, [story, characters, scenes, threads, locations]);

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Story graph</p>
        <h1>{story.title}</h1>
        <p className="lede">
          Mode: {story.mode} · Format: {story.format} · Emotion palette:{" "}
          {story.emotionPalette.join(", ")}
        </p>
        <p>
          Characters: {characters.length} · Scenes: {scenes.length}
        </p>
        <p>
          <Link href="/">Back to scaffold</Link>
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">Coach Cards</p>
        <ul className="list">
          {coachCards.map((card) => (
            <li key={card.id} className="list-item">
              <h2>{card.title}</h2>
              <p>{card.message}</p>
              {card.options && (
                <div>
                  <p>Options:</p>
                  <ul>
                    {card.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p>Actions:</p>
                <ul>
                  {card.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
