<template>
  <div class="performanceChart position-relative">
    <div
      v-if="portfolioStore.isHistoricalDataLoading"
      class="preloader d-flex align-center justify-center position-absolute"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>
    <div
      ref="chartDivRef"
      class="chartDiv"
    />
  </div>
</template>

<script setup lang="ts">
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { usePortfolioStore } from '@/stores/PortfolioStore';

const chartDivRef = ref<HTMLElement | null>(null);
const portfolioStore = usePortfolioStore();

let root: am5.Root | null = null;
let series: am5xy.LineSeries | null = null;
let xAxis: am5xy.DateAxis<am5xy.AxisRenderer> | null = null;

const chartData = computed(() => {
  if (portfolioStore.isHistoricalDataLoading || !portfolioStore.portfolio.length) {
    return [];
  }

  // Use a map to aggregate by day (start of day timestamp)
  const evaluationMap = new Map<number, number>();

  portfolioStore.portfolio.forEach((holding) => {
    if (holding.historicalData?.prices) {
      // For each holding, we only want one value per day.
      // CoinGecko might return multiple points for the same day (e.g. daily interval + current price).
      const holdingDayMap = new Map<number, number>();

      holding.historicalData.prices.forEach(([timestamp, price]) => {
        const date = new Date(timestamp);
        date.setUTCHours(0, 0, 0, 0);
        const dayTimestamp = date.getTime();

        // Overwrite so we take the latest available price for that day for this holding
        holdingDayMap.set(dayTimestamp, price * holding.quantity);
      });

      // Now aggregate the unique daily points for this holding into the main map
      holdingDayMap.forEach((value, dayTimestamp) => {
        const currentTotal = evaluationMap.get(dayTimestamp) || 0;
        evaluationMap.set(dayTimestamp, currentTotal + value);
      });
    }
  });

  return Array.from(evaluationMap.entries())
    .map(([timestamp, value]) => ({
      date: timestamp,
      value,
    }))
    .sort((a, b) => a.date - b.date);
});

onMounted(() => {
  if (!chartDivRef.value) return;

  root = am5.Root.new(chartDivRef.value);
  root.setThemes([am5themes_Animated.new(root)]);

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: 'panX',
      wheelY: 'zoomX',
      pinchZoomX: true,
    }),
  );

  const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
    behavior: 'zoomX',
  }));
  cursor.lineY.set('visible', false);

  xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: 'day',
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50,
        minorGridEnabled: true,
      }),
      tooltip: am5.Tooltip.new(root, {}),
      startLocation: 0.4,
      endLocation: 0.6,
    }),
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: 'zoom',
      }),
    }),
  );

  series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Portfolio Value',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'value',
      valueXField: 'date',
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueY.formatNumber("#.##")}',
      }),
    }),
  );

  series.fills.template.setAll({
    visible: true,
    fillOpacity: 0.2,
  });

  series.bullets.push(() => {
    return am5.Bullet.new(root!, {
      sprite: am5.Circle.new(root!, {
        radius: 4,
        fill: series!.get('fill'),
      }),
    });
  });

  series.data.setAll(chartData.value);
  series.appear(1000);
  chart.appear(1000, 100);
});

watch(chartData, (newData) => {
  if (series) {
    series.data.setAll(newData);
  }
}, { deep: true });

onBeforeUnmount(() => {
  if (root) {
    root.dispose();
  }
});
</script>

<style lang="scss" scoped>
.performanceChart {
  width: 100%;
  height: 30em;

  .preloader {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(var(--v-theme-surface), 0.7);
  }

  .chartDiv {
    width: 100%;
    height: 100%;
  }
}
</style>
