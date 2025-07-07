'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ExportCard } from './ExportCard';
import { fetchInitialExports } from '@/lib/serverActions';
import type { PdfExport } from '@/db/schema';

interface ExportListProps {
  exports: PdfExport[];
}

export function ExportList({ exports: initialExports }: ExportListProps) {
  const [exports, setExports] = useState<PdfExport[]>(initialExports);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const pollData = async () => {
      try {
        const data = await fetchInitialExports();
        setExports(data);
      } catch (error) {
        console.error('Failed to fetch exports:', error);
      } finally {
        timeoutId = setTimeout(pollData, 1000);
      }
    };

    pollData();

    return () => clearTimeout(timeoutId);
  }, []);

  if (exports.length === 0) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-semibold'>No exports yet</h3>
            <p className='text-muted-foreground'>
              Click &quot;Start New Export&quot; to create your first PDF export
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid gap-4'>
      {exports.map((exportItem) => (
        <ExportCard key={exportItem.id} exportItem={exportItem} />
      ))}
    </div>
  );
}
