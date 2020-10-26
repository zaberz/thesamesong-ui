export default {
  namespaced: true,
  state: {
    playlist: []
  },
  getters: {
    current: state => {
      return state.playlist[0] || {};
    },
    next: state => {
      return state.playlist[1] || {};
    }
  },
  mutations: {
    setPlayList(state, value) {
      state.playlist = value;
    }
  }
};
