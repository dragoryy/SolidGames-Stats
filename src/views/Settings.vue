<template>
  <div>
    <div class="page-title">
      <h3>Настройки статистики</h3>
    </div>
    <Loader v-if="loading" />
    <div class="row" id="sg" v-else>
      <div class="setting">
        <p>Период по умолчанию:</p>
        <select style="display: block" v-model="choosed" ref="period">
          <option v-for="d of period" :key="d.id" :data-id="d.id">
            {{ d.title }}
          </option>
        </select>
      </div>
      <div class="setting">
        <p>Отряд по умолчанию:</p>
        <select style="display: block" v-model="tag" ref="tag">
          <option v-for="s of squads" :key="s">{{ s }}</option>
        </select>
      </div>
      <div class="input-field setting">
        <p>Ваш никнейм:</p>
        <input
          type="text"
          id="autocomplete-input"
          class="autocomplete"
          autocomplete="off"
          v-model.trim="nick"
          ref="nick"
        />
      </div>
      <div class="setting">
        <p>Цветовая палитра:</p>
        <div class="switch">
          <label>
            <b>Светлая</b>
            <input type="checkbox" ref="theme" :checked="theme" />
            <span class="lever"></span>
            <b>Темная</b>
          </label>
        </div>
      </div>
      <a class="waves-effect waves-light btn" @click.prevent="setLocalInfoStore"
        >Сохранить</a
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data: () => ({
    tag: "[FNX]",
    squads: [],
    nicknames: {},
    loading: true,
    choosed: "За все время",
    period: [],
    tab: null,
    theme: "",
    nick: "",
    c: null,
  }),
  async mounted() {
    if (this.$route.query.msg === "setnick") {
      M.toast({ html: "Выберите свой никнейм!" });
    }
    this.choosed = this.getInfo().period;
    this.tag = this.getInfo().tag;
    this.theme = this.getInfo().theme;
    this.nick = this.getInfo().nick;
    let s = await fetch(`stats.json`);
    s = await s.json();
    for (let key in s.globalStatistics) {
      let pName = s.globalStatistics[key].name;
      this.nicknames[pName] = null;
    }
    for (let key in s.squadStatistics) {
      this.squads.push(s.squadStatistics[key].prefix);
    }
    this.squads.sort();
    this.squads.unshift("[Одиночки]");
    let r = await fetch(`rotations_stats.json`);
    r = await r.json();
    for (let key in r) {
      let tStartDate = r[key].startDate;
      let tEndDate = r[key].endDate;
      r[key].startDate = new Date(r[key].startDate).toLocaleString("ru", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (r[key].endDate === null) {
        r[key].endDate = " по настоящий момент.";
      } else {
        r[key].endDate = new Date(r[key].endDate).toLocaleString("ru", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      this.period.push({
        id: Number(key),
        title: `${r[key].startDate} - ${r[key].endDate}`,
        endDate: tEndDate,
        startDate: tStartDate,
      });
    }
    this.period.push({
      id: r.length,
      title: "За все время",
    });
    this.period.reverse();
    this.loading = false;
    setTimeout(() => {
      var elems = document.querySelectorAll(".autocomplete");
      var instances = M.Autocomplete.init(elems, {
        data: this.nicknames,
      });
    }, 200);
  },
  methods: {
    ...mapGetters(["getInfo"]),
    setLocalInfoStore() {
      const newInfo = {};
      newInfo.theme = this.$refs.theme.checked;
      newInfo.tag = this.$refs.tag.value;
      newInfo.period = this.$refs.period.value;
      newInfo.nick = this.$refs.nick.value;
      this.theme = this.$refs.theme.checked;
      this.$store.dispatch("updateLocalInfo", newInfo);
      this.$emit("reloadSidebar");
      M.toast({ html: "Настройки сохранены!" });
    },
  },
};
</script>
