"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, ScanLine, FileCheck2, AlertCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface OMRResult {
  paperId: string;
  rollNumber: string;
  answers: Record<string, string>;
  processed_image_base64?: string;
  debug?: {
    fiducials_found: boolean;
    divider_y: number;
    num_columns: number;
  };
}

export default function OMRVerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OMRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      // Don't clear results immediately — let admin re-scan explicitly
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const apiUrl = process.env.NEXT_PUBLIC_OMR_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/omr/verify`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Engine error: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert("Error from Python Engine: " + data.message);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sort answers numerically (Q1, Q2, … Q10, Q11 — not Q1, Q10, Q11)
  const sortedAnswers = results
    ? Object.entries(results.answers).sort(([a], [b]) => parseInt(a) - parseInt(b))
    : [];

  const totalAnswered = sortedAnswers.filter(([, a]) => a !== "BLANK" && a !== "DOUBLE").length;
  const totalBlank = sortedAnswers.filter(([, a]) => a === "BLANK").length;
  const totalDouble = sortedAnswers.filter(([, a]) => a === "DOUBLE").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-glow">
          <ScanLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            OMR Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload OMR sheets to automatically grade answers using Computer Vision.
          </p>
        </div>
      </div>

      {/* ── Upload + Results ──────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            Upload OMR Sheet
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            id="omr-upload"
            onChange={handleFileChange}
          />

          {/* Image Preview */}
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-border/40 bg-muted/20">
              <img
                src={preview}
                alt="Selected OMR sheet"
                className="w-full h-48 object-contain"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium border border-border/50 hover:bg-background transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Change
              </button>
            </div>
          ) : (
            <label
              htmlFor="omr-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
              <span className="text-sm text-muted-foreground">
                Click to select a JPG, PNG or WEBP image
              </span>
            </label>
          )}

          {file && (
            <div className="text-xs text-muted-foreground px-1">
              📄 {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </div>
          )}

          <Button
            onClick={handleProcess}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Processing with OpenCV…
              </span>
            ) : results ? "Re-Scan" : "Start Processing"}
          </Button>
        </div>

        {/* Results Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-primary" />
            Verification Results
          </h3>

          {!results && (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
              {file ? 'Click "Start Processing" to scan the sheet' : "Upload an image to begin"}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {/* Roll + Paper ID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Roll Number</div>
                  <div className="text-xl font-bold font-mono">{results.rollNumber}</div>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Paper ID</div>
                  <div className="text-sm font-bold font-mono truncate">{results.paperId}</div>
                </div>
              </div>

              {/* Score summary */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-xl font-bold text-green-600">{totalAnswered}</div>
                  <div className="text-xs text-muted-foreground">Answered</div>
                </div>
                <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-400/20">
                  <div className="text-xl font-bold text-orange-500">{totalDouble}</div>
                  <div className="text-xs text-muted-foreground">Double</div>
                </div>
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-xl font-bold text-red-500">{totalBlank}</div>
                  <div className="text-xs text-muted-foreground">Blank</div>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border/30">
                  <div className="text-xl font-bold">{sortedAnswers.length}</div>
                  <div className="text-xs text-muted-foreground">Total Qs</div>
                </div>
              </div>

              {/* Debug info */}
              {results.debug && (
                <div className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${results.debug.fiducials_found ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"}`}>
                  {results.debug.fiducials_found
                    ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  {results.debug.fiducials_found
                    ? `Fiducial markers detected · ${results.debug.num_columns} column(s)`
                    : "⚠ Markers not found — using fallback resize (accuracy may be lower)"}
                </div>
              )}

              {/* Answers grid */}
              <div className="border border-border/50 rounded-xl overflow-hidden">
                <div className="bg-muted/30 p-3 text-sm font-semibold border-b border-border/50">
                  Extracted Answers
                </div>
                <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto">
                  {sortedAnswers.map(([q, a]) => (
                    <div
                      key={q}
                      className={`flex justify-between items-center p-2 rounded-lg border text-sm ${
                        a === "DOUBLE"
                          ? "bg-orange-500/10 border-orange-400/30"
                          : a === "BLANK"
                          ? "bg-muted/30 border-border/20"
                          : "bg-background border-border/30"
                      }`}
                    >
                      <span className="text-muted-foreground font-medium">Q{q}</span>
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                        a === "DOUBLE"
                          ? "bg-orange-500/20 text-orange-600"
                          : a === "BLANK"
                          ? "text-muted-foreground"
                          : ""
                      }`}>
                        {a === "DOUBLE" ? "⚠ DOUBLE" : String(a)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>This data will be submitted to the backend for final grading against the answer key.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Visual Proof ──────────────────────────────────────────── */}
      {results?.processed_image_base64 && (
        <div className="mt-8 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-primary" />
                Visual Proof
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Green
                </span>{" "}= filled (single answer).{" "}
                <span className="inline-flex items-center gap-1 text-orange-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Orange
                </span>{" "}= double-fill (two+ options marked — invalid).{" "}
                <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Red
                </span>{" "}= empty. Orange line = Roll/MCQ divider.
              </p>
            </div>
          </div>
          <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/10 flex justify-center p-4">
            <img
              src={results.processed_image_base64}
              alt="Processed OMR Sheet with detected bubbles"
              className="max-w-full h-auto max-h-[900px] object-contain rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
