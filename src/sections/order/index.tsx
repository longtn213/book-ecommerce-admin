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
  MenuItem,
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
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getOrders, getOrderDetail } from '../../services/order';

const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem('token') ?? '';

  // Fetch danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const params = {
        page,
        size,
        keyword: keyword || undefined,
        status: status || undefined,
      };
      const res = await getOrders(token, params);
      setOrders(res.data?.content || []);
      setTotal(res.data?.totalElements || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, size]);

  const handleSearch = () => {
    setPage(0);
    fetchOrders();
  };

  // Gọi API chi tiết đơn hàng
  const handleViewDetail = async (orderId: number) => {
    try {
      const res = await getOrderDetail(token, orderId);
      setSelectedOrder(res.data);
      setOpenModal(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách đơn hàng
      </Typography>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField
          label="Tìm kiếm (orderCode, username...)"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ width:500 }}
        />
        <TextField
          label="Trạng thái"
          size="small"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ height: 40 }}
        >
          Tìm kiếm
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Địa chỉ giao</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.username}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.totalAmount.toLocaleString('vi-VN')} ₫</TableCell>
                    <TableCell>{order.shippingAddress}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleViewDetail(order.id)}>
                        <VisibilityIcon />
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
            onRowsPerPageChange={(e) => {
              setSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Modal chi tiết đơn hàng */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent dividers>
          {selectedOrder ? (
            <>
              <Typography>
                <strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}
              </Typography>
              <Typography>
                <strong>Khách hàng:</strong> {selectedOrder.username}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong> {selectedOrder.status}
              </Typography>
              <Typography>
                <strong>Tổng tiền:</strong>{' '}
                {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
              </Typography>
              <Typography>
                <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
              </Typography>

              <Typography sx={{ mt: 2, mb: 1 }} variant="h6">
                Danh sách sản phẩm:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sách</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.bookTitle}</TableCell>
                      <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.total.toLocaleString('vi-VN')} ₫</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Typography>Đang tải dữ liệu...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
