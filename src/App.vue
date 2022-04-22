<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <!-- Home或者Search显示 登录和注册隐藏 -->
    <Footer v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.$store.dispatch("home/categoryList");
  },
};
</script>

<style>
</style>
