'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusIcon, getStatusColor, isExpired, getTimeRemaining } from '@/lib/exporterHelper';
import type { PdfExport } from '@/db/schema';
import ExportDownload from './ExportDownload';

export function ExportCard({ exportItem }: { exportItem: PdfExport }) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {getStatusIcon(exportItem.status)}
            <CardTitle className='text-lg'>Export #{exportItem.id}</CardTitle>
            <Badge variant={getStatusColor(exportItem.status)}>{exportItem.status}</Badge>
          </div>
          <div className='text-muted-foreground text-sm'>
            {new Date(exportItem.createdAt).toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            {exportItem.status === 'completed' && exportItem.downloadToken && (
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium'>Download:</span>
                {isExpired(exportItem?.expiresAt) ? (
                  <Badge variant='destructive'>Link Expired</Badge>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>{getTimeRemaining(exportItem?.expiresAt)}</Badge>
                    <Button size='sm' asChild>
                      <ExportDownload token={exportItem.downloadToken} />
                    </Button>
                  </div>
                )}
              </div>
            )}
            {exportItem.status === 'processing' && (
              <p className='text-muted-foreground text-sm'>Processing your PDF export...</p>
            )}
            {exportItem.status === 'pending' && (
              <p className='text-muted-foreground text-sm'>
                Export queued and waiting to be processed...
              </p>
            )}
            {exportItem.status === 'failed' && (
              <p className='text-destructive text-sm'>Export failed. Please try again.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
