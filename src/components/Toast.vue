<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    v-model="show"
    class="application"
  >
    {{ text }}
  </v-snackbar>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      show: false,
      icon: "",
      text: "",
      color: "info",
      timeout: 3000,
      dismissible: true
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/SHOW_MESSAGE") {
        this.text = state.snackbar.text;
        this.color = state.snackbar.color;
        this.timeout = state.snackbar.timeout;
        this.show = true;
      }
    });
  },
  methods: {
    close() {
      this.active = false;
    },
    dismiss() {
      if (this.dismissible) {
        this.active = false;
      }
    }
  }
};
</script>

<style scoped></style>
