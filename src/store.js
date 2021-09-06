import { createStore } from "vuex";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import moment from "moment";
import { firestore } from "@/firebase";

const users = collection(firestore, "users");
const comments = collection(firestore, "comments");

const getDocument = async (path, pathSegments) => {
  const ref = doc(firestore, path, ...(pathSegments || []));
  const snap = await getDoc(ref);
  return { ref, snap };
};

export const store = createStore({
  strict: process.env.NODE_ENV !== "production",
  state: {
    loginUser: null,
    user: null,
    events: [],
    presentations: [],
    comments: [],
    screens: [],
    stamps: [],
    stampCounts: [],
    counts: [],
  },
  getters: {
    loginUser(state) {
      return state.loginUser;
    },
    events(state, getters) {
      return state.events
        .map((ev) => {
          return {
            ...ev,
            id: ev.id,
            date: ev.date.toDate(),
            presentations: getters.presentations.filter(
              (pr) => pr.eventId === ev.id
            ),
          };
        })
        .sort((a, b) => {
          // 開催日時の降順にソート
          return !moment(a.date).isSame(b.date)
            ? moment(a.date).isAfter(b.date)
              ? -1
              : 1
            : 0;
        });
    },
    presentations(state, getters) {
      return state.presentations.map((pr) => {
        return {
          ...pr,
          id: pr.id,
          comments: getters.comments.filter(
            (cm) => cm.presentationId === pr.id
          ),
          stamps: getters.stamps,
        };
      });
    },
    comments(state) {
      return state.comments
        .map((cm) => {
          return {
            ...cm,
            id: cm.id,
            postedAt: cm.postedAt.toDate(),
          };
        })
        .sort((a, b) => {
          // 投稿日時の昇順にソート
          return !moment(a.postedAt).isSame(b.postedAt)
            ? moment(a.postedAt).isAfter(b.postedAt)
              ? -1
              : 1
            : 0;
        });
    },
    screens(state) {
      return state.screens;
    },
    stamps(state) {
      return state.stamps
        .map((st) => {
          return {
            ...st,
            id: st.id,
          };
        })
        .sort((a, b) => a.order - b.order);
    },
    stampCounts(state) {
      return state.stampCounts.map((sc) => {
        return {
          ...sc,
          id: sc.id,
        };
      });
    },
    event(state, getters) {
      return (id) => getters.events.find((e) => e.id === id);
    },
    presentation(state, getters) {
      return (id) => getters.presentations.find((e) => e.id === id);
    },
    comment(state, getters) {
      return (id) => getters.comments.find((e) => e.id === id);
    },
    screen(state, getters) {
      return (id) => getters.screens.find((e) => e.id === id);
    },
    count(state) {
      return (stampId) => state.counts.find((c) => c.stampId === stampId);
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
    clearCounts(state) {
      state.counts.splice(0, state.counts.length);
    },
    setCount(state, payload) {
      const idx = state.counts.findIndex((c) => c.stampId === payload.stampId);
      if (idx !== -1) {
        state.counts.splice(idx, 1, payload);
      } else {
        state.counts.push(payload);
      }
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
     * コメントを登録する
     */
    async appendComment({ state }, { comment, presentationId, isDirect }) {
      const { ref: userRef } = await getDocument("users", [state.user.id]);
      addDoc(comments, {
        comment,
        postedAt: serverTimestamp(),
        presentationId,
        isDirect,
        userRef,
      });
    },
    /*
     * コメントを編集する
     */
    updateComment({ _state }, { comment, isDirect, commentId }) {
      const { ref } = getDocument("comments", [commentId]);
      updateDoc(ref, {
        comment,
        isDirect,
      });
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
    clearCounts({ commit }) {
      commit("clearCounts");
    },
    async watchStampCount({ commit }, { presentationId }) {
      // サブコレクションに対するbindFirestoreRefの適用方法が不明なため、
      // shardsの監視処理は自前で実装
      const stampCounts = await getDocs(
        query(
          collection(firestore, "stampCounts"),
          where("presentationId", "==", presentationId)
        )
      );
      for (const stampCount in stampCounts.docs()) {
        // サブコレクション`shards`を監視し、変更があれば再計算の上stateに反映する
        const shards = await getDocs(
          query(collection(firestore, stampCount.ref.path, "shards"))
        );
        for (const docChange in shards.docChanges()) {
          if (docChange.type === "added" || docChange.type === "modified") {
            commit("setCount", {
              stampId: stampCount.data().stampId,
              count: docChange.doc.data().count,
            });
          }
        }
      }
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
