
import { Clock, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import type { JSX } from 'react';

export const getStatusIcon = (status: string): JSX.Element => {
  const icons: Record<string, JSX.Element> = {
    pending: <Clock className='h-4 w-4' />,
    processing: <Loader2 className='h-4 w-4 animate-spin' />,
    completed: <CheckCircle className='h-4 w-4' />,
    failed: <XCircle className='h-4 w-4' />,
  };
  return icons[status] || <FileText className='h-4 w-4' />;
};

export const getStatusColor = (
  status: string
): 'secondary' | 'outline' | 'default' | 'destructive' | undefined => {
  const colors: Record<string, any> = {
    pending: 'secondary',
    processing: 'outline',
    completed: 'default',
    failed: 'destructive',
  };
  return colors[status] || 'secondary';
};

export const isExpired = (expiresAt: string | null): boolean => {
  return !!expiresAt && new Date() > new Date(expiresAt);
};

export const getTimeRemaining = (expiresAt: string | null): string | null => {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';
  return `${Math.floor(diff / 1000)}s remaining`;
};


