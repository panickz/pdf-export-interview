"use client";

import { useTransition } from "react";
import { downloadFileAction } from "@/lib/serverActions";
import { Button } from "../ui/button";

export default function ExportDownload({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();

   const handleDownload = () => {
    startTransition(async () => {
      const result = await downloadFileAction(token);
      
      if (!result.success || !result.data) {
        alert(result.error || "Download failed");
        return;
      }

      // Convert Base64 back to binary
      const binaryString = atob(result.data);
      const byteArray = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([byteArray], { type: result.contentType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isPending}
      size="sm"
    >
      {isPending ? "Preparing download..." : "Download PDF"}
    </Button>
  );
}