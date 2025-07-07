import { ReactNode } from 'react'; 

export function ExportHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">PDF Export Dashboard</h1>
        <p className="text-muted-foreground">
          Generate and download PDF exports with temporary links
        </p>
      </div>
      {children}
    </div>
  );
}