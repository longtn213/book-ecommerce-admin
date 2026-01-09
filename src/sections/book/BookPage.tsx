import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Paper,
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
import SearchIcon from '@mui/icons-material/Search';
import { getBooks, createBook, updateBook, deleteBook, getBookById } from '../../services/book';
import { getCategories } from '../../services/category';
import { getAuthors } from '../../services/author';
import { getPublishers } from '../../services/publisher';
import { useNotification } from '../../layouts/components/useNotification';
import BookDialog from './BookDialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export default function BookPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    authorId: '',
    publisherId: '',
    minPrice: '',
    maxPrice: '',
  });

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const { showNotification, Notification } = useNotification();

  // ✅ Load filter options
  const fetchFilterData = async () => {
    try {
      const [catRes, authRes, pubRes] = await Promise.all([
        getCategories(),
        getAuthors(),
        getPublishers(),
      ]);
      setCategories(catRes.data || catRes || []);
      setAuthors(authRes.data || authRes || []);
      setPublishers(pubRes.data || pubRes || []);
    } catch {
      showNotification('Không thể tải dữ liệu bộ lọc','error');
    }
  };

  // ✅ Load books
  const fetchBooks = async () => {
    try {
      const res = await getBooks({ page, size, ...filters });
      console.log("res", res.data);
      setBooks(res.data?.content || []);
      setTotal(res.data?.totalElements || 0);
    } catch {
      showNotification('Không thể tải danh sách sách' ,'error' );
    }
  };

  useEffect(() => {
    fetchFilterData();
    fetchBooks();
  }, [page, size]);

  // ✅ Thay đổi bộ lọc
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    setPage(0);
    fetchBooks();
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      authorId: '',
      publisherId: '',
      minPrice: '',
      maxPrice: '',
    });
    setPage(0);
    fetchBooks();
  };

  const handleOpenDialog = async (book?: any) => {
    if (book?.id) {
      try {
        const res = await getBookById(book.id);
        // backend của bạn trả về { success, data } hay chỉ data?
        // Nếu theo chuẩn hiện tại thì res.data.data, nhưng bạn viết getBookById return res.data nên dùng res
        setEditingBook(res.data || res);
      } catch (error) {
        showNotification('Không thể tải chi tiết sách', 'error');
        return;
      }
    } else {
      setEditingBook(null);
    }
    setOpenDialog(true);
  };

  const handleSaveBook = async (formData: any) => {
    const payload = {
      ...formData,
      imageUrls: formData.images, // ✅ đổi đúng tên field mà BE yêu cầu
    };
    delete payload.images;

    try {
      if (editingBook) {
        await updateBook(editingBook.id, payload);
        showNotification('Cập nhật sách thành công!', 'success');
      } else {
        await createBook(payload);
        showNotification('Thêm sách thành công!', 'success');
      }
      setOpenDialog(false);
      fetchBooks();
    } catch {
      showNotification('Lưu sách thất bại', 'error');
    }
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteBook(confirmDelete.id);

      showNotification('Xóa sách thành công!', 'success');
      setConfirmDelete(null);
      fetchBooks();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Xóa sách thất bại';

      showNotification(message, 'error');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Quản lý Sách
      </Typography>

      {/* Bộ lọc nâng cao */}
      {/* 🔍 Bộ lọc nâng cao - UI đẹp hơn */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          mb: 3,
          backgroundColor: '#fff',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {/* Ô tìm kiếm */}
          <Box sx={{ flexGrow: 1, minWidth: 220 }}>
            <TextField
              name="keyword"
              placeholder="Tìm theo tiêu đề, ISBN..."
              size="small"
              fullWidth
              value={filters.keyword}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#9e9e9e', mr: 1 }} />,
                sx: {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Bộ lọc theo danh mục */}
          <TextField
            name="categoryId"
            label="Thể loại"
            select
            size="small"
            value={filters.categoryId}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Bộ lọc theo tác giả */}
          <TextField
            name="authorId"
            label="Tác giả"
            select
            size="small"
            value={filters.authorId}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {authors.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Bộ lọc theo NXB */}
          <TextField
            name="publisherId"
            label="Nhà xuất bản"
            select
            size="small"
            value={filters.publisherId}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {publishers.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Bộ lọc theo giá */}
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              name="minPrice"
              label="Giá từ"
              size="small"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              sx={{ width: 110 }}
            />
            <Typography variant="body2" sx={{ color: '#757575' }}>
              -
            </Typography>
            <TextField
              name="maxPrice"
              label="Đến"
              size="small"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              sx={{ width: 110 }}
            />
          </Stack>

          {/* Nút hành động */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                color: 'white',
                px: 3,
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { background: 'linear-gradient(45deg, #1e88e5, #00bcd4)' },
              }}
              onClick={handleSearch}
            >
              Lọc
            </Button>
            <Button
              onClick={handleReset}
              sx={{
                color: '#9c27b0',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Xóa lọc
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Bảng dữ liệu */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Danh sách sách</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              Thêm mới
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Tồn kho</TableCell>
                  <TableCell>Trang</TableCell>
                  <TableCell>Ngôn ngữ</TableCell>
                  <TableCell>Năm XB</TableCell>
                  <TableCell>NXB</TableCell>
                  <TableCell>Tác giả</TableCell>
                  <TableCell>Thể loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {books.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>{b.isbn}</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.description}
                    </TableCell>
                    <TableCell>{b.price?.toLocaleString()} ₫</TableCell>
                    <TableCell>{b.stockQuantity}</TableCell>
                    <TableCell>{b.pages}</TableCell>
                    <TableCell>{b.language}</TableCell>
                    <TableCell>{b.publishYear}</TableCell>
                    <TableCell>{b.publisherName}</TableCell>
                    <TableCell>{b.authors?.join(', ')}</TableCell>
                    <TableCell>{b.categories?.join(', ')}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(b)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setConfirmDelete(b)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={size}
            onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa */}
      <BookDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveBook}
        book={editingBook}
        categories={categories}
        authors={authors}
        publishers={publishers}
      />


      {/* Dialog xác nhận xóa */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa sách "${confirmDelete?.title}" không?`}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Snackbar thông báo */}
      {Notification}
    </Box>
  );
}
