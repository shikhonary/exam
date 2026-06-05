import React from "react";
import { useBuilderStore } from "../../../store/use-builder-store";
import { useQuestionPaperById } from "@workspace/api-client";

const toBengaliDigits = (num: number | string): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (/\d/.test(digit) ? bengaliDigits[parseInt(digit)] : digit))
    .join("");
};

export const OMRBlock = () => {
  const settings = useBuilderStore((state) => state.settings);
  const paperId = useBuilderStore((state) => state.paperId);
  const { data: paperQuery } = useQuestionPaperById(paperId || "");

  // Count MCQs
  let mcqCount = 0;
  if (paperQuery?.questions) {
    mcqCount = paperQuery.questions.filter((q: any) => q.mcq).length;
  }
  if (mcqCount === 0) mcqCount = 30; // Fallback for empty paper/preview

  const columns = settings.omrSettings?.columns || 3;
  const questionsPerColumn = Math.ceil(mcqCount / columns);

  // Create an array of questions grouped by column
  const columnData = Array.from({ length: columns }, (_, colIdx) => {
    const start = colIdx * questionsPerColumn;
    const end = Math.min(start + questionsPerColumn, mcqCount);
    return Array.from({ length: end - start }, (_, i) => start + i + 1);
  });

  // QR code embeds both the paper ID and the column count so the
  // Python engine can read them without any database call.
  const qrPayload = JSON.stringify({ id: paperId || "preview-mode", cols: columns });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrPayload)}&margin=0`;

  return (
    <div
      className="relative w-full h-full bg-white text-black p-8 font-sans border-2 border-transparent break-inside-avoid break-before-page"
      style={{
        minHeight: "240mm",
        // Force the browser to print borders and background colors exactly as designed
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/*
        ╔══════════════════════════════════════════════════════════╗
        ║  FIDUCIAL MARKERS — MUST NOT BE MOVED OR RESIZED        ║
        ║  The Python engine uses these 4 solid black squares     ║
        ║  to straighten perspective-skewed photos.               ║
        ║  Size: 32×32px  |  Position: 8px from each corner      ║
        ╚══════════════════════════════════════════════════════════╝
      */}
      {/* Top-left */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-black" style={{ outline: "3px solid white" }} />
      {/* Top-right */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-black" style={{ outline: "3px solid white" }} />
      {/* Bottom-left */}
      <div className="absolute bottom-2 left-2 w-8 h-8 bg-black" style={{ outline: "3px solid white" }} />
      {/* Bottom-right */}
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-black" style={{ outline: "3px solid white" }} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-start mb-6 mt-2 px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{settings.institutionName}</h1>
          <h2 className="text-lg font-semibold">{settings.examName || "পরীক্ষা"}</h2>
          <div className="mt-2 text-sm">
            <p><strong>বিষয়:</strong> {settings.subjectName}</p>
            <p><strong>শ্রেণি:</strong> {settings.className}</p>
          </div>
        </div>

        {/* QR Code — encodes {id, cols} for engine */}
        <div className="flex flex-col items-center border-2 border-black p-1">
          <img
            src={qrUrl}
            alt="Paper ID QR"
            width={90}
            height={90}
            className="rendering-pixelated"
          />
          <span className="text-[10px] mt-1 font-mono">{paperId?.slice(0, 8) || "preview"}</span>
        </div>
      </div>

      {/* ── Roll / ID bubble grid ───────────────────────────────── */}
      {settings.omrSettings?.includeRollNumber && (
        <div className="flex justify-center px-6 mb-4">
          <div className="border-2 border-black rounded-lg p-3">
            <div className="text-center font-bold mb-2 text-sm border-b border-black pb-1">
              Roll / ID
            </div>
            <div className="flex gap-3 justify-center">
              {[0, 1, 2, 3, 4, 5].map((col) => (
                <div key={col} className="flex flex-col items-center gap-1">
                  {/* Write-in box */}
                  <div className="w-6 h-8 border border-black mb-1" />
                  {/* Bubbles 0–9 (0 at top so index = digit value) */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div
                      key={num}
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        fontWeight: "500",
                      }}
                    >
                      {toBengaliDigits(num)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/*
        ╔═══════════════════════════════════════════════════════════╗
        ║  MACHINE-READABLE DIVIDER LINE                           ║
        ║  The Python engine scans for this line to separate the   ║
        ║  Roll ID section from the MCQ section.                   ║
        ║  Must remain a solid, full-width, black horizontal bar.  ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="w-full h-[3px] bg-black my-4" />

      {/* ── MCQ bubble grid ─────────────────────────────────────── */}
      <div className="px-6 pt-3">
        <div className="text-center font-bold mb-4 text-base">
          সঠিক উত্তরের বৃত্তটি ভরাট করো
        </div>

        <div className="flex justify-between gap-6">
          {columnData.map((colQuestions, cIdx) => (
            <div key={cIdx} className="flex-1 flex flex-col gap-3">
              {colQuestions.map((qNum) => (
                <div key={qNum} className="flex items-center gap-2">
                  <span className="w-6 text-right font-bold text-sm shrink-0">
                    {toBengaliDigits(qNum)}.
                  </span>
                  <div className="flex gap-2">
                    {["ক", "খ", "গ", "ঘ"].map((opt) => (
                      <div
                        key={opt}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: "1.5px solid black",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          fontWeight: "500",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer instruction */}
        <div className="mt-6 text-center text-sm font-semibold text-gray-700">
          বৃত্তটি সম্পূর্ণ কালো কালির বলপয়েন্ট কলম দিয়ে ভরাট করো।
        </div>
      </div>
    </div>
  );
};
