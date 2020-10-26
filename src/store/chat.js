export default {
  namespaced: true,
  state: {
    data: [],
    message: "",
    userList: []
  },
  mutations: {
    pushChatData(state, value) {
      state.data.push(value);
    },
    setUserList(state, list) {
      state.userList = list;
    },
    setRoomName(state, name) {
      state.roomName = name;
    }
  }
};
