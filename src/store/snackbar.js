export default {
  namespaced: true,
  state: {
    text: "",
    color: "info",
    timeout: 3000
  },
  mutations: {
    SHOW_MESSAGE(state, payload) {
      state.text = payload.text;
      state.color = payload.color;
      state.timeout = payload.timeout || 3000;
    }
  }
};
