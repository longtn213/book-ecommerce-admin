import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

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

export function AnalyticsCategoriesRates({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.success.main];

  const chartOptions = useChart({
    chart: {
      stacked: false, // ❗ không chồng, hiển thị riêng
      toolbar: { show: false },
    },
    colors: chartColors,
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '45%',
        dataLabels: { position: 'right' },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.primary],
      },
      formatter: (val: number, opts: any) => fNumber(val),
    },
    stroke: { show: true, width: 1, colors: ['#fff'] },
    xaxis: {
      categories: chart.categories,
      title: { text: 'Giá trị (Đơn / Nghìn VNĐ)' },
      labels: {
        formatter: (value: string): string => {
          const num = Number(value);
          return fNumber(isNaN(num) ? 0 : num);
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: any) =>
          seriesIndex === 0 ? `${fNumber(value)} đơn` : `${fNumber(value * 1000)} ₫`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: { borderColor: theme.palette.divider },
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
      {...other}
    >
      <CardHeader title={title} subheader={subheader} />
      <Chart type="bar" series={chart.series} options={chartOptions} sx={{ p: 2, height: 400 }} />
    </Card>
  );
}
