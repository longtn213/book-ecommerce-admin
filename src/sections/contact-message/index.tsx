"use client";

import React, { useEffect, useState } from "react";
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
  Typography,
  Chip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ReplyIcon from "@mui/icons-material/Reply";

import dayjs from "dayjs";
import { getMessages, updateContactMessageStatus } from '../../services/contactMessage';

// ======================================================================

export default function ContactMessagePage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination FE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [confirmStatus, setConfirmStatus] = useState<{
    open: boolean;
    id: number | null;
    status: string;
  }>({
    open: false,
    id: null,
    status: "",
  });
  const InfoRow = ({ label, value }: any) => (
    <Stack direction="row" spacing={1.5}>
      <Typography sx={{ width: 120, fontWeight: 600 }}>{label}:</Typography>
      <Typography sx={{ color: "#333" }}>{value}</Typography>
    </Stack>
  );

  // ========================= LOAD DATA ==========================
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages();
      setMessages(res.data?.content || []);
    } catch (err) {
      console.error("Lỗi load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================= PAGINATION ==========================
  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedMessages = messages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ========================= STATUS COLOR ==========================
  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Chip label="Chưa đọc" color="warning" />;
      case "READ":
        return <Chip label="Đã xem" color="info" />;
      case "REPLIED":
        return <Chip label="Đã phản hồi" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };

  // ========================= ACTION ==========================
  const openDetailDialog = (msg: any) => {
    setSelectedMessage(msg);
    setOpenDetail(true);
  };

  const askUpdateStatus = (id: number, status: string) => {
    setConfirmStatus({ open: true, id, status });
  };

  const confirmUpdateStatus = async () => {
    if (!confirmStatus.id) return;

    try {
      await updateContactMessageStatus(confirmStatus.id, confirmStatus.status);
      await fetchMessages();
    } catch (e) {
      console.error("Lỗi update status:", e);
    }

    setConfirmStatus({ open: false, id: null, status: "" });
  };

  // ========================= UI ==========================
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Quản lý tin nhắn liên hệ
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SĐT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày gửi</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedMessages.length > 0 ? (
                  paginatedMessages.map((m) => (
                    <TableRow key={m.id} hover>
                      <TableCell>{m.firstName + " " + m.lastName}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>{m.phone}</TableCell>
                      <TableCell>{m.subject}</TableCell>
                      <TableCell>
                        {dayjs(m.createdAt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>{renderStatus(m.status)}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => openDetailDialog(m)}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {m.status === "PENDING" && (
                          <IconButton
                            color="warning"
                            onClick={() => askUpdateStatus(m.id, "READ")}
                          >
                            <MarkEmailReadIcon />
                          </IconButton>
                        )}

                        {m.status !== "REPLIED" && (
                          <IconButton
                            color="success"
                            onClick={() => askUpdateStatus(m.id, "REPLIED")}
                          >
                            <ReplyIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {loading ? "Đang tải..." : "Không có tin nhắn nào"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={messages.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Số dòng mỗi trang"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* ==================== Dialog xem chi tiết ==================== */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            Chi tiết tin nhắn
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "#fafafa" }}>
          {selectedMessage && (
            <Stack spacing={3}>
              {/* ==== BLOCK 1: THÔNG TIN NGƯỜI GỬI ==== */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Thông tin người gửi
                </Typography>

                <Stack spacing={1.5}>
                  <InfoRow label="Họ tên" value={`${selectedMessage.firstName} ${selectedMessage.lastName}`} />
                  <InfoRow label="Email" value={selectedMessage.email} />
                  <InfoRow label="Điện thoại" value={selectedMessage.phone || "-"} />
                  <InfoRow label="Tiêu đề" value={selectedMessage.subject || "-"} />
                </Stack>
              </Box>

              {/* ==== BLOCK 2: NỘI DUNG ==== */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Nội dung tin nhắn
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f1f3f5",
                    borderRadius: 2,
                    minHeight: "80px",
                    whiteSpace: "pre-wrap",
                    fontSize: "15px",
                  }}
                >
                  {selectedMessage.message}
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetail(false)} sx={{ textTransform: "none" }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== Dialog xác nhận đổi trạng thái ==================== */}
      <Dialog
        open={confirmStatus.open}
        onClose={() => setConfirmStatus({ open: false, id: null, status: "" })}
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn đổi trạng thái sang{" "}
          <strong>{confirmStatus.status}</strong>?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmStatus({ open: false, id: null, status: "" })
            }
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={confirmUpdateStatus}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
