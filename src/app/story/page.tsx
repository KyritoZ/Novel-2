import Link from "next/link";
import {
  sampleCharacters,
  sampleCoachCards,
  sampleScenes,
  sampleStory,
} from "@/lib/story/sampleData";

export default function StoryPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Story graph</p>
        <h1>{sampleStory.title}</h1>
        <p className="lede">
          Mode: {sampleStory.mode} · Format: {sampleStory.format} · Emotion palette: {" "}
          {sampleStory.emotionPalette.join(", ")}
        </p>
        <p>
          Characters: {sampleCharacters.length} · Scenes: {sampleScenes.length}
        </p>
        <p>
          <Link href="/">Back to scaffold</Link>
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">Coach Cards</p>
        <ul className="list">
          {sampleCoachCards.map((card) => (
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
