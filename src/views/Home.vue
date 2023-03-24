<template>
  <div>
    <div class="page-title">
      <h3>Отрядная статистика</h3>

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
      <select style="display: block" v-model="choosed" ref="sq">
        <option v-for="d of period" :key="d.id" :data-id="d.id">
          {{ d.title }}
        </option>
      </select>
      <p>Выберите отряд:</p>
      <select style="display: block" v-model="tag">
        <option v-for="s of squads" :key="s">{{ s }}</option>
      </select>
      <Loader v-if="loading" />
      <p class="center" v-else-if="!n.length">Игроков не найдено.</p>
      <v-table v-else :data="n" class="responsive-table highlight">
        <thead slot="head">
          <th sortKey="id">Место</th>
          <v-th sortKey="name"><span>Ник</span></v-th>
          <v-th sortKey="totalPlayedGames"><span>Кол-во игр</span></v-th>
          <v-th sortKey="kills"><span>Убийств</span></v-th>
          <v-th sortKey="killsFromVehicle"
            ><span>Убийств из техники</span></v-th
          >
          <v-th sortKey="killsFromVehicleCoef"
            ><span>Процент убийств из техники</span></v-th
          >
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
              v-tooltip="'(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'"
              >Счет</span
            ></v-th
          >
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="(row, index) in displayData" :key="row.id">
            <td>{{ index + 1 }}</td>
            <td>
              <router-link
                :to="{ name: 'Player', params: { nick: row.name } }"
                >{{ row.lastSquadPrefix + row.name }}</router-link
              >
            </td>
            <td>{{ row.totalPlayedGames }}</td>
            <td>{{ row.kills }}</td>
            <td>{{ row.killsFromVehicle }}</td>
            <td>{{ Math.floor(row.killsFromVehicleCoef * 100) }}%</td>
            <td>{{ row.vehicleKills }}</td>
            <td>{{ row.teamkills }}</td>
            <td>{{ row.deaths.byTeamkills }}</td>
            <td>{{ row.deaths.total }}</td>
            <td>{{ row.kdRatio }}</td>
            <td>{{ row.totalScore }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="row" id="mace">
      <p>Выберите отряд:</p>
      <select style="display: block" v-model="tag">
        <option v-for="s of squads" :key="s">{{ s }}</option>
      </select>
      <Loader v-if="loading" />
      <p v-else-if="error" class="center">
        Игроков не найдено. Количество игр должно быть больше 20.
      </p>
      <v-table v-else :data="mace" class="responsive-table highlight">
        <thead slot="head">
          <th sortKey="id">Место</th>
          <v-th sortKey="name"><span>Ник</span></v-th>
          <v-th sortKey="totalPlayedGames"><span>Кол-во игр</span></v-th>
          <v-th sortKey="kills"><span>Убийств</span></v-th>
          <v-th sortKey="killsFromVehicle"
            ><span>Убийств из техники</span></v-th
          >
          <v-th sortKey="killsFromVehicleCoef"
            ><span>Процент убийств из техники</span></v-th
          >
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
              v-tooltip="'(Убийства - Тимкиллы) / (Кол-во игр - Смерти от ТК)'"
              >Счет</span
            ></v-th
          >
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="(row, index) in displayData" :key="row.id">
            <td>{{ index + 1 }}</td>
            <td>
              <router-link
                :to="{ name: 'Player', params: { nick: row.name } }"
                >{{ row.lastSquadPrefix + row.name }}</router-link
              >
            </td>
            <td>{{ row.totalPlayedGames }}</td>
            <td>{{ row.kills }}</td>
            <td>{{ row.killsFromVehicle }}</td>
            <td>{{ Math.floor(row.killsFromVehicleCoef * 100) }}%</td>
            <td>{{ row.vehicleKills }}</td>
            <td>{{ row.teamkills }}</td>
            <td>{{ row.deaths.byTeamkills }}</td>
            <td>{{ row.deaths.total }}</td>
            <td>{{ row.kdRatio }}</td>
            <td>{{ row.totalScore }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data: () => ({
    n: [],
    tag: null,
    squads: [],
    loading: true,
    dataLoaded: false,
    choosed: "За все время",
    period: [],
    mace: [],
    tab: null,
    error: false,
  }),
  async mounted() {
    this.tab = M.Tabs.init(this.$refs.tab, {
      duration: 50,
    });
    let r = await fetch(`./stats/sg/rotations_info.json`);
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
    this.choosed = (await this.getInfo().period) || "За все время";
    let rotationID = this.$refs.sq.selectedIndex;
    console.log(rotationID, this.$refs.sq, this.$refs.sq.selectedIndex);
    if (rotationID == 0) {
      let s = await fetch(`./stats/sg/all_time/squad_statistics.json`);
      s = await s.json();
      for (let key in s) {
        this.squads.push(s[key].prefix);
      }
    } else {
      let s = await fetch(
        `./stats/sg/rotation_${rotationID}/squad_statistics.json`
      );
      s = await s.json();
      for (let key in s) {
        this.squads.push(s[key].prefix);
      }
    }
    this.squads.sort();
    this.squads.unshift("[Одиночки]");

    if (this.$route.query.tag) {
      console.log(this.squads);
      console.log(this.squads.includes("[" + this.$route.query.tag + "]"));
      console.log(this.squads.includes("[" + this.$route.query.tag + "]"));
      if (this.squads.includes("[" + this.$route.query.tag + "]")) {
        this.tag = "[" + this.$route.query.tag + "]";
      } else {
        this.tag = this.getInfo().tag || "[FNX]";
      }
    } else {
      this.tag = this.getInfo().tag || "[FNX]";
    }

    await this.refresh();
    this.dataLoaded = true;
  },
  watch: {
    tag: function (newt, old) {
      if (this.dataLoaded) {
        this.n = [];
        this.refresh();
      }
    },
    choosed: function (n, o) {
      if (this.dataLoaded) {
        this.n = [];
        this.refresh();
      }
    },
  },
  methods: {
    ...mapGetters(["getInfo"]),
    async refresh() {
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
      this.n = [];
      this.squads = [];
      let s = await fetch(`./stats/sg/all_time/squad_statistics.json`);
      s = await s.json();
      for (let key in s) {
        this.squads.push(s[key].prefix);
      }
      this.squads.sort();
      this.squads.unshift("[Одиночки]");
      let r = await fetch(`./stats/sg/all_time/global_statistics.json`);
      r = await r.json();
      let squads = await fetch(`./stats/sg/all_time/squad_statistics.json`);
      squads = await squads.json();
      let id = 1;
      let players = [];
      if (this.tag !== "[Одиночки]") {
        players = squads.filter((sq) => sq.prefix === this.tag)[0].players;
        players = players.map((p) => p.name);
      }
      for (let key in r) {
        if (
          r[key].lastSquadPrefix === this.tag &&
          players.indexOf(r[key].name) > -1
        ) {
          r[key].id = id;
          id++;
          this.n.push(r[key]);
        } else if (
          r[key].lastSquadPrefix === null &&
          this.tag === "[Одиночки]"
        ) {
          r[key].lastSquadPrefix = "";
          this.n.push(r[key]);
        }
      }
      this.loading = false;
    },
    async rotationTable() {
      this.loading = true;
      this.n = [];
      let rotationID = this.period.length - this.$refs.sq.selectedIndex;
      this.squads = [];
      let s = await fetch(
        `./stats/sg/rotation_${rotationID}/squad_statistics.json`
      );
      s = await s.json();
      for (let key in s) {
        this.squads.push(s[key].prefix);
      }
      this.squads.sort();
      this.squads.unshift("[Одиночки]");
      let r = await fetch(
        `./stats/sg/rotation_${rotationID}/global_statistics.json`
      );
      r = await r.json();
      let id = 1;
      for (let key in r) {
        if (r[key].lastSquadPrefix === this.tag) {
          this.n.push(r[key]);
        } else if (
          r[key].lastSquadPrefix === null &&
          this.tag === "[Одиночки]"
        ) {
          r[key].lastSquadPrefix = "";
          this.n.push(r[key]);
        }
      }
      this.loading = false;
    },
    async reloadMace() {
      this.error = false;
      this.loading = true;
      this.mace = [];
      let r = await fetch(`./stats/mace/global_statistics.json`);
      r = await r.json();
      let squads = await fetch(`./stats/mace/squad_statistics.json`);
      squads = await squads.json();
      let id = 1;
      let players = [];
      if (this.tag !== "[Одиночки]") {
        players = squads.filter((sq) => sq.prefix === this.tag)[0];
        if (players) {
          players = players.players;
          players = players.map((p) => p.name);
        } else {
          this.error = true;
          this.loading = false;
          return;
        }
      }
      for (let key in r) {
        if (
          r[key].lastSquadPrefix === this.tag &&
          players.indexOf(r[key].name) > -1
        ) {
          r[key].id = id;
          id++;
          this.mace.push(r[key]);
        } else if (
          r[key].lastSquadPrefix === null &&
          this.tag === "[Одиночки]"
        ) {
          r[key].lastSquadPrefix = "";
          this.mace.push(r[key]);
        }
      }
      this.loading = false;
    },
  },
};
</script>
