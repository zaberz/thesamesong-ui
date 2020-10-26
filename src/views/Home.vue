<template>
  <div>
    <v-row class="home pa-2">
      <v-col
        v-for="item in roomList"
        :key="item.id"
        md="6"
        sm="6"
        xs="12"
        lg="6"
        xl="4"
        cols="12"
      >
        <v-card ripple hover class="overflow-hidden" @click="enterHouse(item)">
          <v-card-title class="text-truncate">{{ item.name }}</v-card-title>
          <v-card-subtitle class="text-truncate">
            {{ item.desc }}当前在线：{{ item.population }}人
          </v-card-subtitle>

          <v-icon
            v-if="item.needPwd"
            class="rounded-circle grey--text text--lighten-3"
            style="position: absolute;right: 0;top: 50%;transform: translate(30%, -50%);border: 8px solid #eee;box-sizing: border-box"
            size="40px"
          >
            mdi-lock
          </v-icon>
        </v-card>
      </v-col>
    </v-row>
    <password-input
      v-if="showPasswordInput"
      @submit="enterHousePyPassword"
    ></password-input>
  </div>
</template>

<script>
// @ is an alias to /src
import { getHouse, enterHouse } from "../api";
import PasswordInput from "../components/PasswordInput";
export default {
  name: "Home",
  components: {
    PasswordInput
  },
  data() {
    return {
      roomList: [],
      showPasswordInput: "",
      currentRoom: {}
    };
  },
  mounted() {},
  async created() {
    let res = await getHouse();
    this.roomList = res.data;
  },
  methods: {
    enterHouse(item) {
      if (item.needPwd) {
        this.showPasswordInput = true;
        this.currentRoom = item;
      } else {
        this.$router.push({
          name: "Room",
          params: {
            id: item.id
          }
        });
      }
    },
    async enterHousePyPassword(pwd) {
      let data = {
        id: this.currentRoom.id,
        password: pwd
      };
      let res = await enterHouse(data).then(() => {
        this.$router.push({
          name: "Room",
          params: {
            id: this.currentRoom.id
          },
          query: {
            p: window.btoa(pwd)
          }
        });
      });
      console.log(res);
    }
  }
};
</script>
