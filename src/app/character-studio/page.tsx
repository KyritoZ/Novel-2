"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { CharacterAsset, CharacterLibrary } from "@/lib/characters/types";
import { addAsset, deleteAsset, loadLibrary } from "@/lib/characters/storage";
import { moderateImageDataUrl } from "@/lib/moderation/moderateImage";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 420;

type TabKey = "upload" | "draw" | "generate";

const tabLabels: Record<TabKey, string> = {
  upload: "Upload",
  draw: "Draw",
  generate: "Generate",
};

const emptyLibrary: CharacterLibrary = { assets: [] };

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `asset-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function CharacterStudioPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("upload");
  const [library, setLibrary] = useState<CharacterLibrary>(emptyLibrary);

  const [uploadName, setUploadName] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadDimensions, setUploadDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadIsSaving, setUploadIsSaving] = useState(false);
  const uploadFileRef = useRef<HTMLInputElement | null>(null);

  const [drawName, setDrawName] = useState("");
  const [brushSize, setBrushSize] = useState(8);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [drawIsSaving, setDrawIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    setLibrary(loadLibrary());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
    context.lineWidth = brushSize;
  }, [brushSize]);

  const uploadReady = uploadName.trim().length > 0 && !!uploadPreview;
  const drawReady = drawName.trim().length > 0;

  const sortedAssets = useMemo(() => {
    return [...library.assets];
  }, [library.assets]);

  function handleUploadFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadPreview(null);
      setUploadDimensions(null);
      setUploadError(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        return;
      }

      const image = new Image();
      image.onload = () => {
        setUploadPreview(result);
        setUploadDimensions({ width: image.width, height: image.height });
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
  }

  function handleSaveUpload() {
    if (!uploadPreview || !uploadDimensions || !uploadName.trim()) return;

    setUploadIsSaving(true);
    setUploadError(null);

    moderateImageDataUrl(uploadPreview)
      .then((result) => {
        if (!result.allow) {
          setUploadError("This image can't be saved due to content policy.");
          setUploadPreview(null);
          setUploadDimensions(null);
          if (uploadFileRef.current) {
            uploadFileRef.current.value = "";
          }
          return;
        }

        const asset: CharacterAsset = {
          id: createId(),
          name: uploadName.trim(),
          createdAt: new Date().toISOString(),
          sourceType: "upload",
          dataUrl: uploadPreview,
          width: uploadDimensions.width,
          height: uploadDimensions.height,
        };

        const updated = addAsset(asset);
        setLibrary(updated);
        setUploadName("");
        setUploadPreview(null);
        setUploadDimensions(null);
        if (uploadFileRef.current) {
          uploadFileRef.current.value = "";
        }
      })
      .finally(() => {
        setUploadIsSaving(false);
      });
  }

  function getCanvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.setPointerCapture(event.pointerId);
    const { x, y } = getCanvasPoint(event);
    context.beginPath();
    context.moveTo(x, y);
    isDrawingRef.current = true;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { x, y } = getCanvasPoint(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = false;
    canvas.releasePointerCapture(event.pointerId);
  }

  function handleClearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleSaveDrawing() {
    const canvas = canvasRef.current;
    if (!canvas || !drawName.trim()) return;

    const dataUrl = canvas.toDataURL("image/png");
    setDrawIsSaving(true);
    setDrawError(null);

    moderateImageDataUrl(dataUrl)
      .then((result) => {
        if (!result.allow) {
          setDrawError("This image can't be saved due to content policy.");
          return;
        }

        const asset: CharacterAsset = {
          id: createId(),
          name: drawName.trim(),
          createdAt: new Date().toISOString(),
          sourceType: "draw",
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        };

        const updated = addAsset(asset);
        setLibrary(updated);
        setDrawName("");
        handleClearCanvas();
      })
      .finally(() => {
        setDrawIsSaving(false);
      });
  }

  function handleDeleteAsset(id: string) {
    const updated = deleteAsset(id);
    setLibrary(updated);
  }

  return (
    <main className="studio-page">
      <div className="studio-shell">
        <header className="studio-header">
          <p className="eyebrow">Character Studio v1</p>
          <h1>Build character assets with uploads or quick sketches.</h1>
          <p className="lede">
            Store character bases locally while we finalize packs, expressions, and
            outfits. No AI calls yet.
          </p>
        </header>

        <section className="studio-layout">
          <div className="panel">
            <div className="studio-tabs">
              {(Object.keys(tabLabels) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  className={`studio-tab ${activeTab === tab ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {activeTab === "upload" && (
              <div className="studio-grid">
                <div className="form-group">
                  <label htmlFor="upload-name">Character name</label>
                  <input
                    id="upload-name"
                    className="input"
                    placeholder="e.g. Hero base"
                    value={uploadName}
                    onChange={(event) => setUploadName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="upload-file">Upload PNG, JPG, or WEBP</label>
                  <input
                    id="upload-file"
                    className="input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleUploadFileChange}
                    ref={uploadFileRef}
                  />
                </div>

                <div className="preview">
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="Upload preview" />
                  ) : (
                    <p className="lede">Upload an image to preview it here.</p>
                  )}
                </div>

                <button
                  type="button"
                  className="button"
                  onClick={handleSaveUpload}
                  disabled={!uploadReady || uploadIsSaving}
                >
                  {uploadIsSaving ? "Checking..." : "Save to library"}
                </button>
                {uploadError && <p className="form-error">{uploadError}</p>}
              </div>
            )}

            {activeTab === "draw" && (
              <div className="studio-grid">
                <div className="form-group">
                  <label htmlFor="draw-name">Character name</label>
                  <input
                    id="draw-name"
                    className="input"
                    placeholder="e.g. Sketch base"
                    value={drawName}
                    onChange={(event) => setDrawName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="brush-size">Brush size: {brushSize}px</label>
                  <input
                    id="brush-size"
                    className="input"
                    type="range"
                    min={2}
                    max={32}
                    value={brushSize}
                    onChange={(event) => setBrushSize(Number(event.target.value))}
                  />
                </div>

                <canvas
                  ref={canvasRef}
                  className="canvas"
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                />

                <div className="gallery-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={handleClearCanvas}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={handleSaveDrawing}
                    disabled={!drawReady || drawIsSaving}
                  >
                    {drawIsSaving ? "Checking..." : "Save to library"}
                  </button>
                </div>
                {drawError && <p className="form-error">{drawError}</p>}
              </div>
            )}

            {activeTab === "generate" && (
              <div className="studio-grid">
                <div className="gallery-empty">
                  <p className="lede">
                    Coming soon. Character generation will be available once AI
                    cost controls and moderation gates are live.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="panel">
            <h2>My Characters</h2>
            {sortedAssets.length === 0 ? (
              <div className="gallery-empty">
                <p className="lede">
                  No character assets yet. Save an upload or sketch to start your
                  library.
                </p>
              </div>
            ) : (
              <div className="gallery-grid">
                {sortedAssets.map((asset) => (
                  <div className="gallery-card" key={asset.id}>
                    <img src={asset.dataUrl} alt={asset.name} />
                    <div className="gallery-meta">
                      <strong>{asset.name}</strong>
                      <span>
                        {new Date(asset.createdAt).toLocaleString()} ·{" "}
                        {asset.sourceType}
                      </span>
                      <span>
                        {asset.width} × {asset.height}px
                      </span>
                    </div>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      Delete
                    </button>
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
