<template>
  <div>
    <div class="page-title">
      <h3>Личная статистика игрока - {{ $route.params.nick }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <div class="row">
      <ul class="tabs tabs-fixed-width tab-demo" ref="tab">
        <li class="tab col s3" @click="refresh" :class="{ disabled: loading }">
          <a href="#sg" class="active"><strong>SG</strong></a>
        </li>
        <li class="tab col s3" @click="refresh" :class="{ disabled: loading }">
          <a href="#mace"><strong>MACE</strong></a>
        </li>
      </ul>
    </div>
    <div class="row" id="sg">
      <p>Выберите период:</p>
      <select style="display: block" v-model="choosed" ref="sl">
        <option v-for="d of period" :key="d.id">{{ d.title }}</option>
      </select>
      <Loader v-if="loading" />
      <p v-else-if="n.length < 1" class="center">
        Игр не найдено или недостаточно.
      </p>
      <div v-else>
        <Chart
          :kills="kills"
          :kdRatio="kdRatio"
          :score="score"
          :weeks="weeks"
          v-if="!loading"
        />
        <p>Общая статистика:</p>
        <v-table :data="n" class="responsive-table highlight">
          <thead slot="head">
            <v-th sortKey="name"><span>Ник</span></v-th>
            <v-th sortKey="totalPlayedGames"><span>Кол-во игр</span></v-th>
            <v-th sortKey="kills"><span>Убийств</span></v-th>
            <v-th sortKey="vehicleKills"><span>Выбито техники</span></v-th>
            <v-th sortKey="teamkills"><span>Тимкиллов</span></v-th>
            <v-th sortKey="deaths.byTeamkills"><span>Смертей от ТК</span></v-th>
            <v-th sortKey="deaths.total"><span>Смертей</span></v-th>
            <v-th sortKey="kdRatio"
              ><span
                class="tip"
                v-tooltip="'(Убийства - Тимкиллы) / (Смерти - Смерти от ТК)'"
                >K/D</span
              ></v-th
            >
            <v-th sortKey="totalScore" defaultSort="desc"
              ><span
                class="tip"
                v-tooltip="
                  '(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'
                "
                >Счет</span
              ></v-th
            >
          </thead>
          <tbody slot="body" slot-scope="{ displayData }">
            <tr v-for="row in displayData" :key="row.id">
              <td>
                <router-link
                  :to="{
                    name: 'Player',
                    params: { nick: row.name },
                  }"
                  >{{ row.lastSquadPrefix + row.name }}</router-link
                >
              </td>
              <td>{{ row.totalPlayedGames }}</td>
              <td>{{ row.kills }}</td>
              <td>{{ row.vehicleKills }}</td>
              <td>{{ row.teamkills }}</td>
              <td>{{ row.deaths.byTeamkills }}</td>
              <td>{{ row.deaths.total }}</td>
              <td>{{ row.kdRatio }}</td>
              <td>{{ row.totalScore }}</td>
            </tr>
          </tbody>
        </v-table>
        <ul class="collapsible z-depth-0" ref="collapse">
          <li>
            <div class="collapsible-header">
              <p>Статистика по неделям</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <div v-if="this.byWeeks.length < 1">
                Игр не найдено или недостаточно.
              </div>
              <v-table
                :data="byWeeks"
                v-else
                class="responsive-table highlight"
              >
                <thead slot="head">
                  <th>Даты</th>
                  <v-th sortKey="totalPlayedGames"
                    ><span>Кол-во игр</span></v-th
                  >
                  <v-th sortKey="kills"><span>Убийств</span></v-th>
                  <v-th sortKey="vehicleKills"
                    ><span>Выбито техники</span></v-th
                  >
                  <v-th sortKey="teamkills"><span>Тимкиллов</span></v-th>
                  <v-th sortKey="deaths.byTeamkills"
                    ><span>Смертей от ТК</span></v-th
                  >
                  <v-th sortKey="deaths.total"><span>Смертей</span></v-th>
                  <v-th sortKey="kdRatio"
                    ><span
                      class="tip"
                      v-tooltip="
                        '(Убийства - Тимкиллы) / (Смерти - Смерти от ТК)'
                      "
                      >K/D</span
                    ></v-th
                  >
                  <v-th sortKey="score"
                    ><span
                      class="tip"
                      v-tooltip="
                        '(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'
                      "
                      >Счет</span
                    ></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="row in displayData" :key="row.id">
                    <td>{{ row.startDate }} - {{ row.endDate }}</td>
                    <td>{{ row.totalPlayedGames }}</td>
                    <td>{{ row.kills }}</td>
                    <td>{{ row.vehicleKills }}</td>
                    <td>{{ row.teamkills }}</td>
                    <td>{{ row.deaths.byTeamkills }}</td>
                    <td>{{ row.deaths.total }}</td>
                    <td>{{ row.kdRatio }}</td>
                    <td>{{ row.score }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="weapons.length">
            <div class="collapsible-header">
              <p class="center">Статистика по оружию</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="weapons" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Название оружия</span></v-th>
                  <v-th sortKey="kills" defaultSort="desc"
                    ><span>Убийств</span></v-th
                  >
                  <v-th sortKey="maxDistance"
                    ><span>Макс. дистанция</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.kills }}</td>
                    <td>{{ row.maxDistance }}м.</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="row" id="mace">
      <Loader v-if="loading" />
      <p v-else-if="mace.length < 1" class="center">
        Игр не найдено или недостаточно.
      </p>
      <div v-else>
        <Chart
          v-if="!loading"
          :kills="kills"
          :kdRatio="kdRatio"
          :score="score"
          :weeks="weeks"
        />
        <p>Общая статистика:</p>
        <v-table :data="mace" class="responsive-table highlight">
          <thead slot="head">
            <v-th sortKey="name"><span>Ник</span></v-th>
            <v-th sortKey="totalPlayedGames"><span>Кол-во игр</span></v-th>
            <v-th sortKey="kills"><span>Убийств</span></v-th>
            <v-th sortKey="vehicleKills"><span>Выбито техники</span></v-th>
            <v-th sortKey="teamkills"><span>Тимкиллов</span></v-th>
            <v-th sortKey="deaths.byTeamkills"><span>Смертей от ТК</span></v-th>
            <v-th sortKey="deaths.total"><span>Смертей</span></v-th>
            <v-th sortKey="kdRatio"
              ><span
                class="tip"
                v-tooltip="'(Убийства - Тимкиллы) / (Смерти - Смерти от ТК)'"
                >K/D</span
              ></v-th
            >
            <v-th sortKey="totalScore" defaultSort="desc"
              ><span
                class="tip"
                v-tooltip="
                  '(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'
                "
                >Счет</span
              ></v-th
            >
          </thead>
          <tbody slot="body" slot-scope="{ displayData }">
            <tr v-for="row in displayData" :key="row.id">
              <td>
                <router-link
                  :to="{ name: 'Player', params: { nick: row.name } }"
                  >{{ row.lastSquadPrefix + row.name }}</router-link
                >
              </td>
              <td>{{ row.totalPlayedGames }}</td>
              <td>{{ row.kills }}</td>
              <td>{{ row.vehicleKills }}</td>
              <td>{{ row.teamkills }}</td>
              <td>{{ row.deaths.byTeamkills }}</td>
              <td>{{ row.deaths.total }}</td>
              <td>{{ row.kdRatio }}</td>
              <td>{{ row.totalScore }}</td>
            </tr>
          </tbody>
        </v-table>
        <ul class="collapsible z-depth-0" ref="collapse2">
          <li>
            <div class="collapsible-header">
              <p>Статистика по неделям</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <div v-if="this.byWeeks.length < 1" class="center">
                Игр не найдено.
              </div>
              <v-table
                :data="byWeeks"
                v-else
                class="responsive-table highlight"
              >
                <thead slot="head">
                  <th>Даты</th>
                  <v-th sortKey="totalPlayedGames"
                    ><span>Кол-во игр</span></v-th
                  >
                  <v-th sortKey="kills"><span>Убийств</span></v-th>
                  <v-th sortKey="vehicleKills"
                    ><span>Выбито техники</span></v-th
                  >
                  <v-th sortKey="teamkills"><span>Тимкиллов</span></v-th>
                  <v-th sortKey="deaths.byTeamkills"
                    ><span>Смертей от ТК</span></v-th
                  >
                  <v-th sortKey="deaths.total"><span>Смертей</span></v-th>
                  <v-th sortKey="kdRatio"
                    ><span
                      class="tip"
                      v-tooltip="
                        '(Убийства - Тимкиллы) / (Смерти - Смерти от ТК)'
                      "
                      >K/D</span
                    ></v-th
                  >
                  <v-th sortKey="score"
                    ><span
                      class="tip"
                      v-tooltip="
                        '(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'
                      "
                      >Счет</span
                    ></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="row in displayData" :key="row.id">
                    <td>{{ row.startDate }} - {{ row.endDate }}</td>
                    <td>{{ row.totalPlayedGames }}</td>
                    <td>{{ row.kills }}</td>
                    <td>{{ row.vehicleKills }}</td>
                    <td>{{ row.teamkills }}</td>
                    <td>{{ row.deaths.byTeamkills }}</td>
                    <td>{{ row.deaths.total }}</td>
                    <td>{{ row.kdRatio }}</td>
                    <td>{{ row.score }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "../components/Chart.vue";
import { mapGetters } from "vuex";
export default {
  name: "Player",
  data: () => ({
    n: [],
    byWeeks: [],
    loading: true,
    choosed: "За все время",
    period: [],
    mace: [],
    weapons: [],
    tab: null,
    collapse: null,
    dataLoaded: false,
    kills: [],
    kdRatio: [],
    score: [],
    weeks: [],
  }),
  components: {
    Chart,
  },
  async mounted() {
    this.tab = M.Tabs.init(this.$refs.tab, {
      duration: 50,
    });
    let r = await fetch("../rotations_stats.json");
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
    this.choosed = this.getInfo().period || "За все время";
    await this.refresh();
    this.dataLoaded = true;
  },
  watch: {
    choosed: function () {
      if (this.dataLoaded) {
        this.refresh();
      }
    },
  },
  methods: {
    ...mapGetters(["getInfo"]),
    async refresh() {
      this.n = [];
      this.byWeeks = [];
      this.weapons = [];
      this.kills = [];
      this.score = [];
      this.kdRatio = [];
      this.weeks = [];
      this.mace = [];
      setTimeout(() => {
        this.tab.updateTabIndicator();
        if (this.tab.$activeTabLink[0].href.includes("#sg")) {
          if (this.choosed === this.period[0].title) {
            this.r();
          } else {
            this.rotationTable();
          }
        } else {
          this.reloadMace();
        }
      });
    },
    async r() {
      this.loading = true;
      let r = await fetch(`../stats.json`);
      r = await r.json();
      for (let key in r.globalStatistics) {
        if (r.globalStatistics[key].name === this.$route.params.nick) {
          if (r.globalStatistics[key].lastSquadPrefix === null) {
            r.globalStatistics[key].lastSquadPrefix = "";
          }
          this.n.push(r.globalStatistics[key]);
          this.weapons = r.globalStatistics[key].weapons.map((w, i) => {
            return { ...w, id: i };
          });
          this.byWeeks = r.globalStatistics[key].byWeeks;
        }
      }
      this.getDate();
      this.loading = false;
      setTimeout(() => {
        this.collapse = M.Collapsible.init(this.$refs.collapse, {});
      });
    },
    async rotationTable() {
      this.loading = true;
      let r = await fetch(`../rotations_stats.json`);
      r = await r.json();
      let rotationID = this.$refs.sl.selectedIndex;
      for (let key in r) {
        if (r[key].startDate === this.period[rotationID].startDate) {
          for (let key1 in r[key].stats.global) {
            if (r[key].stats.global[key1].name === this.$route.params.nick) {
              this.n.push(r[key].stats.global[key1]);
              this.byWeeks = r[key].stats.global[key1].byWeeks;
              this.weapons = r[key].stats.global[key1].weapons.map((w, i) => {
                return { ...w, id: i };
              });
            }
          }
        }
      }
      this.getDate();
      this.loading = false;
      setTimeout(() => {
        this.collapse = M.Collapsible.init(this.$refs.collapse, {});
      });
    },
    async reloadMace() {
      this.loading = true;
      let r = await fetch(`../stats_mace.json`);
      r = await r.json();
      this.n.push(r.globalStatistics[0]);
      for (let key in r.globalStatistics) {
        if (r.globalStatistics[key].name === this.$route.params.nick) {
          if (r.globalStatistics[key].lastSquadPrefix === null) {
            r.globalStatistics[key].lastSquadPrefix = "";
          }
          this.mace.push(r.globalStatistics[key]);
          this.byWeeks = r.globalStatistics[key].byWeeks;
        }
      }
      this.getDate("mace");
      setTimeout(() => {
        this.collapse = M.Collapsible.init(this.$refs.collapse2, {});
      });
      this.loading = false;
    },
    getDate(gameType = "sg") {
      for (let key in this.byWeeks) {
        this.kills.push(this.byWeeks[key].kills);
        this.kdRatio.push(this.byWeeks[key].kdRatio);
        this.score.push(this.byWeeks[key].score);
        this.byWeeks[key].startDate = new Date(
          this.byWeeks[key].startDate
        ).toLocaleString("ru", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
        this.byWeeks[key].endDate = new Date(
          this.byWeeks[key].endDate
        ).toLocaleString("ru", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
        this.weeks.push(
          this.byWeeks[key].startDate + "-" + this.byWeeks[key].endDate
        );
      }
      if (gameType === "mace") {
        this.weeks.reverse();
        this.kills.reverse();
        this.kdRatio.reverse();
        this.score.reverse();
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.refresh();
    next();
  },
};
</script>

<style scoped>
.collapsible-body {
  padding: 1rem;
  padding-top: 0rem;
  padding-left: 0;
}
.collapsible-header {
  padding-left: 0;
  align-items: center;
}
.collapsible-header i {
  margin-left: 0;
}
.collapsible {
  box-shadow: none !important;
  border: 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.collapsible li {
  transition: 0.15s ease;
}
.collapsible li.active .arrow {
  transform: rotate(45deg) translate(-5px, -5px);
}
.collapsible li.active .arrow:before {
  transform: translate(10px, 0);
}
.collapsible li.active .arrow:after {
  transform: rotate(90deg) translate(10px, 0);
}
.arrow {
  filter: invert(1);
  width: 13px;
  height: 13px;
  display: inline-block;
  position: relative;
  bottom: -6px;
  left: -10px;
  transition: 0.4s ease;
  margin-top: 2px;
  text-align: left;
  transform: rotate(45deg);
  margin-left: 1rem;
}
.arrow:before,
.arrow:after {
  position: absolute;
  content: "";
  display: inline-block;
  width: 10px;
  height: 1px;
  background-color: #fff;
  transition: 0.4s ease;
}
.arrow:after {
  position: absolute;
  transform: rotate(90deg);
  top: -5px;
  left: 5px;
}
</style>
