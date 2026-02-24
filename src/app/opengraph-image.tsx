import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hardwood Living – Premium Hardwood Flooring in Canada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          backgroundColor: "#1c1917",
          padding: "60px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
          }}
        />

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #ea580c, #f97316)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "48px",
                backgroundColor: "#ea580c",
                borderRadius: "4px",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                color: "#a8a29e",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              Premium Flooring
            </span>
          </div>

          <h1
            style={{
              fontSize: "72px",
              fontWeight: "700",
              color: "#fafaf9",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Hardwood Living
          </h1>

          <p
            style={{
              fontSize: "26px",
              color: "#a8a29e",
              margin: 0,
              maxWidth: "700px",
              lineHeight: 1.4,
              fontFamily: "sans-serif",
            }}
          >
            Hardwood · Engineered · Vinyl · Laminate
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#ea580c",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "6px",
                fontSize: "18px",
                fontWeight: "600",
                fontFamily: "sans-serif",
              }}
            >
              Book a Showroom Visit
            </div>
            <span
              style={{
                fontSize: "18px",
                color: "#78716c",
                fontFamily: "sans-serif",
              }}
            >
              Vancouver, BC · Canada
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
