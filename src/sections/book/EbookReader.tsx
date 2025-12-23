import { Box } from '@mui/material';

interface EbookReaderProps {
  fileUrl: string;
}

export default function EbookReader({ fileUrl }: EbookReaderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '75vh',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        backgroundColor: '#000',
      }}
    >
      <iframe
        src={fileUrl}
        title="Ebook Viewer"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          backgroundColor: '#000',
        }}
      />
    </Box>
  );
}
