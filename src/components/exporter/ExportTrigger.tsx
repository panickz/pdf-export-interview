'use client';

import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';

export function ExportTrigger({
  isTriggering,
  triggerExport,
}: {
  isTriggering: boolean;
  triggerExport: () => void;
}) {
  return (
    <Button onClick={triggerExport} disabled={isTriggering} size="lg">
      {isTriggering ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting Export...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Start New Export
        </>
      )}
    </Button>
  );
}