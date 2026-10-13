import { ImageResponse } from "next/og";

/**
 * Favicon — ink dairə üzərində lime DesTech ulduzu.
 * Nav loqosundakı nişanın eynisi (src/components/ui/icons.tsx → Star).
 */

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
          background: "#151228",
          borderRadius: 999,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z"
            fill="#d6e04a"
          />
        </svg>
      </div>
    ),
    size,
  );
}
