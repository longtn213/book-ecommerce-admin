import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export function useNotification() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showNotification = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const Notification = (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={severity}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );

  return { showNotification, Notification };
}
