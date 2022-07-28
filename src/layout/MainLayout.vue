<template>
  <div class="app-main-layout" :class="{ dark: theme }">
    <Navbar @click="isOpen = !isOpen" />
    <Sidebar v-model="isOpen" :key="isNickChanged" />
    <main class="app-content" :class="{ full: !isOpen }">
      <div class="app-page">
        <router-view @reloadSidebar="sidebarReload()" />
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "@/components/App/Navbar";
import Sidebar from "@/components/App/Sidebar";
export default {
  name: "main-layout",
  data: () => ({
    isOpen: true,
    loading: true,
    isNickChanged: 0,
  }),
  async mounted() {
    this.$store.dispatch("getLocalInfo");
    if (screen.width < 760) {
      this.isOpen = false;
    }
  },
  computed: {
    theme() {
      return this.$store.getters.getInfo.theme;
    },
  },
  methods: {
    ...mapGetters(["getInfo"]),
    sidebarReload() {
      this.isNickChanged += 1;
    },
  },
  components: {
    Navbar,
    Sidebar,
  },
};
</script>
