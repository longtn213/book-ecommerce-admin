import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { Box } from "@mui/system";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsTopBookBestSelling({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
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

      {/* Chart chiếm toàn bộ khoảng trống */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Chart
          type="pie"
          series={chart.series.map((s) => s.value)}
          options={{
            ...chart.options,
            labels: chart.series.map((s) => s.label),
          }}
          sx={{ width: '100%', height: '100%', maxHeight: 340 }}
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chart.series.map((s) => s.label)}
        colors={chart.colors}
        sx={{
          p: 2,
          justifyContent: 'center',
          mt: 'auto', // ✅ Đẩy xuống cuối
        }}
      />
    </Card>

  );
}
