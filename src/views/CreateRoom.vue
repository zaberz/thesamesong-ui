<template>
  <div class="pa-2">
    <v-form ref="form">
      <v-text-field v-model="formData.name" label="房间名"></v-text-field>
      <v-text-field v-model="formData.desc" label="房间描述"></v-text-field>
      <v-sheet>
        <v-switch v-model="formData.needPwd" label="启用密码"> </v-switch>
      </v-sheet>
      <v-text-field
        v-if="formData.needPwd"
        v-model="formData.password"
        label="密码"
      ></v-text-field>
      <v-btn color="primary" @click="submit">创建</v-btn>
    </v-form>
  </div>
</template>

<script>
import { addHouse } from "../api";

export default {
  name: "CreateRoom",
  data() {
    return {
      formData: {
        name: "",
        desc: "",
        password: "",
        needPwd: false,
        enableStatus: "",
        retainKey: ""
      },
      isNeedPwd: ""
    };
  },
  methods: {
    async submit() {
      let res = await addHouse(this.formData);
      let id = res.data;
      this.$router.push({
        name: "Room",
        params: {
          id
        },
        query: {
          p: window.btoa(this.formData.password)
        }
      });
    }
  }
};
</script>

<style scoped></style>
