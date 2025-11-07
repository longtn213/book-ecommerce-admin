import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
                                open,
                                title = 'Xác nhận hành động',
                                message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
                                onClose,
                                onConfirm,
                                confirmText = 'Xác nhận',
                                cancelText = 'Hủy',
                              }: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
