export type BuilderViewport = "desktop" | "tablet" | "mobile";

export type BuilderElement = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: BuilderElement[];
};

export type BuilderDocument = {
  version: 1;
  pages: Array<{
    id: string;
    path: string;
    title: string;
    elements: BuilderElement[];
  }>;
};