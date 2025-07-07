import { ExportClient } from './ExportClient';
import { fetchInitialExports } from '@/lib/serverActions';

export default async function PdfExport() {
  const initialExports = await fetchInitialExports();
  return <ExportClient initialExports={initialExports} />;
}
