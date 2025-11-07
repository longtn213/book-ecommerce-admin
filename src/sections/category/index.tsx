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
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/category';
interface CategoryForm {
  id: number | null;
  name: string;
  slug: string;
  categoryParentId: number | null;
}
export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const [form, setForm] = useState<CategoryForm>({
    id: null,
    name: '',
    slug: '',
    categoryParentId: null,
  });

  const token = localStorage.getItem('token') ?? '';

  // Pagination FE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedCategories = categories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories(token);
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi khi load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (category?: any) => {
    setEditingCategory(category || null);
    setForm(
      category
        ? {
            id: category.id,
            name: category.name,
            slug: category.slug,
            categoryParentId: category.parent?.id || null,
          }
        : {
            id: null,
            name: '',
            slug: '',
            categoryParentId: null,
          }
    );
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        // ✅ Gọi PUT /api/categories
        await updateCategory(token, {
          id: form.id,
          name: form.name,
          slug: form.slug,
          categoryParentId: form.categoryParentId || null,
        });
      } else {
        // ✅ Gọi POST /api/categories
        await createCategory(token, {
          name: form.name,
          slug: form.slug,
          categoryParentId: form.categoryParentId || null,
        });
      }
      await fetchCategories();
      setOpenDialog(false);
    } catch (err) {
      console.error('Lỗi khi lưu category:', err);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteCategory(token, confirmDelete.id);
      await fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xóa category:', err);
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>

    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Quản lý danh mục sách
      </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}
        >
          Thêm danh mục
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tên danh mục</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Danh mục cha</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.slug}</TableCell>
                      <TableCell>{c.parent ? c.parent.name : '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenDialog(c)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(c.id)}>
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
            count={categories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang"
            sx={{ px: 2 }}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa category */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              fullWidth
            />
            <TextField
              label="Danh mục cha"
              select
              value={form.categoryParentId ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryParentId: e.target.value ? Number(e.target.value) : null,
                })
              }
              fullWidth
            >
              <MenuItem value="">Không có</MenuItem>
              {categories
                .filter((c) => !c.parent)
                .map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
            </TextField>

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
            Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
