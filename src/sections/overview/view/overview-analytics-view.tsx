import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsTopBookBestSelling } from '../analytics-top-book-best-selling';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsRevenueOrders } from '../analytics-revenue-orders';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsCategoriesRates } from '../analytics-categories-rates';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../../services/dashboard';
import { Box, Card } from "@mui/material";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Lỗi tải dashboard:', err));
  }, []);

  if (!stats) return <Typography>Đang tải dữ liệu...</Typography>;
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Tổng doanh thu"
            total={stats.totalRevenue}
            percent={stats.revenuePercent}
            icon={<img alt="revenue" src="/assets/icons/glass/ic-glass-dollar.svg" />}
            chart={{
              categories: stats.revenueChart.categories,
              series: stats.revenueChart.series,
            }}
          />
        </Grid>

        {/* 📦 Tổng đơn hàng */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Tổng đơn hàng"
            total={stats.totalOrders}
            percent={stats.orderPercent}
            color="secondary"
            icon={<img alt="orders" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: stats.orderChart.categories,
              series: stats.orderChart.series,
            }}
          />
        </Grid>

        {/* 👥 Tổng người dùng */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Người dùng"
            total={stats.totalUsers}
            percent={stats.userPercent}
            color="warning"
            icon={<img alt="users" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: stats.userChart.categories,
              series: stats.userChart.series,
            }}
          />
        </Grid>

        {/* 📚 Tổng sách đã bán */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Tổng số sách đã bán"
            total={stats.totalBooksSold}
            percent={stats.booksPercent}
            color="error"
            icon={<img alt="books" src="/assets/icons/glass/ic-glass-book.svg" />}
            chart={{
              categories: stats.booksChart.categories,
              series: stats.booksChart.series,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTopBookBestSelling
            title="Top 5 sách bán chạy"
            subheader="Theo số lượng bán"
            chart={{
              colors: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd'],
              series: stats.topSellingBooks.map((book: any) => ({
                label: book.title,
                value: book.soldQuantity,
              })),
            }}
            sx={{ height: '100%' }}
          />
        </Grid>

        {/* 🟦 Doanh thu & Đơn hàng (7 ngày gần nhất) */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsRevenueOrders
            title="Doanh thu & Đơn hàng (7 ngày gần nhất)"
            subheader="Thống kê theo ngày"
            chart={{
              categories: stats.revenueChart.categories,
              series: [
                { name: 'Doanh thu', data: stats.revenueChart.series },
                { name: 'Đơn hàng', data: stats.orderChart.series },
              ],
            }}
            sx={{ height: '100%' }}
          />
        </Grid>

        {/* 🟨 Tỷ lệ đơn hàng theo thể loại */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsCategoriesRates
            title="Tỷ lệ đơn hàng theo thể loại"
            subheader="Số lượng đơn hàng và doanh thu từng thể loại"
            chart={{
              colors: ['#5B8FF9', '#61DDAA'], // Xanh = đơn hàng, xanh lá = doanh thu
              categories: stats.categorySales.map((c: any) => c.categoryName),
              series: [
                {
                  name: 'Số lượng đơn hàng',
                  data: stats.categorySales.map((c: any) => c.totalSold),
                },
                {
                  name: 'Doanh thu (nghìn VNĐ)',
                  data: stats.categorySales.map((c: any) =>
                    Math.round(c.totalRevenue / 1000)
                  ),
                },
              ],
            }}
            sx={{ height: '100%' }}
          />
        </Grid>

        {/* 🟢 So sánh chỉ số hoạt động tuần */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="So sánh hiệu suất tuần"
            chart={{
              categories: stats.performanceCompareChart.categories,
              series: [
                {
                  name: 'Tuần trước',
                  data: stats.performanceCompareChart.series.map((v: number) =>
                    v > 0 ? v * 0.8 : 0 // mô phỏng giảm 20% tuần trước
                  ),
                },
                {
                  name: 'Tuần này',
                  data: stats.performanceCompareChart.series,
                },
              ],
            }}
            sx={{ height: '100%' }}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
