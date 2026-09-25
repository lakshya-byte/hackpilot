"use client";

import { useRef, useState } from "react";
import type { RubricCriterion } from "@/lib/types";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export default function RubricUpload({ onParsed }: { onParsed: (criteria: RubricCriterion[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  function pickFile(candidate: File | undefined) {
    setError("");
    if (!candidate) return;
    if (candidate.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setError("Rubric PDF must be 10MB or smaller.");
      return;
    }
    setFile(candidate);
  }

  async function handleParse() {
    if (!file) return;
    setParsing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("rubric", file);

      const res = await fetch("/api/pitch/parse-rubric", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Couldn't parse that rubric.");
        return;
      }

      onParsed(data.rubric_criteria as RubricCriterion[]);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setParsing(false);
    }
  }

  return (
    <div className="flex flex-col gap-space-sm">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed px-gutter py-space-lg text-center cursor-pointer transition-colors ${
          dragging
            ? "border-primary bg-primary-fixed/20"
            : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-[28px] text-on-surface-variant">
          picture_as_pdf
        </span>
        <p className="font-body text-body-sm text-on-surface-variant mt-space-xs">
          {file ? file.name : "Drag & drop your judging rubric PDF, or click to browse"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-error font-body text-body-sm">{error}</p>}

      <button
        type="button"
        onClick={handleParse}
        disabled={!file || parsing}
        className="self-start px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-60"
      >
        {parsing ? "Parsing Rubric..." : "Parse Rubric"}
      </button>
    </div>
  );
}
