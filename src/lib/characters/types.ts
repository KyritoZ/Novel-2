export type CharacterSourceType = "upload" | "draw" | "generate";

export interface CharacterAsset {
  id: string;
  name: string;
  createdAt: string;
  sourceType: CharacterSourceType;
  dataUrl: string;
  width: number;
  height: number;
}

export interface CharacterLibrary {
  assets: CharacterAsset[];
}
