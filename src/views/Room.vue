<template>
  <v-row style="height: calc(100vh - 48px);" no-gutters>
    <v-col
      style="height: 100%;overflow: auto;position: relative"
      class="pa-2 blue-grey darken-4"
      xs="12"
      sm="4"
      cols="12"
      md="4"
    >
      <!--      cyan lighten-4-->
      <img
        :src="current.pictureUrl"
        alt=""
        style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 0;width: 100%;height: 100%;object-fit: cover;
           filter: blur(20px); opacity: .5;
"
      />
      <Player style="position: relative;z-index: 1"></Player>
      <!--        <v-btn color="primary" class="ma-4" @click="musicSkipVote">切歌</v-btn>-->
      <!--        <v-btn color="primary" class="ma-4">点歌</v-btn>-->
    </v-col>
    <v-col style="height: 100%;overflow: auto" cols="12" xs="12" sm="8" md="8">
      <Chat @showSearchSong="showSearchSong"></Chat>
    </v-col>

    <v-navigation-drawer
      v-model="isShowSearchSong"
      app
      mobile-breakpoint="9999"
      right
      style="width: 50%;min-width: 350px"
    >
      <div class="pa-2">
        <search-songs @done="isShowSearchSong = false"></search-songs>
      </div>
    </v-navigation-drawer>
    <!--    <v-col cols="4" class="pa-0">-->
    <!--    </v-col>-->
  </v-row>
</template>

