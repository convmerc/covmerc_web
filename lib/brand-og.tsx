/** Shared layout for Next.js `ImageResponse` OG assets (E1). */

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const brandLogoPublicPath = "/brand/covmerc-logo.png";

type CovmercOgProps = {
  logoSrc: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function CovmercOgImage({
  logoSrc,
  eyebrow = "Covmerc Studio",
  title = "Modern furniture for Nigerian homes",
  subtitle = "Curated collections · Secure checkout · Ibadan studio",
}: CovmercOgProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #2a463c 0%, #3B5D50 45%, #1f4d3a 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={96}
          height={96}
          style={{
            objectFit: "contain",
            borderRadius: 16,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>Covmerc</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              color: "#F9BF29",
            }}
          >
            Studio
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
        <p
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F9BF29",
          }}
        >
          {eyebrow}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </p>
        <p style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: "rgba(255,255,255,0.88)" }}>
          {subtitle}
        </p>
      </div>

      <p style={{ margin: 0, fontSize: 20, color: "rgba(255,255,255,0.65)" }}>covmerc.com</p>
    </div>
  );
}
