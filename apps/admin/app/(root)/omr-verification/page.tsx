"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, ScanLine, FileCheck2, AlertCircle,
  CheckCircle2, XCircle, RefreshCw, ShieldCheck, ShieldAlert, ShieldX, Info, Crop
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface OMRConfidence {
  overall: number;
  fiducials_found: boolean;
  qr_detected: boolean;
  bubbles_found: number;
  roll_bubbles: number;
  mcq_bubbles: number;
  divider_y: number;
  num_columns: number;
  input_resolution: string;
  working_resolution: string;
}

interface OMRResult {
  paperId: string;
  rollNumber: string;
  answers: Record<string, string>;
  processed_image_base64?: string;
  confidence: OMRConfidence;
  warnings: string[];
}

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  if (pct >= 75) return (
    <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm">
      <ShieldCheck className="w-4 h-4" /> {pct}% Confidence
    </span>
  );
  if (pct >= 45) return (
    <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-sm">
      <ShieldAlert className="w-4 h-4" /> {pct}% Confidence
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm">
      <ShieldX className="w-4 h-4" /> {pct}% Confidence
    </span>
  );
}

function ManualCrop({
  previewUrl,
  onProcess,
  onCancel
}: {
  previewUrl: string;
  onProcess: (corners: [number, number][]) => void;
  onCancel: () => void;
}) {
  // Keep track of 4 points in percentages (0 to 1) so it maps smoothly to the responsive image
  const [points, setPoints] = useState([
    { x: 0.05, y: 0.05 }, // Top-Left
    { x: 0.95, y: 0.05 }, // Top-Right
    { x: 0.95, y: 0.95 }, // Bottom-Right
    { x: 0.05, y: 0.95 }, // Bottom-Left
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingIdx(idx);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdx === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;
    
    // Clamp to 0-1
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    setPoints(prev => {
      const newPts = [...prev];
      newPts[draggingIdx] = { x, y };
      return newPts;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingIdx(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleConfirm = () => {
    if (!imgRef.current) return;
    const nw = imgRef.current.naturalWidth;
    const nh = imgRef.current.naturalHeight;
    // Map percentages to natural image pixels
    const corners = points.map(p => [Math.round(p.x * nw), Math.round(p.y * nh)]) as [number, number][];
    onProcess(corners);
  };

  // Helper to generate SVG polygon points
  const polygonPoints = points.map(p => `${p.x * 100}% ${p.y * 100}%`).join(', ');

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Crop className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Align Corners</h3>
          <p className="text-sm text-blue-800/80 mt-1">
            Drag the 4 corner points to exactly match the 4 black square markers on the OMR sheet. 
            This guarantees a 100% accurate scan even if the photo is taken at a steep angle.
          </p>
        </div>
      </div>

      <div 
        className="relative mx-auto touch-none select-none bg-muted/20 border border-border/40 rounded-xl overflow-hidden shadow-inner"
        style={{ width: 'fit-content' }}
      >
        <div ref={containerRef} onPointerMove={handlePointerMove} className="relative">
          <img 
            ref={imgRef}
            src={previewUrl} 
            alt="Crop preview" 
            className="max-w-full max-h-[55vh] object-contain block pointer-events-none"
            draggable={false}
          />
          {/* Transparent SVG overlay for lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <polygon 
              points={polygonPoints}
              fill="rgba(59, 130, 246, 0.15)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          {/* Draggable corner handles */}
          {points.map((p, i) => (
            <div
              key={i}
              className="absolute w-10 h-10 -ml-5 -mt-5 bg-white/90 backdrop-blur-sm border-2 border-blue-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing touch-none flex items-center justify-center group z-10 transition-colors hover:bg-blue-50"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              onPointerDown={(e) => handlePointerDown(i, e)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleConfirm} size="lg" className="min-w-[200px]">
          Confirm & Process Image
        </Button>
      </div>
    </div>
  );
}

export default function OMRVerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'crop' | 'processing' | 'results'>('upload');
  
  const [results, setResults] = useState<OMRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
      setStep('crop');
    }
  };

  const handleProcess = async (manualCorners: [number, number][]) => {
    if (!file) return;
    setStep('processing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Append the manual corners as JSON
      formData.append("manual_corners", JSON.stringify(manualCorners));

      const apiUrl = process.env.NEXT_PUBLIC_OMR_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/omr/verify`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.detail || `Server error ${response.status}`);
        setStep('upload');
        return;
      }

      if (data.success) {
        setResults(data.data);
        setStep('results');
      } else {
        setError("Engine error: " + (data.message || "Unknown"));
        setStep('upload');
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to OMR engine. Is it running?");
      setStep('upload');
    }
  };

  // Sort answers numerically
  const sortedAnswers = results
    ? Object.entries(results.answers).sort(([a], [b]) => parseInt(a) - parseInt(b))
    : [];

  const totalAnswered = sortedAnswers.filter(([, a]) => a !== "BLANK" && a !== "DOUBLE").length;
  const totalBlank = sortedAnswers.filter(([, a]) => a === "BLANK").length;
  const totalDouble = sortedAnswers.filter(([, a]) => a === "DOUBLE").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-glow">
          <ScanLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            OMR Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload OMR sheets — supports flatbed scans and camera phone photos.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-600 animate-in slide-in-from-top-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── View Router ─────────────────────────────────────────── */}
      {step === 'upload' && (
        <div className="bg-card border border-border/50 rounded-2xl p-12 shadow-sm text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="omr-upload"
            onChange={handleFileChange}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="max-w-md mx-auto flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Select or Capture Photo
            </h3>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, WEBP — any resolution
            </p>
          </div>
        </div>
      )}

      {step === 'crop' && preview && (
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <ManualCrop 
            previewUrl={preview} 
            onProcess={handleProcess} 
            onCancel={() => {
              setStep('upload');
              setFile(null);
              setPreview(null);
            }} 
          />
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-card border border-border/50 rounded-2xl p-24 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Processing OMR Sheet...</h3>
          <p className="text-muted-foreground">Applying perspective warp, reading QR, and analyzing bubbles.</p>
        </div>
      )}

      {step === 'results' && results && (
        <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Results Summary */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-primary" />
                Results
              </h3>
              <Button variant="outline" size="sm" onClick={() => {
                setStep('upload');
                setFile(null);
                setPreview(null);
              }}>
                Scan Another
              </Button>
            </div>

            <div className="space-y-6">
              {/* Confidence badge */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${
                results.confidence.overall >= 0.75
                  ? "bg-green-500/10 border-green-500/20"
                  : results.confidence.overall >= 0.45
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}>
                <ConfidenceBadge score={results.confidence.overall} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span title="Fiducial markers">
                    {results.confidence.fiducials_found ? "✅ Markers" : "⚠ No markers"}
                  </span>
                  <span title="QR code">
                    {results.confidence.qr_detected ? "✅ QR" : "⚠ No QR"}
                  </span>
                  <span>{results.confidence.bubbles_found} bubbles</span>
                </div>
              </div>

              {/* Roll + Paper ID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Roll Number</div>
                  <div className="text-2xl font-bold font-mono">{results.rollNumber}</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Paper ID</div>
                  <div className="text-sm font-bold font-mono truncate">{results.paperId}</div>
                </div>
              </div>

              {/* Score summary */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">{totalAnswered}</div>
                  <div className="text-xs text-muted-foreground">Answered</div>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-400/20">
                  <div className="text-2xl font-bold text-orange-500">{totalDouble}</div>
                  <div className="text-xs text-muted-foreground">Double</div>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-2xl font-bold text-red-500">{totalBlank}</div>
                  <div className="text-xs text-muted-foreground">Blank</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/30">
                  <div className="text-2xl font-bold">{sortedAnswers.length}</div>
                  <div className="text-xs text-muted-foreground">Total Qs</div>
                </div>
              </div>

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div className="space-y-2">
                  {results.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-yellow-500/8 border border-yellow-500/20 rounded-lg text-sm text-yellow-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Answers grid */}
              <div className="border border-border/50 rounded-xl overflow-hidden">
                <div className="bg-muted/30 p-3.5 text-sm font-semibold border-b border-border/50">
                  Extracted Answers
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {sortedAnswers.map(([q, a]) => (
                    <div
                      key={q}
                      className={`flex justify-between items-center p-2.5 rounded-lg border text-sm ${
                        a === "DOUBLE"
                          ? "bg-orange-500/10 border-orange-400/30"
                          : a === "BLANK"
                          ? "bg-muted/30 border-border/20"
                          : "bg-background border-border/30"
                      }`}
                    >
                      <span className="text-muted-foreground font-medium">Q{q}</span>
                      <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                        a === "DOUBLE"
                          ? "bg-orange-500/20 text-orange-600"
                          : a === "BLANK"
                          ? "text-muted-foreground"
                          : ""
                      }`}>
                        {a === "DOUBLE" ? "⚠ DBL" : String(a)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Proof */}
          {results.processed_image_base64 && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <ScanLine className="w-5 h-5 text-primary" />
                Visual Proof
              </h3>
              
              <div className="flex-1 border border-border/50 rounded-xl overflow-hidden bg-muted/10 flex items-center justify-center p-4">
                <img
                  src={results.processed_image_base64}
                  alt="Processed OMR Sheet"
                  className="max-w-full h-auto max-h-[700px] object-contain rounded-lg shadow-sm"
                />
              </div>

              {/* Legend / Debug toggle */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Answer</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Double</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-red-500"></span> Blank</span>
                </div>
                
                <button
                  onClick={() => setShowDebug(v => !v)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info className="w-3 h-3" />
                  {showDebug ? "Hide" : "Show"} Debug
                </button>
              </div>

              {showDebug && (
                <div className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/30 text-xs font-mono space-y-1.5 text-muted-foreground overflow-x-auto">
                  <div><span className="text-foreground/70">Resolution:</span> {results.confidence.input_resolution} → {results.confidence.working_resolution}</div>
                  <div><span className="text-foreground/70">Total Bubbles:</span> {results.confidence.bubbles_found} <span className="opacity-60">(Roll: {results.confidence.roll_bubbles}, MCQ: {results.confidence.mcq_bubbles})</span></div>
                  <div><span className="text-foreground/70">Metrics:</span> Divider Y: {results.confidence.divider_y}px, Cols: {results.confidence.num_columns}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
