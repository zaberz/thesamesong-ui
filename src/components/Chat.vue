<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-row
      class="flex-fill"
      style="flex: 1;overflow: hidden;position: relative;"
      no-gutters
    >
      <v-col cols="10" style="height: 100%;overflow: auto" ref="messageContent">
        <div class="infos flex-fill rounded" style="overflow: auto;">
          <div v-for="(item, index) in messageData" :key="index">
            <div v-if="item.type === 'notice'" class="text-center mb-2">
              <div
                class="grey lighten-4 rounded-lg d-inline-block pa-2 text--darken-2"
              >
                {{ item.content }}
              </div>
            </div>
            <div v-if="item.type === 'chat'">
              <div>{{ item.nickName }}:</div>
              <div
                class="rounded-pill green lighten-1 white--text d-inline-block pa-2 ml-4 mb-2"
              >
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col
        cols="2"
        class="grey lighten-4"
        style="height: 100%;overflow: auto"
      >
        <v-btn text @click="getUser">
          <v-icon>mdi-refresh</v-icon>
          当前在线：
        </v-btn>
        <div
          v-for="(item, index) in userList"
          :key="index"
          class="pa-2 text-truncate"
        >
          <div>{{ item.name || item.nickName || item.remoteAddress }}</div>
        </div>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <div
      class="light-blue lighten-5 pa-2 d-flex justify-space-between align-center"
    >
      <div>
        <v-btn small color="primary" class="mr-2">斗图</v-btn>
        <v-btn
          small
          color="primary"
          class="mr-2"
          @click="$emit('showSearchSong')"
          >点歌</v-btn
        >
        <!--      <v-btn>歌单</v-btn>-->
        <v-btn small color="primary" @click="musicSkipVote">切歌</v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-text-field
        placeholder="设置昵称"
        class="d-inline-block"
        hide-details
        dense
        flat
        @keypress.enter="setName"
        v-model="userName"
      >
        <v-btn icon slot="append" @click="setName">
          <v-icon>mdi-circle-edit-outline</v-icon></v-btn
        >
      </v-text-field>
    </div>

    <div>
      <v-textarea
        auto-grow
        outlined
        class="pa-0 rounded-0"
        style="border-color: #eee"
        rows="3"
        v-model="chatMessage"
        @keypress.enter.self.prevent="send"
        hide-details
      >
        <v-btn
          slot="append"
          style="position:absolute;bottom: 8px;right: 8px"
          class=""
          text
          @click.stop="send"
          >发送</v-btn
        >
      </v-textarea>
    </div>
  </div>
</template>

<script>
import socket from "../utils/socket";
import { mapState, mapMutations } from "vuex";
import messageUtils from "../utils/messageUtils";
export default {
  name: "Chat",
  data() {
    return {
      chatMessage: "",
      userName: window.localStorage.getItem("USER_NAME")
    };
  },
  computed: {
    ...mapState("chat", {
      messageData: state => {
        return state.data;
      },
      userList: state => state.userList
    })
  },
  mounted() {
    socket.on("onmessage", this.messageHandler);
  },
  destroyed() {
    socket.removeListener("onmessage", this.messageHandler);
  },
  methods: {
    ...mapMutations("chat", ["pushChatData", "setUserList"]),
    send() {
      if (this.chatMessage) {
        socket.send("/chat", { content: this.chatMessage });
        this.$nextTick(() => {
          this.chatMessage = "";
        });
      }
    },
    musicSkipVote() {
      socket.send("/music/skip/vote");
    },
    getUser() {
      socket.send("/house/houseuser");
    },
    messageHandler(source) {
      if (messageUtils.isKnowMessageType(source.data)) {
        let messageType = messageUtils.parseMessageType(source.data);
        let messageContent = messageUtils.parseMessageContent(source.data);

        switch (messageType) {
          case messageUtils.messageType.NOTICE:
            if (messageContent.message) {
              this.pushChatData({
                content: messageContent.message,
                type: "notice"
              });
            }
            break;
          case messageUtils.messageType.CHAT:
            this.pushChatData(messageContent.data);
            break;
          case messageUtils.messageType.HOUSE_USER:
            this.setUserList(messageContent.data);
            break;
        }

        this.$nextTick(() => {
          let el = this.$refs["messageContent"];
          el.scrollTo(0, 99999);
        });
      }
    },
    setName() {
      socket.send("/setting/name", { name: this.userName });
      window.localStorage.setItem("USER_NAME", this.userName);
    }
  }
};
</script>

<style scoped></style>
