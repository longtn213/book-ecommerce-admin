import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function BookDialog({ open, onClose, onSave, book }: any) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    isbn: '',
    price: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (book) setFormData(book);
  }, [book]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{book ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="title"
            label="Tiêu đề"
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            name="slug"
            label="Slug"
            fullWidth
            value={formData.slug}
            onChange={handleChange}
          />
          <TextField
            name="isbn"
            label="ISBN"
            fullWidth
            value={formData.isbn}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Giá bán"
            fullWidth
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
