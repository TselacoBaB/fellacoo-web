import type { CSSProperties, ReactNode } from "react";
import type { BuilderElement, BuilderViewport } from "@/types/builder";

type PrimitiveProps = {
  element: BuilderElement;
  children?: ReactNode;
  viewport?: BuilderViewport;
};

function designStyle(element: BuilderElement, viewport: BuilderViewport = "desktop"): CSSProperties {
  const base = (element.props.design ?? {}) as Record<string, unknown>;
  const responsive = (base.responsive ?? {}) as Record<string, unknown>;
  const override = viewport === "desktop" ? {} : ((responsive[viewport] ?? {}) as Record<string, unknown>);
  const design = { ...base, ...override } as Record<string, unknown>;
  const style: CSSProperties = {};
  if (typeof design.backgroundColor === "string" && design.backgroundColor) style.backgroundColor = design.backgroundColor;
  if (typeof design.textColor === "string" && design.textColor) style.color = design.textColor;
  if (typeof design.borderRadius === "string" && design.borderRadius) style.borderRadius = design.borderRadius;
  if (typeof design.paddingTop === "string" && design.paddingTop) style.paddingTop = design.paddingTop;
  if (typeof design.paddingBottom === "string" && design.paddingBottom) style.paddingBottom = design.paddingBottom;
  if (typeof design.textAlign === "string" && design.textAlign) style.textAlign = design.textAlign as CSSProperties["textAlign"];
  if (typeof design.boxShadow === "string" && design.boxShadow) style.boxShadow = design.boxShadow;
  if (typeof design.fontSize === "string" && design.fontSize) style.fontSize = design.fontSize;
  if (typeof design.fontWeight === "string" && design.fontWeight) style.fontWeight = design.fontWeight;
  if (typeof design.lineHeight === "string" && design.lineHeight) style.lineHeight = design.lineHeight;
  if (design.hidden === true) style.display = "none";
  return style;
}

function value(props: Record<string, unknown>, key: string, fallback: string) {
  return String(props[key] ?? fallback);
}

export function PrimitivePreview({ element, children, viewport = "desktop" }: PrimitiveProps) {
  const p = element.props;
  const style = designStyle(element, viewport);

  switch (element.type) {
    case "text":
      return <p className="builder-primitive-text" style={style}>{value(p, "text", "Your text goes here.")}{children}</p>;

    case "heading": {
      const level = value(p, "level", "h2");
      const content = value(p, "text", "Your heading");
      if (level === "h1") return <h1 className="builder-primitive-heading" style={style}>{content}</h1>;
      if (level === "h3") return <h3 className="builder-primitive-heading" style={style}>{content}</h3>;
      if (level === "h4") return <h4 className="builder-primitive-heading" style={style}>{content}</h4>;
      return <h2 className="builder-primitive-heading" style={style}>{content}</h2>;
    }

    case "button":
      return <button className={"builder-primitive-button " + value(p, "variant", "primary")} style={style}>{value(p, "label", "Get Started")}</button>;

    case "image":
      return (
        <figure className="builder-primitive-image-wrap" style={style}>
          <div className="builder-primitive-image">
            {p.src ? <><img src={String(p.src)} alt={value(p, "alt", "")} /></> : <div className="builder-image-placeholder"><span>IMAGE</span><small>{value(p, "alt", "Add an image")}</small></div>}
          </div>
          {p.caption ? <figcaption>{String(p.caption)}</figcaption> : null}
        </figure>
      );

    case "icon":
      return <span className="builder-primitive-icon" style={style} aria-label={value(p, "label", "Icon")}>{value(p, "symbol", "✦")}</span>;

    case "link":
      return <a className="builder-primitive-link" style={style} href={value(p, "url", "#")}>{value(p, "label", "Learn more")}</a>;

    case "divider":
      return <hr className="builder-primitive-divider" style={style} />;

    case "spacer":
      return <div className="builder-primitive-spacer" style={{ ...style, height: value(p, "height", "48px") }} aria-hidden="true" />;

    case "columns": {
      const count = Math.max(2, Math.min(4, Number(p.columns ?? 3)));
      return (
        <div className={"builder-primitive-columns columns-" + count} style={style}>
          {Array.from({ length: count }, (_, index) => (
            <div className="builder-column" key={index}>
              <span>Column {index + 1}</span>
              {index === 0 ? children : null}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
