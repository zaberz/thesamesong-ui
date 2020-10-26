<template>
  <div>
    <!--    <v-container>-->

    <v-row class="d-sm-none" style="position: sticky;top: 0;z-index: 2">
      <v-btn class="primary" @click="$emit('done')">完成</v-btn>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-select
          :items="options"
          :hide-details="true"
          v-model="selectedOrigin"
          solo
        ></v-select>
      </v-col>
      <v-col cols="8">
        <v-text-field
          :hide-details="true"
          v-model="keyword"
          @keypress.enter.native="search(true)"
          label="请输入搜索关键字"
        ></v-text-field>
      </v-col>
    </v-row>
    <!--    </v-container>-->

    <v-tabs v-model="selectedTab">
      <v-tab v-for="item in tabConfig" :key="item">{{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab">
      <v-tab-item key="歌曲">
        <v-list>
          <v-list-item-group>
            <template v-for="(item, index) in searchResList">
              <v-list-item :key="item.id" @click="addSong(item)">
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ item.artist }} - 《{{ item.album.name }}》-
                    时长</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn text>添加</v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>

        <v-pagination
          v-if="totalPage"
          v-model="songsQuery.current"
          :length="totalPage"
          @input="currentChange"
        ></v-pagination>
      </v-tab-item>
      <v-tab-item key="歌单">
        开发中
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import socket from "../utils/socket";
import messageUtils from "../utils/messageUtils";
export default {
  name: "SearchSongs",
  data() {
    return {
      keyword: "",
      selectedOrigin: "qq",
      searchResList: [],
      options: [
        {
          text: "网易",
          value: "wy"
        },
        {
          text: "QQ",
          value: "qq"
        },
        {
          text: "咪咕",
          value: "mg"
        }
      ],
      tabConfig: ["歌曲", "歌单"],
      selectedTab: "",
      songsQuery: {
        current: 1,
        total: ""
      },
      totalPage: 0
    };
  },
  mounted() {
    socket.on("onmessage", this.messageHandler);
  },
  destroyed() {
    socket.removeListener("onmessage", this.messageHandler);
  },
  methods: {
    search(isReload = false) {
      if (isReload) {
        this.songsQuery.current = 1;
      }
      socket.send("/music/search", {
        name: this.keyword,
        sendTime: Date.now(),
        source: this.selectedOrigin,
        pageIndex: this.songsQuery.current,
        pageSize: 10
      });
    },
    currentChange(e) {
      this.songsQuery.current = e;
      this.search();
    },
    addSong(item) {
      socket.send("/music/pick", {
        name: item.name,
        id: item.id,
        source: this.selectedOrigin
      });
    },
    messageHandler(source) {
      if (messageUtils.isKnowMessageType(source.data)) {
        let messageType = messageUtils.parseMessageType(source.data);
        let messageContent = messageUtils.parseMessageContent(source.data);
        console.log(source);
        switch (messageType) {
          case messageUtils.messageType.SEARCH:
            if (messageContent.data && messageContent.data.data) {
              console.log(messageContent);
              this.searchResList = messageContent.data.data;
              this.totalPage =
                Math.ceil(
                  messageContent.data.totalSize / messageContent.data.pageSize
                ) || 0;
            }
            break;
          case messageUtils.messageType.PICK:
            console.log("点歌成功", messageContent.data);
            break;
        }
      }
    }
  }
};
</script>

<style scoped></style>
