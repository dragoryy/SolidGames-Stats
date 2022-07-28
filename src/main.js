import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Loader from "@/components/App/Loader";
import "materialize-css/dist/js/materialize.min";
import SmartTable from "vuejs-smart-table";
import tooltipDirective from "@/directives/tooltip.directive";
import HighchartsVue from "highcharts-vue";
import _ from "lodash";
Vue.use(SmartTable);
Vue.use(_);
Vue.use(HighchartsVue);
Vue.directive("tooltip", tooltipDirective);
Vue.config.productionTip = false;
Vue.component("Loader", Loader);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
