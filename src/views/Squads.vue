<template>
  <div>
    <div class="page-title">
      <h3>Общая статистика отрядов</h3>

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
        <option v-for="d of period" :key="d.id">{{ d.title }}</option>
      </select>
      <div
        class=""
        v-if="
          choosed.replace(/\s+/g, '') == currentRotation.replace(/\s+/g, '')
        "
      >
        <p>Выберите сервер:</p>
        <select style="display: block" v-model="serverChoosed">
          <option v-for="d of server" :key="d">{{ d }}</option>
        </select>
        <p>Выберите сторону:</p>
        <select
          style="display: block"
          v-model="sideChoosed"
          v-show="serverChoosed != 'Оба сервера'"
        >
          <option v-for="d of sides" :key="d">{{ d }}</option>
        </select>
      </div>

      <Loader v-if="loading" />
      <v-table v-else :data="n" class="responsive-table highlight centered">
        <thead slot="head">
          <th>Место</th>
          <th>Отряд</th>
          <v-th sortKey="players.length">
            <span
              v-if="this.choosed === this.period[0].title"
              class="tip"
              v-tooltip="
                'Игроки которые сыграли хотя бы одну игру за последние 4 недели'
              "
              >Всего игроков</span
            >
            <span
              v-else
              class="tip"
              v-tooltip="
                'Игроки которые сыграли хотя бы одну игру за последние 4 недели'
              "
              >Всего игроков</span
            ></v-th
          >
          <v-th sortKey="averagePlayersCount"
            ><span class="tip" v-tooltip="'За последние 4 недели'"
              >Средняя явка</span
            >
          </v-th>
          <v-th sortKey="kills"><span>Всего убийств</span></v-th>
          <v-th sortKey="averageKills"
            ><span class="tip" v-tooltip="'За последние 4 недели'"
              >Среднее кол-во убийств</span
            ></v-th
          >
          <v-th sortKey="teamkills"><span>Всего тимкиллов</span></v-th>
          <v-th sortKey="averageTeamkills"
            ><span class="tip" v-tooltip="'За последние 4 недели'"
              >Среднее кол-во тимкиллов</span
            ></v-th
          >
          <v-th sortKey="score" defaultSort="desc"
            ><span class="tip" v-tooltip="'Ср. кол-во киллов / Ср. явка'"
              >Счет</span
            ></v-th
          >
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="(row, index) in displayData" :key="row.id">
            <td>{{ index + 1 }}</td>
            <td
              :class="{
                'red-side':
                  redSide.includes(row.prefix) &&
                  choosed.replace(/\s+/g, '') ==
                    currentRotation.replace(/\s+/g, ''),
                'blue-side':
                  blueSide.includes(row.prefix) &&
                  choosed.replace(/\s+/g, '') ==
                    currentRotation.replace(/\s+/g, ''),
              }"
            >
              <router-link
                :to="'/?tag=' + row.prefix.replace(/\[|\]/g, '')"
                class="squad-name"
                >{{ row.prefix }}</router-link
              >
            </td>
            <td>{{ row.players.length }}</td>
            <td>{{ row.averagePlayersCount }}</td>
            <td>{{ row.kills }}</td>
            <td>{{ row.averageKills }}</td>
            <td>{{ row.teamkills }}</td>
            <td>{{ row.averageTeamkills }}</td>
            <td>{{ row.score }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="row" id="mace">
      <Loader v-if="loading" />
      <v-table v-else :data="n" class="responsive-table highlight">
        <thead slot="head">
          <th>Место</th>
          <th>Отряд</th>
          <v-th sortKey="players.length"
            ><span class="tip" v-tooltip="'Игроки у которых больше 20 игр'"
              >Кол-во игроков</span
            ></v-th
          >
          <v-th sortKey="kills"><span>Убийств</span></v-th>
          <v-th sortKey="teamkills"><span>Тимкиллов</span></v-th>
          <v-th sortKey="score" defaultSort="desc"
            ><span class="tip" v-tooltip="'Средний счет всех игроков отряда'"
              >Счет</span
            ></v-th
          >
        </thead>
        <tbody slot="body" slot-scope="{ displayData }">
          <tr v-for="(row, index) in displayData" :key="row.id">
            <td>{{ index + 1 }}</td>
            <td class="squad-name">
              <router-link
                :to="'/?tag=' + row.prefix.replace(/\[|\]/g, '')"
                class="squad-name"
                >{{ row.prefix }}</router-link
              >
            </td>
            <td>{{ row.players.length }}</td>
            <td>{{ row.kills }}</td>
            <td>{{ row.teamkills }}</td>
            <td>{{ row.score }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Squads",
  data: () => ({
    n: [],
    loading: true,
    choosed: "За все время",
    period: [],
    server: ["Оба сервера", "Первый сервер", "Второй сервер"],
    sides: ["Обе стороны", "Красная сторона", "Синяя сторона"],
    serverChoosed: "Оба сервера",
    sideChoosed: "Обе стороны",
    mace: [],
    tab: null,
    dataLoaded: false,
    currentRotation: "",
    firstServerRed: [
      "[A]",
      "[VTR]",
      "[TAG]",
      "[SKAT]",
      "[YKZ]",
      "[RL]",
      "[Wagner]",
      "[FM]",
    ],
    firstServerBlue: [
      "[31st]",
      "[FB]",
      "[RAF]",
      "[AXE]",
      "[AV]",
      "[OLD]",
      "[KSK]",
      "[SGYR]",
    ],
    secondServerRed: [
      "[inTeam]",
      "[RT]",
      "[GROM]",
      "[Creep]",
      "[OT]",
      "[IT]",
      "[AD]",
      "[GM]",
    ],
    secondServerBlue: [
      "[WD]",
      "[AS]",
      "[RON]",
      "[FNX]",
      "[ISKRA]",
      "[VOG]",
      "[CU]",
      "[DKK]",
      "[SOKIL]",
    ],
    redSide: [],
    blueSide: [],
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
    this.currentRotation = this.period[1].title;
    this.choosed = this.getInfo().period || "За все время";
    this.redSide = this.firstServerRed.concat(this.secondServerRed);
    this.blueSide = this.firstServerBlue.concat(this.secondServerBlue);
    await this.refresh();
    this.dataLoaded = true;
  },
  watch: {
    choosed: function () {
      if (this.dataLoaded) {
        this.refresh();
      }
    },
    sideChoosed: function () {
      if (this.dataLoaded) {
        this.refresh();
      }
    },
    serverChoosed: function () {
      if (this.dataLoaded) {
        this.refresh();
      }
    },
  },
  methods: {
    ...mapGetters(["getInfo"]),
    async refresh() {
      setTimeout(() => {
        if (this.tab.$activeTabLink[0].href.includes("#sg")) {
          if (this.choosed == this.period[0].title) {
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
      let r = await fetch(`./stats/sg/all_time/squad_statistics.json`);
      r = await r.json();
      let id = 1;
      for (let key in r) {
        r[key].id = id;
        id++;
        this.n.push(r[key]);
      }
      this.loading = false;
    },
    async rotationTable() {
      this.loading = true;
      this.n = [];
      let rotationID = this.period.length - this.$refs.sq.selectedIndex;
      let r = await fetch(
        `./stats/sg/rotation_${rotationID}/squad_statistics.json`
      );
      r = await r.json();
      for (let key in r) {
        if (
          this.choosed.replace(/\s+/g, "") ==
          this.currentRotation.replace(/\s+/g, "")
        ) {
          if (this.serverChoosed === "Первый сервер") {
            r[key].server = "1";
            if (this.sideChoosed == "Красная сторона") {
              if (this.firstServerRed.includes(r[key].prefix)) {
                this.n.push(r[key]);
              }
            }
            if (this.sideChoosed == "Синяя сторона") {
              if (this.firstServerBlue.includes(r[key].prefix)) {
                this.n.push(r[key]);
              }
            }
            if (this.sideChoosed == "Обе стороны") {
              if (
                this.firstServerBlue.includes(r[key].prefix) ||
                this.firstServerRed.includes(r[key].prefix)
              ) {
                this.n.push(r[key]);
              }
            }
          }
          if (this.serverChoosed === "Второй сервер") {
            r[key].server = "2";
            if (this.sideChoosed == "Красная сторона") {
              if (this.secondServerRed.includes(r[key].prefix)) {
                this.n.push(r[key]);
              }
            }
            if (this.sideChoosed == "Синяя сторона") {
              if (this.secondServerBlue.includes(r[key].prefix)) {
                this.n.push(r[key]);
              }
            }
            if (this.sideChoosed == "Обе стороны") {
              if (
                this.secondServerBlue.includes(r[key].prefix) ||
                this.secondServerRed.includes(r[key].prefix)
              ) {
                this.n.push(r[key]);
              }
            }
          }
          if (this.serverChoosed === "Оба сервера") {
            if (
              this.secondServerRed.includes(r[key].prefix) ||
              this.secondServerBlue.includes(r[key].prefix)
            ) {
              r[key].server = "2";
            }
            if (
              this.firstServerRed.includes(r[key].prefix) ||
              this.firstServerBlue.includes(r[key].prefix)
            ) {
              r[key].server = "1";
            }
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
      this.n = [];
      let r = await fetch(`./stats/mace/squad_statistics.json`);
      r = await r.json();
      let id = 1;
      for (let key in r) {
        r[key].id = id;
        id++;
        this.n.push(r[key]);
      }
      this.loading = false;
    },
  },
};
</script>
