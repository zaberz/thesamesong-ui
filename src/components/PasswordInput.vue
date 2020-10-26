<template>
  <v-dialog :value="true">
    <v-card>
      <v-card-title>请输入密码</v-card-title>
      <v-container>
        <v-text-field
          v-model="password"
          placeholder="请输入密码"
          @keypress.enter="submit"
        ></v-text-field>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="submit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PasswordInput",
  data() {
    return {
      password: ""
    };
  },
  methods: {
    submit() {
      if (this.password) {
        this.$emit("submit", this.password);
      }
    }
  }
};
</script>

<style scoped></style>
