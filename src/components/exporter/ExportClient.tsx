
import { ExportList } from './ExportList';
import { ExportHeader } from './ExportHeader';
import { ExportTrigger } from './ExportTrigger';
import type { PdfExport } from '@/db/schema';
import { triggerExport as trigger } from '@/lib/serverActions';

export function ExportClient({
  initialExports,
}: {
  initialExports: PdfExport[];
}) {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <ExportHeader>
        <ExportTrigger
          isTriggering={false}
          triggerExport={trigger}
        />
      </ExportHeader>
      <ExportList exports={initialExports} />
    </div>
  );
}