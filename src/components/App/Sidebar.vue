<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }" ref="side">
    <router-link
      v-for="link in links"
      v-bind:key="link.url"
      :to="link.url"
      custom
      v-slot="{ navigate, isActive, isExactActive, href }"
    >
      <li
        @click="navigate"
        :class="(isActive && 'active', isExactActive && 'active')"
      >
        <a :href="href" class="waves-effect waves-red pointer">
          <i class="tiny material-icons">{{ link.icon }}</i>
          {{ link.title }}</a
        >
      </li>
    </router-link>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["value"],
  data: () => ({
    links: [
      { title: "Отрядная статистика", url: "/", icon: "people" },
      {
        title: "Общая статистика игроков",
        url: "/players",
        icon: "person",
      },
      {
        title: "Общая статистика отрядов",
        url: "/squads",
        icon: "groups",
      },
      {
        title: "Моя статистика",
        url: "",
        icon: "account_box",
      },
    ],
  }),
  mounted() {
    setTimeout(() => {
      if (this.getInfo().nick) {
        this.playerLink = "/player/" + this.getInfo().nick;
        this.links[3].url = this.playerLink;
      } else {
        this.playerLink = "/settings?msg=setnick";
        this.links[3].url = this.playerLink;
      }
    });
  },
  methods: {
    ...mapGetters(["getInfo"]),
  },
};
</script>

<style scoped>
i {
  margin-right: 0px !important;
}
.sidenav li > a {
  font-size: 12.5px;
}
</style>
