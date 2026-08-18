"use client";

import { useState, useEffect } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch and flash
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg bg-muted/50">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Preview State (When an image URL exists)
  if (value) {
    return (
      <div className="relative w-40 h-40">
        <img
          src={value}
          alt="Upload preview"
          className="w-40 h-40 rounded-md object-cover border"
        />
        <button
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  // Dropzone State (Automatic upload on drop/select + clear progress indication)
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const url =
          res?.[0]?.serverData?.fileUrl ??
          res?.[0]?.ufsUrl ??
          res?.[0]?.url;

        if (url) onChange(url);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
      appearance={{
        container: "border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors p-6 rounded-lg cursor-pointer",
        label: "text-sm font-medium text-foreground hover:text-primary",
        allowedContent: "text-xs text-muted-foreground mt-1",
        button: "bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 py-1.5 rounded-md mt-2",
      }}
    />
  );
}

export default ImageUpload;