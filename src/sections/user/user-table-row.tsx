import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import dayjs from 'dayjs';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Tooltip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export type UserProps = {
  id: number;
  username: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
  gender: string | null;
  role: string;
  userStatus: string;
  dateOfBirth?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onEditRow?: (row: UserProps) => void;
};

// ----------------------------------------------------------------------

export function UserTableRow({
                               row,
                               selected,
                               onEditRow,
                             }: UserTableRowProps) {

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        {/* Username + Avatar */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              alt={row.username}
              src={row.avatarUrl || undefined}
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            >
              {(row.username)?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {row.username}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {row.fullName}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {/* Email */}
        <TableCell>{row.email || '-'}</TableCell>

        {/* Phone */}
        <TableCell>{row.phone || '-'}</TableCell>

        {/* Gender */}
        <TableCell sx={{ textTransform: 'capitalize' }}>{row.gender || '-'}</TableCell>

        {/* Role */}
        <TableCell sx={{ textTransform: 'capitalize' }}>{row.role}</TableCell>

        {/* Date of Birth */}
        <TableCell>
          {row.dateOfBirth ? dayjs(row.dateOfBirth).format('DD/MM/YYYY') : '-'}
        </TableCell>

        {/* Status */}
        <TableCell>
          <Label
            color={
              row.userStatus === 'ACTIVE'
                ? 'success'
                : row.userStatus === 'INACTIVE'
                  ? 'warning'
                  : 'error'
            }
          >
            {row.userStatus}
          </Label>
        </TableCell>

        <TableCell align="right">
          <Tooltip title="Edit user">
            <IconButton color="primary" onClick={() => onEditRow?.(row)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
}
