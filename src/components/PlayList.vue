<template>
  <v-card class="transparent">
    <v-list class="transparent">
      <v-subheader
        class="white--text d-flex justify-space-between align-center"
      >
        <div>播放列表：</div>
        <div class="d-sm-none">
          <v-btn small class="primary mr-2">点歌</v-btn>
          <v-btn small class="primary">切歌</v-btn>
        </div>
      </v-subheader>
      <v-list-item-group>
        <v-list-item v-for="item in playlist" :key="item.id">
          <v-btn icon class="deep-orange--text mr-2">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-list-item-avatar class="mr-2">
            <img :src="item.album.pictureUrl" alt="" />
          </v-list-item-avatar>
          <v-list-item-content class="white--text">
            <p>{{ item.name }}</p>
            <div class="text-truncate">
              {{ item.artist }} - 来源- {{ item.nickName }}
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn color="deep-orange " icon>
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PlayList",
  computed: {
    ...mapState("player", ["playlist"])
  }
};
</script>

<style scoped></style>
