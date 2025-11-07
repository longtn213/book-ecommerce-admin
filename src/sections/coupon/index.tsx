import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../services/coupon';

// ----------------------------------------------------------------------

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // pagination FE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; code: string | null }>({
    open: false,
    code: null,
  });

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 0,
    minOrderTotal: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usagePerUserLimit: 0,
    startAt: '',
    endAt: '',
    status: 'ACTIVE',
  });

  const token = localStorage.getItem('token') ?? '';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getCoupons(token);
      setCoupons(res.data || []);
    } catch (err) {
      console.error('Lỗi khi load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedCoupons = coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenDialog = (coupon?: any) => {
    setEditingCoupon(coupon || null);
    setForm(
      coupon || {
        code: '',
        description: '',
        discountType: 'PERCENT',
        discountValue: '', // ✅ dùng string
        minOrderTotal: '',
        maxDiscountAmount: '',
        usageLimit: '',
        usagePerUserLimit: '',
        startAt: '',
        endAt: '',
        status: 'ACTIVE',
      }
    );
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingCoupon) {
        await updateCoupon(token, form);
      } else {
        await createCoupon(token, form);
      }
      await fetchCoupons();
      setOpenDialog(false);
    } catch (err) {
      console.error('Lỗi khi lưu coupon:', err);
    }
  };

  const handleDelete = async (code: string) => {
    setConfirmDelete({ open: true, code });
  };
  const handleConfirmDelete = async () => {
    if (!confirmDelete.code) return;

    try {
      await deleteCoupon(token, confirmDelete.code);
      await fetchCoupons();
    } catch (err) {
      console.error('Lỗi khi xóa coupon:', err);
    } finally {
      setConfirmDelete({ open: false, code: null });
    }
  };

  // ✅ Giao diện chính
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          Quản lý mã khuyến mãi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}
        >
          Thêm mã mới
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Mã</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giá trị</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đơn tối thiểu</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giảm tối đa</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giới hạn số lượt</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giới hạn số lần user dùng</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bắt đầu</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Kết thúc</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((c) => (
                    <TableRow
                      key={c.code}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>{c.discountType}</TableCell>
                      <TableCell>{c.discountValue}</TableCell>
                      <TableCell>{c.minOrderTotal}</TableCell>
                      <TableCell>{c.maxDiscountAmount}</TableCell>
                      <TableCell>{c.usageLimit}</TableCell>
                      <TableCell>{c.usagePerUserLimit}</TableCell>
                      <TableCell>
                        {c.startAt ? dayjs(c.startAt).format('YYYY-MM-DD HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        {c.endAt ? dayjs(c.endAt).format('YYYY-MM-DD HH:mm') : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenDialog(c)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(c.code)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      {loading ? 'Đang tải...' : 'Không có dữ liệu'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={coupons.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang"
            sx={{ px: 2 }}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editingCoupon ? 'Chỉnh sửa mã' : 'Thêm mã mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Mã giảm giá"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              disabled={!!editingCoupon}
              fullWidth
            />
            <TextField
              label="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Giá trị giảm"
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Loại giảm"
              select
              slotProps={{ select: { native: true } }} // ✅ API mới thay thế SelectProps
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              fullWidth
            >
              <option value="PERCENT">%</option>
              <option value="FIXED_AMOUNT">Giảm tiền</option>
            </TextField>

            {/* ✅ 2 cột cho các field số */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Đơn tối thiểu"
                type="number"
                value={form.minOrderTotal}
                onChange={(e) => setForm({ ...form, minOrderTotal: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Giảm tối đa"
                type="number"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Giới hạn tổng"
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Giới hạn mỗi user"
                type="number"
                value={form.usagePerUserLimit}
                onChange={(e) => setForm({ ...form, usagePerUserLimit: Number(e.target.value) })}
                fullWidth
              />
            </Stack>

            {/* ✅ Cột ngày: dùng 2 field trên cùng một hàng */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DateTimePicker
                  label="Ngày bắt đầu"
                  value={form.startAt ? dayjs(form.startAt) : null}
                  onChange={(newValue) =>
                    setForm({ ...form, startAt: newValue ? newValue.toISOString() : '' })
                  }
                  slotProps={{
                    textField: { fullWidth: true, size: 'medium' },
                  }}
                />
                <DateTimePicker
                  label="Ngày kết thúc"
                  value={form.endAt ? dayjs(form.endAt) : null}
                  onChange={(newValue) =>
                    setForm({
                      ...form,
                      endAt: newValue && newValue.isValid() ? newValue.toDate().toISOString() : '',
                    })
                  }
                  slotProps={{
                    textField: { fullWidth: true, size: 'medium' },
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, code: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa mã giảm giá <strong>{confirmDelete.code}</strong> không? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, code: null })}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ textTransform: 'none' }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
