import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { updateAdminUser } from 'src/services/auth';
import type { UserProps } from './user-table-row';

// ----------------------------------------------------------------------

export type UpdateUserPayload = {
  id: number;
  username: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
  gender: string | null;
  role: string;
  userStatus: string;
  dateOfBirth?: string | null;
};

type UserEditModalProps = {
  open: boolean;
  user: UserProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

// ----------------------------------------------------------------------

export function UserEditModal({ open, user, onClose, onSuccess }: UserEditModalProps) {
  const { control, handleSubmit, reset } = useForm<UserProps>({
    defaultValues: {
      id: 0,
      username: '',
      fullName: '',
      email: '',
      phone: '',
      avatarUrl: '',
      gender: '',
      role: '',
      userStatus: '',
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth).format('YYYY-MM-DD') : '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserProps) => {
    try {
      if (!user) return;
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập');
        return;
      }

      const payload: UpdateUserPayload = {
        id: user.id,
        username: data.username,
        fullName: data.fullName ?? null,
        email: data.email,
        phone: data.phone ?? null,
        avatarUrl: data.avatarUrl ?? null,
        gender: data.gender ?? null,
        role: data.role,
        userStatus: data.userStatus,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).toISOString() : null,
      };

      await updateAdminUser(payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật người dùng!');
    }
  };

  if (!user) return null;

  // ----------------------------------------------------------------------

  // @ts-ignore
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Cập nhật người dùng
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fafafa' }}>
        <Box component="form" sx={{ mt: 1 }}>
          <Stack spacing={2} mt={1}>
            {/* Row 1: Username + Full Name */}
            <Stack direction="row" spacing={2}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Username" disabled size="small" />
                )}
              />
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Full Name" size="small" />
                )}
              />
            </Stack>

            {/* Row 2: Email + Phone */}
            <Stack direction="row" spacing={2}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Email" size="small" />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Phone" size="small" />
                )}
              />
            </Stack>

            {/* Row 3: Gender (rộng hơn) + Role */}
            <Stack direction="row" spacing={2}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Gender"
                    size="small"
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Role" size="small" >
                    <MenuItem value="CUSTOMER">Customer</MenuItem>
                    <MenuItem value="STAFF">Staff</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </TextField>
                )}
              />
            </Stack>

            {/* Row 4: Status + Date of Birth */}
            <Stack direction="row" spacing={2}>
              <Controller
                name="userStatus"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Status" size="small">
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="BANNED">Banned</MenuItem>
                  </TextField>
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val ? val.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{ px: 3 }}>
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
