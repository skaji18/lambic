import Vue from "vue";
import Vuex from "vuex";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

const getDocument = async (path, pathSegments) => {
  const ref = doc(firestore, path, ...(pathSegments || []));
  const snap = await getDoc(ref);
  return { ref, snap };
};

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    loginUser: null,
    screens: [],
  },
  getters: {
    loginUser(state) {
      return state.loginUser;
    },
    screens(state) {
      return state.screens;
    },
    screen(state, getters) {
      return (id) => getters.screens.find((e) => e.id === id);
    },
  },
  mutations: {
    setLoginUser(state, payload) {
      state.loginUser = payload;
    },
    updateUserInfo(state, payload) {
      state.user = Object.assign({}, state.user, payload);
    },
    setUserIsAdmin(state, payload) {
      state.user.isAdmin = payload;
    },
  },
  actions: {
    login({ commit }, user) {
      commit("setLoginUser", user);
    },
    logout({ commit }) {
      commit("setLoginUser", null);
    },
    /*
     * ユーザ情報を更新する
     */
    async updateUserInfo({ getters, commit }, userInfo) {
      const { ref } = await getDocument("users", [getters.user.id]);
      updateDoc(ref, userInfo);
      commit("updateUserInfo", userInfo);
    },
    /*
     * screenドキュメントの表示中プレゼンテーションを更新する
     */
    updateScreenPresentation({ _state }, { screenId, presentationId }) {
      const { ref } = getDocument("screens", [screenId]);
      const { ref: displayPresentationRef } = getDocument("presentations", [
        presentationId,
      ]);
      updateDoc(ref, {
        displayPresentationRef,
      });
    },
    /*
     * screenドキュメントの表示中プレゼンテーションを削除する
     */
    unsetScreenPresentation({ _state }, screenId) {
      const { ref } = getDocument("screens", [screenId]);
      updateDoc(ref, {
        displayPresentationRef: null,
      });
    },
  },
});
