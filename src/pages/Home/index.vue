<template>
  <div>
    <TypeNav />
    <ListContainer />
    <TodayRecomment />
    <Rank />
    <Like />
    <Floor v-for="floor in floorList" :key="floor.id" :floorObj="floor" />
    <Brand />
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import TodayRecomment from "@/pages/Home/TodayRecommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    ListContainer,
    TodayRecomment,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    this.$store.dispatch("home/getFloorList");
    // this.$store.dispatch("user/getUserInfo");
  },
  computed: {
    ...mapState("home", ["floorList"]),
  },
};
</script>

<style>
</style>