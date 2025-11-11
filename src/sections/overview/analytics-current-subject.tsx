import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentSubject({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  // ✅ Tính riêng max cho từng trục (theo từng category)
  const categoryMax: number[] = chart.categories.map((_, idx) =>
    Math.max(...chart.series.map((s) => s.data[idx]))
  );

  // ✅ Chuẩn hoá từng giá trị theo max của trục tương ứng
  const normalizedSeries = chart.series.map((s) => ({
    ...s,
    data: s.data.map((v, i) => (categoryMax[i] ? (v / categoryMax[i]) * 100 : 0)),
  }));

  const chartOptions = useChart({
    chart: { toolbar: { show: false } },
    colors: chartColors,
    stroke: { width: 2 },
    fill: { opacity: 0.35 },
    markers: { size: 4 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chart.categories,
      labels: {
        style: {
          colors: Array.from(
            { length: chart.categories.length },
            () => theme.palette.text.secondary
          ),
        },
      },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => `${Math.round(val)}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex, dataPointIndex }: any) => {
          const rawValue = chart.series[seriesIndex].data[dataPointIndex];
          const category = chart.categories[dataPointIndex];

          if (category === 'Doanh thu') return `${fNumber(rawValue)} ₫`;
          if (category === 'Đơn hàng') return `${fNumber(rawValue)} đơn`;
          if (category === 'Người dùng') return `${fNumber(rawValue)} người`;
          if (category === 'Sách bán') return `${fNumber(rawValue)} quyển`;

          return fNumber(rawValue);
        },
      },
    },
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

      <Chart
        type="radar"
        series={normalizedSeries}
        options={chartOptions}
        sx={{
          my: 1,
          mx: 'auto',
          width: 340,
          height: 340,
        }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chart.series.map((item) => item.name)}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
