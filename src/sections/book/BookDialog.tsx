import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Box,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { uploadToCloudinary } from '../../utils/cloudinary.helper';
import { getEBookByBookId, uploadEBookPdf } from '../../services/ebook';
import EbookReader from './EbookReader';

interface BookFormData {
  title: string;
  slug: string;
  isbn: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  pages: number | string;
  language: string;
  publishYear: number | string;
  status: string;
  images: string[];
  categoryIds: number[];
  authorIds: number[];
  publisherId: string;
}

interface EbookInfo {
  ebookId: number;
  fileUrl: string;
  fileSize: number;
  fileType: 'PDF';
}

export default function BookDialog({ open, onClose, onSave, book, categories, authors, publishers }: any) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    slug: '',
    isbn: '',
    description: '',
    price: 0,
    costPrice: 0,
    stockQuantity: 0,
    pages: '',
    language: 'Tiếng Việt',
    publishYear: '',
    status: 'ACTIVE',
    images: [],
    categoryIds: [],
    authorIds: [],
    publisherId: '',
  });
  const [uploading, setUploading] = useState(false);
  const isFormValid =
    formData.title &&
    formData.slug &&
    formData.isbn &&
    formData.description &&
    Number(formData.price) > 0 &&
    Number(formData.costPrice) > 0 &&
    Number(formData.stockQuantity) >= 0 &&
    formData.publisherId &&
    formData.categoryIds.length > 0 &&
    formData.authorIds.length > 0 &&
    formData.images.length > 0;

  const [ebook, setEbook] = useState<EbookInfo | null>(null);
  const [uploadingEbook, setUploadingEbook] = useState(false);
  const [openReader, setOpenReader] = useState(false);

  useEffect(() => {
    if (open && book?.id) {
      getEBookByBookId(book.id)
        .then((res) => {
          if (res.success) {
            setEbook(res.data);
          } else {
            setEbook(null);
          }
        })
        .catch(() => setEbook(null));
    }
  }, [open, book?.id]);

  const handleUploadEbook = async (file: File) => {
    if (!book?.id) return;

    setUploadingEbook(true);
    try {
      const res = await uploadEBookPdf(book.id, file);

      if (res.success) {
        setEbook(res.data);
      } else {
        alert(res.message || 'Upload ebook thất bại');
      }
    } finally {
      setUploadingEbook(false);
    }
  };


  useEffect(() => {
    if (open) {
      if (book) {
        // ✅ Tìm ID tương ứng dựa theo tên
        const matchedCategoryIds = categories
          .filter((c: any) => book.categories?.includes(c.name))
          .map((c: any) => c.id);

        const matchedAuthorIds = authors
          .filter((a: any) => book.authors?.includes(a.name))
          .map((a: any) => a.id);

        const matchedPublisher = publishers.find(
          (p: any) => p.name === book.publisherName
        );

        setFormData({
          ...book,
          images: book.images || [],
          categoryIds: matchedCategoryIds,
          authorIds: matchedAuthorIds,
          publisherId: matchedPublisher ? matchedPublisher.id : '',
        });
      } else {
        setFormData({
          title: '',
          slug: '',
          isbn: '',
          description: '',
          price: 0,
          stockQuantity: 0,
          costPrice: 0,
          pages: '',
          language: 'Tiếng Việt',
          publishYear: '',
          status: 'ACTIVE',
          images: [],
          categoryIds: [],
          authorIds: [],
          publisherId: '',
        });
      }
    }
  }, [book, open, categories, authors, publishers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'costPrice', 'stockQuantity', 'pages', 'publishYear'].includes(name)
        ? Number(value)
        : value,
    }));
  };
  
  const handleMultiSelectChange = (name: string, value: any[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Upload ảnh lên Cloudinary
  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const imageUrl = await uploadToCloudinary(file, 'book_ecommerce');
    setUploading(false);
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrl],
      }));
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
            name="description"
            label="Mô tả"
            fullWidth
            multiline
            minRows={3}
            value={formData.description}
            onChange={handleChange}
          />
          {/* 💰 Giá bán, Giá nhập, Tồn kho */}
          <Stack direction="row" spacing={2}>
            <NumericFormat
              customInput={TextField}
              label="Giá bán"
              name="price"
              thousandSeparator="."
              decimalSeparator=","
              suffix=" ₫"
              fullWidth
              value={formData.price}
              onValueChange={(values) =>
                setFormData((prev) => ({ ...prev, price: values.floatValue ?? 0 }))
              }
            />

            <NumericFormat
              customInput={TextField}
              label="Giá nhập"
              name="costPrice"
              thousandSeparator="."
              decimalSeparator=","
              suffix=" ₫"
              fullWidth
              value={formData.costPrice}
              onValueChange={(values) =>
                setFormData((prev) => ({ ...prev, costPrice: values.floatValue ?? 0 }))
              }
            />
            <NumericFormat
              customInput={TextField}
              label="Tồn kho"
              name="stockQuantity"
              thousandSeparator="."
              decimalSeparator=","
              fullWidth
              value={formData.stockQuantity}
              onValueChange={(values) =>
                setFormData((prev) => ({ ...prev, stockQuantity: values.floatValue ?? 0 }))
              }
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              name="pages"
              label="Số trang"
              type="number"
              fullWidth
              value={formData.pages}
              onChange={handleChange}
            />
            <TextField
              name="publishYear"
              label="Năm xuất bản"
              type="number"
              fullWidth
              value={formData.publishYear}
              onChange={handleChange}
            />
          </Stack>

          {/* 🔹 Dropdown chọn thể loại / tác giả / NXB */}
          <Stack direction="row" spacing={2}>
            {/* 🟦 Thể loại */}
            <FormControl fullWidth>
              <InputLabel>Thể loại</InputLabel>
              <Select
                multiple
                name="categoryIds"
                value={formData.categoryIds}
                onChange={(e) => {
                  const value = e.target.value;
                  handleMultiSelectChange('categoryIds', Array.isArray(value) ? value : [value]);
                }}
                input={<OutlinedInput label="Thể loại" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const c = categories.find((item: any) => item.id === id);
                      return <Chip key={id} label={c?.name} color="secondary" variant="outlined" />;
                    })}
                  </Box>
                )}
              >
                {categories.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 🟩 Tác giả */}
            <FormControl fullWidth>
              <InputLabel>Tác giả</InputLabel>
              <Select
                multiple
                name="authorIds"
                value={formData.authorIds}
                onChange={(e) => {
                  const value = e.target.value;
                  handleMultiSelectChange('authorIds', Array.isArray(value) ? value : [value]);
                }}
                input={<OutlinedInput label="Tác giả" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const a = authors.find((item: any) => item.id === id);
                      return <Chip key={id} label={a?.name} color="info" variant="outlined" />;
                    })}
                  </Box>
                )}
              >
                {authors.map((a: any) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 🟨 Nhà xuất bản */}
            <FormControl fullWidth>
              <InputLabel>Nhà xuất bản</InputLabel>
              <Select
                name="publisherId"
                value={formData.publisherId}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Nhà xuất bản" />}
              >
                {publishers.map((p: any) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              name="language"
              label="Ngôn ngữ"
              fullWidth
              value={formData.language}
              onChange={handleChange}
            />
            <TextField
              name="status"
              label="Trạng thái"
              select
              fullWidth
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="OUT_OF_STOCK">OUT_OF_STOCK</MenuItem>
            </TextField>
          </Stack>

          {/* 🖼️ Upload ảnh */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Ảnh bìa sách
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              {formData.images?.map((url, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <img
                    src={url}
                    alt={`book-img-${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(url)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {/* Thêm ảnh */}
              <Box
                component="label"
                sx={{
                  width: 120,
                  height: 120,
                  border: '2px dashed #90caf9',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  color: '#42a5f5',
                  backgroundColor: 'rgba(66,165,245,0.05)',
                  '&:hover': {
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66,165,245,0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(66,165,245,0.3)',
                  },
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 0.5 }} />
                <Typography fontSize={13} fontWeight={500}>
                  {uploading ? 'Đang tải...' : 'Thêm ảnh'}
                </Typography>
                <input type="file" accept="image/*" hidden onChange={handleUploadImage} />
              </Box>
            </Stack>
          </Box>

          {/* 📘 Ebook PDF */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Ebook (PDF)
            </Typography>

            {ebook ? (
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                }}
              >
                <Typography fontSize={14}>📄 Ebook đã upload</Typography>

                <Typography fontSize={13} color="text.secondary">
                  Dung lượng: {(ebook.fileSize / 1024 / 1024).toFixed(2)} MB
                </Typography>

                <Stack direction="row" spacing={2} mt={1}>
                  <Button size="small" variant="outlined" onClick={() => setOpenReader(true)}>
                    Xem ebook
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    component="label"
                    disabled={uploadingEbook}
                  >
                    {uploadingEbook ? 'Đang upload...' : 'Thay ebook'}
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => e.target.files && handleUploadEbook(e.target.files[0])}
                    />
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Button variant="outlined" component="label" disabled={!book?.id || uploadingEbook}>
                {uploadingEbook ? 'Đang upload...' : 'Upload ebook PDF'}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => e.target.files && handleUploadEbook(e.target.files[0])}
                />
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
      {openReader && ebook && (
        <Dialog open={openReader} onClose={() => setOpenReader(false)} fullWidth maxWidth="md">
          <DialogTitle>Xem Ebook</DialogTitle>

          <DialogContent>
            <EbookReader fileUrl={ebook?.fileUrl} />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenReader(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      )}
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" disabled={!isFormValid} onClick={() => onSave(formData)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
