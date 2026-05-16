import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f4d3a",
          color: "#f5e6c8",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 8
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
