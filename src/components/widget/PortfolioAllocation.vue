<template>
  <div class="portfolioAllocation">
    <v-btn
      v-if="isDrilledDown"
      class="backButton position-absolute"
      prepend-icon="mdi-arrow-left-thick"
      color="primary"
      @click="drillUp"
    >
      {{ $t('pieChart.back') }}
    </v-btn>
    <div
      ref="chartDivRef"
      class="chartDivRef"
    />
  </div>
</template>

<script setup lang="ts">
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import colors from '@imports/_colors.module.scss';
import { usePortfolioStore } from '@/stores/PortfolioStore';
import { useCoinStore } from '@/stores/CoinStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const chartDivRef = ref<HTMLElement | null>(null);
const portfolioStore = usePortfolioStore();
const coinStore = useCoinStore();

let root: am5.Root | null = null;
let series: am5percent.PieSeries | null = null;
let legend: am5.Legend | null = null;

const isDrilledDown = ref(false);

const fullData = computed(() => {
  return portfolioStore.portfolio.map((holding) => {
    const currentPrice = coinStore.getCoinCurrentPriceById(holding.coin.id) || 0;
    return {
      category: holding.coin.name,
      value: holding.quantity * currentPrice,
    };
  }).filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
});

const processedData = computed(() => {
  const data = fullData.value;
  if (data.length === 0) return { main: [], others: [] };

  const totalValue = data.reduce((memo, item) => memo + item.value, 0);
  const threshold = totalValue * 0.1;

  const main = [];
  const others = [];
  let othersValue = 0;

  // We want to group the LEAST ~10% as others.
  // Since data is sorted descending, we can work from the end.
  let currentOthersValue = 0;
  let othersIndex = data.length;

  for (let i = data.length - 1; i >= 0; i--) {
    const dataValue = data[i]?.value || 0;
    if (dataValue) {
      if (currentOthersValue + dataValue <= threshold) {
        currentOthersValue += dataValue;
        othersIndex = i;
      } else {
        break;
      }
    }
  }

  // Ensure we don't group everything into "Others" if there are only one or two items
  if (othersIndex === 0 && data.length > 1) {
    othersIndex = 1;
  }

  for (let i = 0; i < data.length; i++) {
    if (i < othersIndex) {
      main.push(data[i]);
    } else {
      others.push(data[i]);
      othersValue += data[i]?.value || 0;
    }
  }

  if (others.length > 0) {
    main.push({
      category: t('pieChart.others'),
      value: othersValue,
      isOthers: true,
    });
  }

  return { main, others };
});

const drillDown = () => {
  if (series && processedData.value.others.length > 0) {
    isDrilledDown.value = true;
    series.data.setAll(processedData.value.others);
    if (legend) {
      legend.data.setAll(series.dataItems);
    }
  }
};

const drillUp = () => {
  if (series) {
    isDrilledDown.value = false;
    series.data.setAll(processedData.value.main);
    if (legend) {
      legend.data.setAll(series.dataItems);
    }
  }
};

onMounted(() => {
  if (!chartDivRef.value) return;

  root = am5.Root.new(chartDivRef.value);

  root.setThemes([
    am5themes_Animated.new(root),
  ]);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    }),
  );

  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'category',
    }),
  );

  series.get('colors')?.set('colors', [
    am5.color(colors.blue || '#024563'),
    am5.color(colors.green || '#2BD92B'),
    am5.color(colors.yellow || '#FFEE33'),
    am5.color(colors.red || '#CB2424'),
    am5.color(colors.teal || '#259CA5'),
    am5.color(colors.gray || '#8C9193'),
  ]);

  series.slices.template.set('toggleKey', 'none');

  series.slices.template.events.on('click', (ev) => {
    const { isOthers } = ev.target.dataItem?.dataContext as { isOthers?: boolean; };
    if (isOthers) {
      drillDown();
    }
  });

  series.data.setAll(processedData.value.main);

  series.appear(1000, 100);

  legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.percent(50),
    x: am5.percent(50),
    marginTop: 15,
    marginBottom: 15,
  }));

  legend.data.setAll(series.dataItems);

  watch(processedData, (newData) => {
    // setting data while drilled down messes with the status hence the trade-off
    if (!isDrilledDown.value) {
      series?.data.setAll(newData.main);
      legend?.data.setAll(series?.dataItems || []);
    }
  }, { deep: true });
});

onBeforeUnmount(() => {
  if (root) {
    root.dispose();
  }
});
</script>

<style lang="scss">
.portfolioAllocation {
  position: relative;
  .backButton {
    z-index: 11;
    top: 1em;
    left: 1em;
  }
  .chartDivRef {
    width: 100%;
    height: 30em;
    z-index: 10;
    position: relative;
  }
}
</style>
