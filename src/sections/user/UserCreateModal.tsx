import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import { createAdminUser } from 'src/services/auth';

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback khi thêm thành công
}

export function UserCreateModal({ open, onClose, onSuccess }: UserCreateModalProps) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Bạn chưa đăng nhập');

      await createAdminUser(form);
      onSuccess(); // reload list
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tạo user thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm người dùng mới</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Username"
            fullWidth
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <TextField
            select
            label="Role"
            fullWidth
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="STAFF">Staff</MenuItem>
            <MenuItem value="CUSTOMER">Customer</MenuItem>
          </TextField>
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
