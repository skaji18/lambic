import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    loginUser: null,
  },
  getters: {
    loginUser(state) {
      return state.loginUser;
    },
  },
  mutations: {
    setLoginUser(state, payload) {
      state.loginUser = payload;
    },
  },
  actions: {
    login({ commit }, user) {
      commit("setLoginUser", user);
    },
    logout({ commit }) {
      commit("setLoginUser", null);
    },
  },
});
