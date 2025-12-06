type Props = {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
};

export function UploadStatusPanel({ status, message }: Props) {
  if (status === 'idle') return null;
  const color = status === 'error' ? 'text-red-300' : 'text-accent-blue';
  return (
    <div className={`rounded-lg bg-white/5 px-4 py-3 ${color}`}>
      {status === 'uploading' && 'Uploading...'}
      {status === 'success' && 'Upload complete!'}
      {status === 'error' && `Upload failed: ${message}`}
    </div>
  );
}
