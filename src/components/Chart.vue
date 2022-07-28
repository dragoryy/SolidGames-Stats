<template>
  <div class="chartElem">
    <div class="row">
      <highcharts class="chart" :options="chartOptions"></highcharts>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colorInputIsSupported: null,
      animationDuration: 1000,
      chartOptions: {
        accessibility: {
          enabled: false,
        },
        tooltip: {
          outside: true,
          split: true,
        },
        chart: {
          type: "spline",
        },
        dataLabels: {
          enabled: true,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "Результативность за период",
        },
        yAxis: {
          title: {
            text: "Статистика",
          },
        },
        xAxis: {
          categories: this.weeks,
        },
        series: [
          {
            name: "Убийства",
            data: this.kills.reverse(),
            color: "#6fcd98",
          },
          {
            name: "K/D",
            data: this.kdRatio.reverse(),
            color: "#d87093",
          },
          {
            name: "Счёт",
            data: this.score.reverse(),
            color: "#025669",
          },
        ],
      },
    };
  },
  props: ["kills", "kdRatio", "score", "weeks"],
};
</script>

<style scoped>
.chart {
  max-width: 97%;
}
.chartElem {
  margin-top: 20px;
}
</style>
