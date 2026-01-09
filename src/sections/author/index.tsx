import { useEffect, useState } from 'react';
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
  Avatar,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../services/author';
import { uploadToCloudinary } from '../../utils/cloudinary.helper';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useNotification } from '../../layouts/components/useNotification';

export default function AuthorPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const [form, setForm] = useState({
    id: null,
    name: '',
    bio: '',
    avatarUrl: '',
  });

  const { showNotification, Notification } = useNotification();

  // Pagination FE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedAuthors = authors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await getAuthors();

      setAuthors(res.data || []);
    } catch (err) {
      console.error('Lỗi khi load authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (author?: any) => {
    setEditingAuthor(author || null);
    setForm(
      author || {
        id: null,
        name: '',
        bio: '',
        avatarUrl: '',
      }
    );
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingAuthor) {
        await updateAuthor(form);
      } else {
        await createAuthor(form);
      }
      await fetchAuthors();
      setOpenDialog(false);
    } catch (err) {
      console.error('Lỗi khi lưu tác giả:', err);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteAuthor(confirmDelete.id);
      showNotification('Xóa tác giả thành công', 'success');
      await fetchAuthors();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Không thể xóa tác giả. Vui lòng thử lại.';

      showNotification(message, 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };


  // ✅ Upload ảnh lên Cloudinary
  const handleUploadImage = async (file: File) => {
    setUploading(true);
    const url = await uploadToCloudinary(file, 'book_ecommerce/authors');
    if (url) {
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } else {
      alert('Tải ảnh thất bại!');
    }
    setUploading(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý tác giả</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}
        >
          Thêm tác giả
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ảnh</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tên tác giả</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tiểu sử</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAuthors.length > 0 ? (
                  paginatedAuthors.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>
                        <Avatar src={a.avatarUrl} alt={a.name} sx={{ width: 50, height: 50 }} />
                      </TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.bio}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenDialog(a)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(a.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
            count={authors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang"
            sx={{ px: 2 }}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa tác giả */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { overflowX: 'hidden' } }}
      >
        <DialogTitle>{editingAuthor ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</DialogTitle>
        <DialogContent sx={{ overflowX: 'hidden' }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tên tác giả"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tiểu sử"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{ '& .MuiInputBase-root': { overflowX: 'hidden' } }}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                disabled={uploading}
                sx={{ borderRadius: 2 }}
              >
                {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadImage(file);
                  }}
                />
              </Button>
              {form.avatarUrl && (
                <Avatar
                  src={form.avatarUrl}
                  alt="preview"
                  sx={{ width: 64, height: 64, borderRadius: '8px' }}
                />
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmDelete.open}
        title="Xác nhận xóa tác giả"
        message="Bạn có chắc chắn muốn xóa tác giả này không? Hành động này không thể hoàn tác."
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
      />
      {Notification}
    </Box>
  );
}
