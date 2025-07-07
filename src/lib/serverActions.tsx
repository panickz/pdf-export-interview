'use server';

import { db } from '@/db';
import { pdfExports } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { PdfExport } from '@/db/schema';
import { Client } from '@upstash/qstash';
import { eq, and } from 'drizzle-orm';

export async function fetchInitialExports(): Promise<PdfExport[]> {
  const exports = await db
    .select()
    .from(pdfExports)
    .orderBy(desc(pdfExports.createdAt))
    .offset(0)
    .limit(100);

  return exports;
}

const QSTASH_TOKEN = process.env.QSTASH_TOKEN!;
const VERCEL_URL = process.env.VERCEL_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${VERCEL_URL}/api/process`;

export async function triggerExport() {
  const sourceUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  const [pdfExport] = await db
    .insert(pdfExports)
    .values({
      status: 'pending',
      sourceUrl,
    })
    .returning();

  const qstash = new Client({
    token: QSTASH_TOKEN,
  });

  const response = await qstash.publishJSON({
    url: WEBHOOK_URL,
    body: JSON.stringify({
      exportId: pdfExport.id,
      sourceUrl,
    }),
  });

  if (!response) {
    throw new Error('Failed to queue job');
  }
}

export const downloadFileAction = async (token: string) => {
  try {
    const [pdfExport] = await db
      .select()
      .from(pdfExports)
      .where(and(
        eq(pdfExports.downloadToken, token),
        eq(pdfExports.status, "completed")
      ))
      .limit(1);

    if (!pdfExport) return { success: false, error: "Invalid or expired download link" };
    if (pdfExport.expiresAt && new Date() > pdfExport.expiresAt) return { success: false, error: "Download link has expired" };

    const pdfResponse = await fetch(pdfExport.sourceUrl);
    if (!pdfResponse.ok) throw new Error("Failed to fetch PDF");

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const filename = `export-${pdfExport.id}.pdf`;

    return {
      success: true,
      data: base64Data, 
      filename,
      contentType: "application/pdf"
    };
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return { success: false, error: "Failed to download PDF" };
  }
};
