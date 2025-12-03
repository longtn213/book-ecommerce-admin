import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { resetPasswordApi } from '../../services/auth';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Liên kết không hợp lệ hoặc đã hết hạn.');
    }
  }, [token]);

  const handleSubmit = useCallback(async () => {
    if (!token) return;

    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      await resetPasswordApi(token, password);

      setMessage('✅ Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err: any) {
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu liên kết mới.');
    } finally {
      setLoading(false);
    }
  }, [token, password, confirmPassword, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          Đặt lại mật khẩu
        </Typography>

        {!token && (
          <Typography color="error">
            Liên kết không hợp lệ hoặc đã hết hạn.
          </Typography>
        )}

        {token && (
          <>
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
            {message && <Typography color="success.main" sx={{ mb: 1 }}>{message}</Typography>}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !token}
            >
              {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
            </Button>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="text"
              color="inherit"
              onClick={() => navigate('/sign-in')}
            >
              Quay lại đăng nhập
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
