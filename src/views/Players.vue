<template>
  <div>
    <div class="page-title">
      <h3>Общая статистика игроков</h3>

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
      <p>Поиск по нику:</p>
      <input
        style="display: block"
        @input.prevent="searchByNick"
        v-model="nick"
      />
      <Loader v-if="loading" />
      <p v-else-if="n.length < 1" class="center-align">
        Игрока с таким ником не найдено
      </p>
      <v-table v-else :data="n" class="responsive-table highlight">
        <thead slot="head">
          <th>Место</th>
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
      <p>Поиск по нику:</p>
      <input
        style="display: block"
        @input.prevent="searchByNick"
        v-model="nick"
      />
      <Loader v-if="loading" />
      <p v-else-if="n.length < 1" class="center-align">
        Игрока с таким ником не найдено
      </p>
      <v-table v-else :data="n" class="responsive-table highlight">
        <thead slot="head">
          <th>Место</th>
          <v-th sortKey="name"><span>Ник</span></v-th>
          <v-th sortKey="totalPlayedGames"
            ><span class="tip" v-tooltip="'Игры где было более 10 человек'"
              >Кол-во игр</span
            ></v-th
          >
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
  name: "Players",
  data: () => ({
    n: [],
    loading: true,
    nick: "",
    choosed: "За все время",
    period: [],
    mace: [],
    tab: null,
    dataLoaded: false,
  }),
  created() {
    this.searchByNick = _.debounce(this.refresh, 200);
  },
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
    this.choosed = this.getInfo().period || "За все время";
    await this.refresh();
    this.dataLoaded = true;
  },
  watch: {
    choosed: function () {
      if (this.dataLoaded) {
        this.n = [];
        this.refresh();
      }
    },
  },
  methods: {
    ...mapGetters(["getInfo"]),
    async refresh() {
      this.n = [];
      setTimeout(() => {
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
      let r = await fetch(`./stats/sg/all_time/global_statistics.json`);
      r = await r.json();
      let id = 1;
      for (let key in r) {
        if (r[key]) {
          r[key].id = id;
          id++;
          if (r[key].lastSquadPrefix === null) {
            r[key].lastSquadPrefix = "";
          }
          if (this.nick) {
            if (
              r[key].name.toLowerCase().indexOf(this.nick.toLowerCase()) != -1
            ) {
              this.n.push(r[key]);
            }
          } else {
            this.n.push(r[key]);
          }
        }
      }
      this.loading = false;
    },
    async rotationTable() {
      this.loading = true;
      let rotationID = this.period.length - this.$refs.sl.selectedIndex;
      let r = await fetch(
        `./stats/sg/rotation_${rotationID}/global_statistics.json`
      );
      r = await r.json();
      for (let key in r) {
        if (r[key].lastSquadPrefix === null) {
          r[key].lastSquadPrefix = "";
        }
        if (this.nick) {
          if (
            r[key].name.toLowerCase().indexOf(this.nick.toLowerCase()) != -1
          ) {
            this.n.push(r[key]);
          }
        } else {
          this.n.push(r[key]);
        }
      }
      this.loading = false;
    },
    async reloadMace() {
      this.loading = true;
      let r = await fetch(`./stats/mace/global_statistics.json`);
      r = await r.json();
      let id = 1;
      for (let key in r) {
        if (r[key]) {
          r[key].id = id;
          id++;
          if (r[key].lastSquadPrefix === null) {
            r[key].lastSquadPrefix = "";
          }
          if (this.nick) {
            if (
              r[key].name.toLowerCase().indexOf(this.nick.toLowerCase()) != -1
            ) {
              this.n.push(r[key]);
            }
          } else {
            this.n.push(r[key]);
          }
        }
      }
      this.loading = false;
    },
    showPlayer(nick) {
      this.$router.push(`/player/${nick}`);
    },
  },
};
</script>
