<template>
  <nav class="navbar red lighten-2">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a @click="$emit('click')">
          <i class="material-icons">dehaze</i>
        </a>
        <span class="black-text"></span>
      </div>

      <ul class="right">
        <li>
          <a
            href="https://www.tiktok.com/@phoenix_arma/"
            title="TikTok отряда Phoenix"
            alt="TikTok отряда Phoenix"
            target="_blank"
            class="hide-on-small-and-down"
          >
            <img src="/img/9034940_logo_tiktok_icon.svg" />
          </a>
        </li>
        <li>
          <router-link to="/settings" title="Настройки статистики"
            ><i class="material-icons">settings</i></router-link
          >
        </li>
        <li>
          <a
            class="dropdown-trigger"
            data-target="dropdown"
            ref="dropdown"
            style="font-weight: 700"
          >
            © Phoenix, 2016-2022
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => ({}),
  mounted() {},
  computed: {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style scoped>
.navbar-left a {
  cursor: pointer;
}
.right img {
  vertical-align: sub;
  filter: invert(1);
  width: 21px;
  height: 21px;
}
.right a {
  cursor: pointer;
}
</style>
