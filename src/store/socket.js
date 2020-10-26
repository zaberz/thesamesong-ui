export default {
  state: {
    socketClient: {},
    stompClient: {},
    stompHeaders: {},
    online: 0,
    isConnected: false,
    userName: localStorage.getItem("USER_NAME")
      ? localStorage.getItem("USER_NAME")
      : null,
    isRoot: false,
    isAdmin: false,
    good: false
  },
  mutations: {
    setSocketIsConnected(state, value) {
      state.isConnected = value;
    }
  }
};
