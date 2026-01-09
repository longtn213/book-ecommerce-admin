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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  createPublisher,
  deletePublisher,
  getPublishers,
  updatePublisher,
} from '../../services/publisher';
import { useNotification } from '../../layouts/components/useNotification';

// ----------------------------------------------------------------------

interface PublisherForm {
  id: number | null;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export default function PublisherPage() {
  const [publishers, setPublishers] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const { showNotification, Notification } = useNotification();

  const [form, setForm] = useState<PublisherForm>({
    id: null,
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Pagination FE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginatedPublishers = publishers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const res = await getPublishers();
      setPublishers(res.data || []);
    } catch (err) {
      console.error('Lỗi khi load publishers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (publisher?: any) => {
    setEditingPublisher(publisher || null);
    setForm(
      publisher
        ? {
            id: publisher.id,
            name: publisher.name,
            address: publisher.address,
            contactEmail: publisher.contactEmail,
            contactPhone: publisher.contactPhone,
          }
        : {
            id: null,
            name: '',
            address: '',
            contactEmail: '',
            contactPhone: '',
          }
    );
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingPublisher) {
        await updatePublisher(form);
      } else {
        await createPublisher(form);
      }
      await fetchPublishers();
      setOpenDialog(false);
    } catch (err) {
      console.error('Lỗi khi lưu publisher:', err);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deletePublisher(confirmDelete.id);
      showNotification('Xóa nhà xuất bản thành công', 'success');
      await fetchPublishers();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Không thể xóa nhà xuất bản. Vui lòng thử lại.';

      showNotification(message, 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };


  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Quản lý nhà xuất bản
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}
        >
          Thêm nhà xuất bản
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tên NXB</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Địa chỉ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email liên hệ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SĐT liên hệ</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPublishers.length > 0 ? (
                  paginatedPublishers.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.address}</TableCell>
                      <TableCell>{p.contactEmail}</TableCell>
                      <TableCell>{p.contactPhone}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenDialog(p)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(p.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
            count={publishers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang"
            sx={{ px: 2 }}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa publisher */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editingPublisher ? 'Chỉnh sửa NXB' : 'Thêm NXB mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tên NXB"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email liên hệ"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa nhà xuất bản này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {Notification}
    </Box>
  );
}
