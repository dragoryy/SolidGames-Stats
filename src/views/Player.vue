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
                  <v-th sortKey="killsFromVehicle"
                    ><span>Убийств из техники</span></v-th
                  >
                  <v-th sortKey="killsFromVehicleCoef"
                    ><span>Процент убийств из техники</span></v-th
                  >
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
                    <td>{{ row.killsFromVehicle }}</td>
                    <td>{{ Math.floor(row.killsFromVehicleCoef * 100) }}%</td>
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
          <li v-if="vehicles.length">
            <div class="collapsible-header">
              <p class="center">Статистика по технике</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="vehicles" class="responsive-table highlight">
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
          <li v-if="killed.length">
            <div class="collapsible-header">
              <p class="center">Статистика по убитым игрокам</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="killed" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во убийств</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="killers.length">
            <div class="collapsible-header">
              <p class="center">Статистика по смертям от игроков</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="killers" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во смертей от игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="teamkilled.length">
            <div class="collapsible-header">
              <p class="center">Статистика по тимкиллам игроков</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="teamkilled" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во тимкиллов игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="teamkillers.length">
            <div class="collapsible-header">
              <p class="center">Статистика по смертям от тимкилла игроками</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="teamkillers" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Смертей от игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
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
                  <v-th sortKey="killsFromVehicle"
                    ><span>Убийств из техники</span></v-th
                  >
                  <v-th sortKey="killsFromVehicleCoef"
                    ><span>Процент убийств из техники</span></v-th
                  >
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
                    <td>{{ row.killsFromVehicle }}</td>
                    <td>{{ Math.floor(row.killsFromVehicleCoef * 100) }}%</td>
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
          <li v-if="vehicles.length">
            <div class="collapsible-header">
              <p class="center">Статистика по технике</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="vehicles" class="responsive-table highlight">
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
          <li v-if="killed.length">
            <div class="collapsible-header">
              <p class="center">Статистика по убитым игрокам</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="killed" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во убийств</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="killers.length">
            <div class="collapsible-header">
              <p class="center">Статистика по смертям от игроков</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="killers" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во смертей от игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="teamkilled.length">
            <div class="collapsible-header">
              <p class="center">Статистика по тимкиллам игроков</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="teamkilled" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Кол-во тимкиллов игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </li>
          <li v-if="teamkillers.length">
            <div class="collapsible-header">
              <p class="center">Статистика по смертям от тимкилла игроками</p>
              <span class="arrow"></span>
            </div>
            <div class="collapsible-body">
              <v-table :data="teamkillers" class="responsive-table highlight">
                <thead slot="head">
                  <th><span>Место</span></th>
                  <v-th sortKey="name"><span>Игрок</span></v-th>
                  <v-th sortKey="count" defaultSort="desc"
                    ><span>Смертей от игрока</span></v-th
                  >
                </thead>
                <tbody slot="body" slot-scope="{ displayData }">
                  <tr v-for="(row, index) in displayData" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.count }}</td>
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
    vehicles: [],
    killed: [],
    killers: [],
    teamkilled: [],
    teamkillers: [],
  }),
  components: {
    Chart,
  },
  async mounted() {
    this.tab = M.Tabs.init(this.$refs.tab, {
      duration: 50,
    });
    let r = await fetch(`../stats/sg/rotations_info.json`);
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
      this.killers = [];
      this.killed = [];
      this.teamkilled = [];
      this.teamkillers = [];
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
      let r = await fetch(`../stats/sg/all_time/global_statistics.json`);
      r = await r.json();
      for (let key in r) {
        if (r[key].name === this.$route.params.nick) {
          if (r[key].lastSquadPrefix === null) {
            r[key].lastSquadPrefix = "";
          }
          this.n.push(r[key]);
          let playerWeapons = await fetch(
            `../stats/sg/all_time/weapons_statistics/${this.$route.params.nick}.json`
          );
          playerWeapons = await playerWeapons.json();
          let playerWeeks = await fetch(
            `../stats/sg/all_time/weeks_statistics/${this.$route.params.nick}.json`
          );
          playerWeeks = await playerWeeks.json();
          let playerVehicles = playerWeapons.vehicles;
          playerWeapons = playerWeapons.firearms;
          let playerInfo = await fetch(
            `../stats/sg/all_time/other_players_statistics/${this.$route.params.nick}.json`
          );
          playerInfo = await playerInfo.json();
          this.killed = playerInfo.killed;
          this.killers = playerInfo.killers;
          this.teamkilled = playerInfo.teamkilled;
          this.teamkillers = playerInfo.teamkillers;
          this.weapons = playerWeapons.map((w, i) => {
            return { ...w, id: i };
          });
          this.vehicles = playerVehicles.map((w, i) => {
            return { ...w, id: i };
          });
          this.byWeeks = playerWeeks;
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
      let rotationID = this.period.length - this.$refs.sl.selectedIndex;
      let r = await fetch(
        `../stats/sg/rotation_${rotationID}/global_statistics.json`
      );
      r = await r.json();
      for (let key in r) {
        if (r[key].name === this.$route.params.nick) {
          if (r[key].lastSquadPrefix === null) {
            r[key].lastSquadPrefix = "";
          }
          this.n.push(r[key]);
          let playerWeapons = await fetch(
            `../stats/sg/rotation_${rotationID}/weapons_statistics/${this.$route.params.nick}.json`
          );
          playerWeapons = await playerWeapons.json();
          let playerVehicles = playerWeapons.vehicles;
          playerWeapons = playerWeapons.firearms;
          let playerWeeks = await fetch(
            `../stats/sg/rotation_${rotationID}/weeks_statistics/${this.$route.params.nick}.json`
          );
          playerWeeks = await playerWeeks.json();
          let playerInfo = await fetch(
            `../stats/sg/rotation_${rotationID}/other_players_statistics/${this.$route.params.nick}.json`
          );
          playerInfo = await playerInfo.json();
          this.killed = playerInfo.killed;
          this.killers = playerInfo.killers;
          this.teamkilled = playerInfo.teamkilled;
          this.teamkillers = playerInfo.teamkillers;
          this.byWeeks = playerWeeks;
          this.weapons = playerWeapons.map((w, i) => {
            return { ...w, id: i };
          });
          this.vehicles = playerVehicles.map((w, i) => {
            return { ...w, id: i };
          });
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
      let r = await fetch(`../stats/mace/global_statistics.json`);
      r = await r.json();
      for (let key in r) {
        if (r[key].name === this.$route.params.nick) {
          if (r[key].lastSquadPrefix === null) {
            r[key].lastSquadPrefix = "";
          }
          let playerWeapons = await fetch(
            `../stats/mace/weapons_statistics/${this.$route.params.nick}.json`
          );
          playerWeapons = await playerWeapons.json();
          let playerWeeks = await fetch(
            `../stats/mace/weeks_statistics/${this.$route.params.nick}.json`
          );
          let playerVehicles = playerWeapons.vehicles;
          playerWeapons = playerWeapons.firearms;
          playerWeeks = await playerWeeks.json();
          let playerInfo = await fetch(
            `../stats/mace/other_players_statistics/${this.$route.params.nick}.json`
          );
          playerInfo = await playerInfo.json();
          this.killed = playerInfo.killed;
          this.killers = playerInfo.killers;
          this.teamkilled = playerInfo.teamkilled;
          this.teamkillers = playerInfo.teamkillers;
          this.byWeeks = playerWeeks;
          this.weapons = playerWeapons.map((w, i) => {
            return { ...w, id: i };
          });
          this.vehicles = playerVehicles.map((w, i) => {
            return { ...w, id: i };
          });
          this.mace.push(r[key]);
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
