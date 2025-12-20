import type { CharacterAsset, CharacterLibrary } from "./types";

const STORAGE_KEY = "characterLibrary";

const emptyLibrary: CharacterLibrary = { assets: [] };

export function loadLibrary(): CharacterLibrary {
  if (typeof window === "undefined") {
    return emptyLibrary;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyLibrary;
  }

  try {
    const parsed = JSON.parse(raw) as CharacterLibrary;
    if (!parsed || !Array.isArray(parsed.assets)) {
      return emptyLibrary;
    }
    return { assets: parsed.assets };
  } catch {
    return emptyLibrary;
  }
}

export function saveLibrary(library: CharacterLibrary): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}

export function addAsset(asset: CharacterAsset): CharacterLibrary {
  const library = loadLibrary();
  const updated = {
    assets: [asset, ...library.assets],
  };
  saveLibrary(updated);
  return updated;
}

export function deleteAsset(id: string): CharacterLibrary {
  const library = loadLibrary();
  const updated = {
    assets: library.assets.filter((asset) => asset.id !== id),
  };
  saveLibrary(updated);
  return updated;
}
