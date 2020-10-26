<template>
  <div class="">
    <v-row class="d-flex justify-center" style="position: relative">
      <v-col cols="10">
        <img
          :src="current.pictureUrl"
          alt=""
          class="album-cover rounded-circle elevation-20 pa-8 black"
        />
      </v-col>

      <v-hover class="" v-slot:default="{ hover }">
        <div
          class="volume-container pa-2 rounded-pill"
          style="position:absolute;top: 0;right: 12px;bottom: 0;background: rgba(222,222,222,0.5)"
          :class="{ 'is-hover': hover }"
        >
          <v-slider
            vertical
            v-model="volume"
            prepend-icon="mdi-volume-high"
            height="100%"
            max="100"
            min="0"
            :disabled="!hover"
            @change="setVolume"
          ></v-slider>
        </div>
      </v-hover>
    </v-row>
    <!--    <audio :src="current.url" controls autoplay></audio>-->
    <audio :src="current.url" ref="playingAudio" controls autoplay></audio>
    <play-list></play-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PlayList from "./PlayList";
export default {
  name: "Player",
  components: {
    PlayList
  },
  mounted() {},
  computed: {
    ...mapState("player", ["playlist"]),
    ...mapGetters("player", ["current"])
  },
  data() {
    return {
      // current: {},
      next: {},
      volume: 100
    };
  },
  methods: {
    setVolume(value) {
      this.$refs["playingAudio"].volume = value / 100;
    }
  },
  watch: {
    playList(v) {
      this.current = v[0];
    }
  }
};
</script>

<style scoped lang="scss">
audio {
  display: none;
}
.album-cover {
  width: 100%;
  animation: rotate 30s infinite linear;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.volume-container {
  opacity: 0;
  transition: opacity 0.3s;

  &.is-hover {
    opacity: 1;
  }
}
</style>
