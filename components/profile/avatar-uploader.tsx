"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function AvatarUploader({
  name,
  avatarUrl,
  onUploaded,
}: {
  name: string;
  avatarUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  async function handleFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        setPreview(avatarUrl);
        return;
      }

      onUploaded(data.avatar_url);
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setPreview(avatarUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center shadow-md">
          {preview ? (
            <Image
              src={preview}
              alt={`${name}'s avatar`}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-headline-lg text-on-primary-fixed-variant">
              {initial}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Change avatar"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-surface-tint transition-colors disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[16px]">
            {uploading ? "hourglass_top" : "photo_camera"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <p className="mt-space-xs text-error font-body text-body-sm text-center max-w-[180px]">
          {error}
        </p>
      )}
    </div>
  );
}
