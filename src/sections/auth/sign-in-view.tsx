/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { forgotPasswordApi, loginApi } from '../../services/auth';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgot, setIsForgot] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [email, setEmail] = useState(''); // for forgot password

  const handleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginApi(userName, password); // ✅ Gọi API thật
      const token = res.data.token;

      // ✅ Decode token
      const decoded: JwtPayload & { role?: string } = jwtDecode(token);

      // ✅ Kiểm tra quyền
      const userRole = decoded.role ;
      if (!userRole || !['ADMIN', 'STAFF'].includes(userRole.toUpperCase())) {
        setError('Bạn không có quyền truy cập hệ thống này.');
        return;
      }

      // ✅ Nếu hợp lệ -> lưu token & thông tin
      localStorage.setItem('token', token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('role', userRole);

      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Sai username hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  }, [userName, password, router]);

  // 🔹 Handle forgot password
  const handleForgotPassword = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      const domain = window.location.origin;

      await forgotPasswordApi(email,domain);
      setSuccessMsg('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
      setEmail('');
    } catch (err) {
      setError('Không thể gửi yêu cầu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">{isForgot ? 'Forgot Password' : 'Sign in'}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {isForgot ? (
            <>
              Nhập email của bạn để nhận link đặt lại mật khẩu
              <Link
                variant="subtitle2"
                sx={{ ml: 0.5, cursor: 'pointer' }}
                onClick={() => setIsForgot(false)}
              >
                Quay lại đăng nhập
              </Link>
            </>
          ) : (
            <>
              Don’t have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }}>
                Get started
              </Link>
            </>
          )}
        </Typography>
      </Box>

      {/* Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isForgot ? (
          <>
            <TextField
              fullWidth
              name="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {successMsg && <Typography color="success.main">{successMsg}</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send reset link'}
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              name="userName"
              label="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify
                          icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Link
              variant="body2"
              color="primary"
              sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
              onClick={() => setIsForgot(true)}
            >
              Forgot password?
            </Link>

            {error && <Typography color="error">{error}</Typography>}

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign in'}
            </Button>
          </>
        )}
      </Box>

      {/* Footer */}
      {!isForgot && (
        <>
          <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
            >
              OR
            </Typography>
          </Divider>

          <Box sx={{ gap: 1, display: 'flex', justifyContent: 'center' }}>
            <IconButton color="inherit">
              <Iconify width={22} icon="socials:google" />
            </IconButton>
            <IconButton color="inherit">
              <Iconify width={22} icon="socials:github" />
            </IconButton>
            <IconButton color="inherit">
              <Iconify width={22} icon="socials:twitter" />
            </IconButton>
          </Box>
        </>
      )}
    </>
  );
}
