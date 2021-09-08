import { createStore } from "vuex";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  increment,
} from "firebase/firestore";
import { firestore } from "@/firebase";

const users = collection(firestore, "users");

const getDocument = async (path, pathSegments) => {
  const ref = doc(firestore, path, ...(pathSegments || []));
  const snap = await getDoc(ref);
  return { ref, snap };
};

export const store = createStore({
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
    login({ commit }, { user }) {
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
     * ユーザの権限情報を更新する
     */
    async updatePermission({ commit }, userId) {
      const { snap } = await getDocument("permissions", [userId]);
      const isAdmin = snap.exists() ? snap.data().isAdmin : false;
      commit("setUserIsAdmin", isAdmin);
    },
    /*
     * 発表を新規登録する
     * @params { state }
     * @params presentationInfo
     */
    async addPresentation({ state }, presentationInfo) {
      const batch = writeBatch(firestore);

      // 発表を追加する ///////////////////////////////////////////////////
      const { ref: presentationRef } = await getDocument("presentations");
      const { ref: userRef } = await getDocument("users", [state.user.id]);
      batch.set(presentationRef, {
        ...presentationInfo,
        presenter: userRef,
      });

      // スタンプカウントを追加する ////////////////////////////////////////
      // 有効なスタンプだけ追加
      const usableStamps = await getDocs(
        query(collection(firestore, "stamps"), where("canUse", "==", true))
      );
      for (const usableStamp in usableStamps.docs()) {
        const { ref: stampCountRef } = await getDocument("stampCounts");
        const maxShardNum = process.env.VUE_APP_STAMP_COUNT_SHARD_NUM;
        batch.set(stampCountRef, {
          presentationId: presentationRef.id,
          stampId: usableStamp.id,
          shardNum: maxShardNum,
        });

        // スタンプカウントにshardsサブコレクションを追加する ////////////////
        const stampCountShards = collection(
          firestore,
          "stampCounts",
          stampCountRef.id,
          "shards"
        );
        for (let idx = 0; idx < maxShardNum; idx++) {
          batch.set(stampCountShards.doc(idx.toString()), {
            count: 0,
          });
        }
      }

      await batch.commit();
    },
    /*
     * 発表を更新する
     */
    async updatePresentation({ state }, { presentationId, presentationInfo }) {
      const { ref } = getDocument("presentations", [presentationId]);
      updateDoc(ref, {
        ...presentationInfo,
        presenter: users.doc(state.user.id),
      });
    },
    /*
     * 発表を削除する
     */
    async deletePresentation({ _state }, presentationId) {
      const batch = writeBatch(firestore);
      // スタンプカウント削除
      const stampCounts = await getDocs(
        query(
          collection(firestore, "stampCounts"),
          where("presentationId", "==", presentationId)
        )
      );
      for (const stampCount in stampCounts.docs()) {
        // shardsサブコレクション内ドキュメント削除
        const shardNum = stampCount.data().shardNum;
        for (let idx = 0; idx < shardNum; idx++) {
          const { ref } = await getDocument(stampCount.ref.path, [
            "shards",
            idx.toString(),
          ]);
          batch.delete(ref);
        }
        // スタンプカウントドキュメント削除
        batch.delete(stampCount.ref);
      }
      // コメント削除
      const comments = await getDocs(
        query(
          collection(firestore, "comments"),
          where("presentationId", "==", presentationId)
        )
      );
      for (const comment in comments.docs()) {
        batch.delete(comment.ref);
      }
      // 発表削除
      const { ref: presentationRef } = await getDocument("presentations", [
        presentationId,
      ]);
      batch.delete(presentationRef);
      await batch.commit();
    },
    /*
     * コメントを削除する
     */
    deleteComment({ _state }, { commentId }) {
      const { ref } = getDocument("comments", [commentId]);
      deleteDoc(ref);
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
    async countUpStamp({ _commit }, { presentationId, stampId }) {
      const stampCounts = await getDocs(
        query(
          collection(firestore, "stampCounts"),
          where("presentationId", "==", presentationId),
          where("stampId", "==", stampId)
        )
      );
      if (stampCounts.empty()) {
        const stampCount = stampCounts.docs()[0];
        // 1回/秒の更新制限を回避するため
        // shardNum個あるshardsのうち、ランダムな1個のカウントをインクリメント
        const shardIdx = Math.floor(
          Math.random() * stampCount.data().shardNum
        ).toString();
        const { ref } = await getDocument(stampCount.ref.path, [
          "shards",
          shardIdx,
        ]);
        updateDoc(ref, {
          count: increment(1),
        });
      }
    },
  },
});
