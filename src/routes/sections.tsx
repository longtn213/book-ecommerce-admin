import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import PrivateRoute from 'src/routes/PrivateRoute';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ResetPasswordPage from '../sections/auth/reset-password';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const CouponPage = lazy(() => import('src/pages/coupon'));
export const CategoryPage = lazy(() => import('src/pages/category'));
export const PublisherPage = lazy(() => import('src/pages/publisher'));
export const AuthorPage = lazy(() => import('src/pages/author'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const BookPage = lazy(() => import('src/pages/book'));


const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <PrivateRoute />   // ✅ thêm dòng này
    ),
    children: [
      {
        element: (
          <DashboardLayout>
            <Suspense fallback={renderFallback()}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'user', element: <UserPage /> },
          { path: 'coupon', element: <CouponPage /> },
          { path: 'category', element: <CategoryPage /> },
          { path: 'publisher', element: <PublisherPage /> },
          { path: 'author', element: <AuthorPage /> },
          { path: 'order', element: <OrderPage /> },
          { path: 'book', element: <BookPage /> },
        ],
      },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },
  { path: '*', element: <Page404 /> },
];
