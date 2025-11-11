import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';
import { Chart, useChart } from 'src/components/chart';
import { Box } from "@mui/system";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsRevenueOrders({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  // 🎨 Màu mặc định cho 2 loại dữ liệu: doanh thu & đơn hàng
  const chartColors = chart.colors ?? [
    theme.palette.primary.main,   // Doanh thu
    theme.palette.warning.main,   // Đơn hàng
  ];

  const chartOptions = useChart({
    colors: chartColors,
    chart: {
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chart.categories,
      title: {
        text: 'Ngày',
        style: { fontWeight: 600 },
      },
      labels: {
        rotate: -45,
        style: { fontSize: '12px' },
      },
    },
    yaxis: [
      {
        title: { text: 'Doanh thu (VNĐ)' },
        labels: { formatter: (value: number) => fNumber(value) },
      },
      {
        opposite: true,
        title: { text: 'Số đơn hàng' },
        labels: { formatter: (value: number) => fNumber(value) },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: any) =>
          seriesIndex === 0
            ? `${fNumber(value)} ₫`
            : `${fNumber(value)} đơn`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: {
      borderColor: theme.palette.divider,
      row: { colors: [hexAlpha(theme.palette.grey[500], 0.08), 'transparent'] },
    },
    ...chart.options,
  });

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: (theme) => theme.palette.divider,
        transition: 'all 0.25s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(145, 158, 171, 0.2)',
          borderColor: 'rgba(145, 158, 171, 0.3)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardHeader title={title} subheader={subheader} />

      {/* Chart chiếm toàn bộ chiều cao khả dụng */}
      <Box sx={{ flexGrow: 1 }}>
        <Chart
          type="bar"
          series={chart.series}
          options={chartOptions}
          sx={{ width: '100%', maxHeight: 340,height: '100%' }}
        />
      </Box>
    </Card>
  );
}
