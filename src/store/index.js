import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    info: {},
    stats: {},
    rotationsStats: [],
    maceStats: {},
  },
  mutations: {
    setLocalInfo(state, newInfo) {
      state.info = newInfo;
    },
    setStatsInfo(state, newStats) {
      state.stats = newStats.statsFetched;
      state.rotationsStats = newStats.rotationsStatsFetched;
      state.maceStats = newStats.maceStatsFetched;
    },
  },
  actions: {
    async getStatsInfo({ commit, dispatch }) {
      const stats = await fetch("/stats.json");
      const statsFetched = await stats.json();
      const rotationsStats = await fetch("/rotations_stats.json");
      const rotationsStatsFetched = await rotationsStats.json();
      const maceStats = await fetch("/stats_mace.json");
      const maceStatsFetched = await maceStats.json();
      const newStats = {
        statsFetched,
        rotationsStatsFetched,
        maceStatsFetched,
      };
      commit("setStatsInfo", newStats);
    },
    getLocalInfo({ commit, dispatch }) {
      const newInfo = {};
      newInfo.tag = localStorage.getItem("tag");
      newInfo.period = localStorage.getItem("period");
      newInfo.theme = localStorage.getItem("theme") === "true";
      newInfo.nick = localStorage.getItem("nick");
      if (newInfo.period.includes("28 февр")) {
        newInfo.period = "28 февр. 2022 г. - 3 июл. 2022 г.";
      }
      commit("setLocalInfo", newInfo);
    },
    updateLocalInfo({ commit, dispatch }, newInfo) {
      localStorage.setItem("tag", newInfo.tag);
      localStorage.setItem("period", newInfo.period);
      localStorage.setItem("theme", newInfo.theme);
      localStorage.setItem("nick", newInfo.nick);
      newInfo.theme = newInfo.theme === true;
      commit("setLocalInfo", newInfo);
    },
  },
  getters: {
    getInfo(store) {
      return store.info;
    },
    getRotationsStats(store) {
      return store.rotationsStats;
    },
    getStats(store) {
      return store.stats;
    },
    getMaceStats(store) {
      return store.maceStats;
    },
  },
  modules: {},
});
