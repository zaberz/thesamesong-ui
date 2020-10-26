import Vue from "vue";
import Vuex from "vuex";
import snackbar from "./snackbar";
import socket from "./socket";
import player from "./player";
import chat from "./chat";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    snackbar,
    socket,
    player,
    chat
  }
});