<script>
import { enterHouse } from "../api";
import { mapGetters, mapMutations } from "vuex";
import messageUtils from "../utils/messageUtils";
import Socket from "../utils/socket";
import SearchSongs from "../components/SearchSongs";
import Player from "../components/Player";
import socket from "../utils/socket";
import Chat from "../components/Chat";
export default {
  name: "Room",
  components: {
    SearchSongs,
    Player,
    Chat
  },
  data() {
    return {
      houseId: "",
      housePwd: "",
      connectType: "",
      socketClient: Socket,
      isShowSearchSong: false
    };
  },
  computed: {
    ...mapGetters("player", ["current"])
  },
  mounted() {
    this.initData();

    this.socketClient.on("onmessage", this.messageHandler);
  },
  destroyed() {
    this.socketClient.removeListener("onmessage", this.messageHandler);
  },
  methods: {
    ...mapMutations("socket", ["setSocketIsConnected"]),
    ...mapMutations("player", ["setPlayList"]),
    initData() {
      let id = this.$route.params.id;
      let p = this.$route.query.p;
      let enterParams = {
        id
      };
      if (p) {
        enterParams.password = this.housePwd = window.atob(p);
      }
      enterHouse(enterParams).then(() => {
        this.houseId = id;
        this.connectType = "enter";
        this.connect();
      });
    },
    connect() {
      this.socketClient.setOption(
        this.houseId,
        this.housePwd,
        this.connectType
      );
      this.socketClient.connect().then(() => {});
    },
    messageHandler: function(source) {
      console.log("消息处理器收到消息", source);
      if (messageUtils.isKnowMessageType(source.data)) {
        let messageType = messageUtils.parseMessageType(source.data);
        let messageContent = messageUtils.parseMessageContent(source.data);
        switch (messageType) {
          case messageUtils.messageType.PICK:
            this.setPlayList(messageContent.data);
            break;

          /*case messageUtils.messageType.ONLINE:
            if (
              messageContent.data.count !== undefined &&
              typeof messageContent.data.count !== "undefined" &&
              messageContent.data.count !== null &&
              messageContent.data.count !== ""
            ) {
              this.$store.commit("setSocketOnline", messageContent.data.count);
            }
            break;
          case messageUtils.messageType.HOUSE_USER:
            let users = messageContent.data;
            for (let i = 0; i < users.length; i++) {
              this.$store.commit("pushChatData", {
                content:
                  i +
                  1 +
                  "." +
                  users[i].nickName +
                  "[" +
                  users[i].sessionId +
                  "]",
                type: "notice"
              });
            }
            break;
          case messageUtils.messageType.NOTICE:
            if (
              messageContent.message !== undefined &&
              typeof messageContent.message !== "undefined" &&
              messageContent.message !== null &&
              messageContent.message !== ""
            ) {
              this.$store.commit("pushChatData", {
                content: messageContent.message,
                type: "notice"
              });
              if (messageContent.message == "点歌成功")
                this.$toast.message({
                  message: messageContent.message,
                  time: 1000
                });
            } else {
              this.$toast.message(messageContent.message);
            }
            break;
          case messageUtils.messageType.ANNOUNCEMENT:
            if (this.announceToast) {
              this.$toast.close(this.announceToast);
            }
            if (messageContent.data.content) {
              this.announceToast = this.$toast.message({
                message: "公告：" + messageContent.data.content,
                time: 60 * 1000,
                closeIcon: "close",
                close: true
              });
            }
            break;
          case messageUtils.messageType.CHAT:
            // parse picture
            let imgList = [];
            let matchUrlList = messageContent.data.content.match(
              /[picture].*?:\/\/[^\s]*!/gi
            );
            if (matchUrlList !== null) {
              for (let i = 0; i < matchUrlList.length; i++) {
                imgList.push(matchUrlList[i].replace("picture:", ""));
                messageContent.data.content = messageContent.data.content.replace(
                  matchUrlList[i],
                  ""
                );
              }
            }
            messageContent.data.images = imgList;
            this.$store.commit("pushChatData", messageContent.data);
            break;
          case messageUtils.messageType.GOODMODEL:
            var data = messageContent.data;
            if (data == "GOOD") {
              this.$store.commit("setSocketGood", true);
            } else {
              this.$store.commit("setSocketGood", false);
            }
            // this.$forceUpdate();

            break;
          case messageUtils.messageType.VOLUMN:
            //console.log(messageContent.data);
            music.volume = Number(messageContent.data) / 100;
            this.$store.commit("setPlayerVolume", messageContent.data);

            break;
          case messageUtils.messageType.MUSIC:
            this.lastLyric = "";
            this.$store.commit("setPlayerLyric", "");
            this.firstLoaded = 0;
            this.$store.commit("setPlayerMusic", messageContent.data);
            document.querySelector("#music").preload = "auto";
            if (
              messageContent.data.lyric === undefined ||
              typeof messageContent.data.lyric === "undefined" ||
              messageContent.data.lyric === null ||
              messageContent.data.lyric === ""
            ) {
              this.$store.commit("setPlayerLyrics", []);
            } else {
              this.$store.commit(
                "setPlayerLyrics",
                musicUtils.parseLyric(messageContent.data.lyric)
              );
            }
            document.title = messageContent.data.name;
            break;
          case messageUtils.messageType.AUTH_ROOT:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice"
            });
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setSocketRoot", true);
              // console.log('root success')
            } else {
              this.$store.commit("setSocketRoot", false);
            }
            break;
          case messageUtils.messageType.ENTER_HOUSE_START:
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setPlayerPick", new Array());
            }
            break;
          case messageUtils.messageType.ADD_HOUSE_START:
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setPlayerPick", new Array());
            }
            break;
          case messageUtils.messageType.ENTER_HOUSE:
            this.loading.close();
            if (Number(messageContent.code) === 20000) {
              this.houseId = this.houseIdNoAction;
              this.housePwd = this.housePwdNoAction;
              this.connectType = this.connectTypeNoAction;
              this.musichouse = this.houseForward;
              // console.log('root success')
              this.openHouse = false;
              document
                .querySelectorAll(".mu-tooltip")
                .forEach(el => (el.style.display = "none"));
              let userName = window.localStorage.getItem("USER_NAME");
              if (userName) {
                this.settingName(userName);
              }
            } else {
              this.$toast.message(messageContent.message);
              this.getHouses();
            }
            break;
          case messageUtils.messageType.ADD_HOUSE:
            this.loading.close();
            if (Number(messageContent.code) === 20000) {
              this.musichouse = this.house.name;
              this.houseId = messageContent.data;
              this.housePwd = this.house.password;
              this.connectType = "";
              // console.log('root success')
              this.openHouse = false;
              document
                .querySelectorAll(".mu-tooltip")
                .forEach(el => (el.style.display = "none"));
              let userName = window.localStorage.getItem("USER_NAME");
              if (userName) {
                this.settingName(userName);
              }
            } else {
              this.$toast.message(messageContent.message);
            }
            break;
          case messageUtils.messageType.AUTH_ADMIN:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice"
            });
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setSocketAdmin", true);
              // console.log('admin success')
            } else {
              this.$store.commit("setSocketAdmin", false);
            }
            break;
          case messageUtils.messageType.SETTING_NAME:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice"
            });
            this.$store.commit("setSocketUserName", messageContent.data.name);
            break;
          case messageUtils.messageType.SEARCH_SONGLIST:
            this.$store.commit(
              "setSearchCountGd",
              messageContent.data.totalSize
            );
            this.$store.commit("setSearchDataGd", messageContent.data.data);
            break;
          case messageUtils.messageType.SEARCH_USER:
            this.$store.commit(
              "setSearchCountUser",
              messageContent.data.totalSize
            );
            this.$store.commit("setSearchDataUser", messageContent.data.data);
            break;
          case messageUtils.messageType.SEARCH_HOUSE:
            this.houses = messageContent.data;
            break;
          case messageUtils.messageType.SEARCH_PICTURE:
            this.$store.commit(
              "setSearchPictureCount",
              messageContent.data.totalSize
            );
            this.$store.commit(
              "setSearchPictureData",
              messageContent.data.data
            );
            break;*/
          default:
            // console.log('未知消息类型', messageType, source);
            break;
        }
      }
    },
    musicSkipVote() {
      socket.send("/music/skip/vote");
    },
    showSearchSong() {
      this.isShowSearchSong = !this.isShowSearchSong;
    }
  }
};
</script>

<style scoped></style>
