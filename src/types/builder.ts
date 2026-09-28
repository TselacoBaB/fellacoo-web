export type BuilderViewport = "desktop" | "tablet" | "mobile";

export type BuilderResponsiveDesign = {
  tablet?: Record<string, unknown>;
  mobile?: Record<string, unknown>;
};

export type BuilderDesign = Record<string, unknown> & {
  responsive?: BuilderResponsiveDesign;
};

export type BuilderElement = {
  id: string;
  type: string;
  props: Record<string, unknown> & { design?: BuilderDesign };
  children?: BuilderElement[];
};

export type BuilderPage = {
  id: string;
  path: string;
  title: string;
  elements: BuilderElement[];
  seo?: {
    title?: string;
    description?: string;
  };
};

export type BuilderTheme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    background: string;
    surface: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: string;
    bodyWeight: string;
  };
  radius: string;
  containerWidth: string;
  buttonStyle: "solid" | "soft" | "outline" | "pill";
};

export type BuilderDocument = {
  version: 1;
  site: {
    brandName: string;
    tagline: string;
    theme: BuilderTheme;
    seo: {
      title: string;
      description: string;
      favicon?: string;
    };
  };
  pages: BuilderPage[];
};