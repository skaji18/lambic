<template>
  <v-layout row class="pb-5">
    <v-row v-if="presentation != null">
      <v-card>
        <v-card-text>
          <v-layout align-center mb-2 class="grey--text">
            <span class="text-truncate">{{ event.title }}</span>
            <v-spacer />
            <span>{{ formatDate(event.date) }}</span>
          </v-layout>
          <v-layout align-center>
            <h1 class="headline">{{ presentation.title }}</h1>
            <v-spacer />

            <v-menu
              v-if="
                user.id &&
                presentation.presenter &&
                presentation.presenter.id === user.id
              "
              bottom
              left
            >
              <template #activator="{ on }">
                <v-btn icon class="mx-0 my-0" v-on="on">
                  <v-icon color="gray">more_vert</v-icon>
                </v-btn>
              </template>
              <v-list class="px-2">
                <v-list-item @click="editPresentation">
                  <v-list-item-title>
                    <v-icon class="mr-1">edit</v-icon>編集する
                  </v-list-item-title>
                  <v-divider class="mx-2" />
                  <v-list-item-title>
                    <v-icon class="mr-1">delete_forever</v-icon>削除する
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-layout>

          <div v-if="presentation.presenter" class="grey--text mb-3">
            by {{ presentation.presenter.name }}
          </div>
          <div v-else class="grey--text mb-3">
            （発表者情報は削除されています）
          </div>
          <p>{{ presentation.description }}</p>
        </v-card-text>
      </v-card>

      <v-card class="py-3 mb-2 sticky-top top-56">
        <template v-for="stamp in presentation.stamps">
          <v-chip
            v-if="presentation.getStampCount(stamp.id)"
            :key="stamp.id"
            color="light-green"
            text-color="white"
            class="text-xs-center"
            label
            @click="countUpStamp(stamp.id)"
          >
            <v-avatar v-if="stamp.src" tile color="grey lighten-3">
              <img :src="stamp.src" />
            </v-avatar>
            <v-avatar v-else color="grey lighten-3" class="black--text">
              {{ stamp.string }}
            </v-avatar>
            <span>
              {{ presentation.getStampCount(stamp.id) }}
            </span>
          </v-chip>
        </template>
      </v-card>

      <v-card v-if="presentation.isAllowComment !== false">
        <v-card-title>
          <h3>コメント一覧</h3>
        </v-card-title>
        <v-card-text v-if="comments.length === 0">
          <p>まだコメントはありません。</p>
        </v-card-text>
        <div
          v-for="c in comments"
          v-else
          :key="c.id"
          :class="{ yellow: c.isDirect, 'lighten-4': c.isDirect }"
        >
          <v-divider />
          <v-card-text class="py-2">
            <v-layout v-if="c.isDirect">
              <small class="grey--text">ダイレクトコメント</small>
            </v-layout>
            <v-layout align-center mb-1>
              <v-avatar v-if="c.userRef.photoURL" size="28" class="mr-1">
                <img :src="c.userRef.photoURL" />
              </v-avatar>
              <v-avatar v-else size="28" class="mr-1">
                <v-icon size="28" color="gray">account_circle</v-icon>
              </v-avatar>
              <strong class="text-truncate">
                {{ c.userRef.name || "（削除されたユーザ）" }}
              </strong>
              <v-spacer />
              <span>{{ formatDateTime(c.postedAt) }}</span>
              <v-menu v-if="c.canEdit(user) || c.canDelete(user)" bottom left>
                <template #activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-if="c.canEdit(user)"
                    @click="openModifyComment(c.id)"
                  >
                    <v-list-item-title>編集</v-list-item-title>
                  </v-list-item>
                  <v-divider />
                  <v-list-item
                    v-if="c.canDelete(user)"
                    @click="deleteComment(c.id)"
                  >
                    <v-list-item-title>削除</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-layout>
            <p>{{ c.comment }}</p>
          </v-card-text>
        </div>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <div class="grey--text">この発表にはコメントできません。</div>
        </v-card-title>
      </v-card>

      <v-btn fixed fab bottom left color="green" :to="prevLink">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <v-dialog
        v-if="presentation.isAllowComment !== false"
        v-model="dialog"
        width="500"
      >
        <template #activator>
          <v-btn fixed fab bottom right color="green">
            <v-icon>create</v-icon>
          </v-btn>
        </template>

        <v-card v-if="user.id">
          <v-card-text class="pb-1">
            <v-alert outline :value="errors.length > 0" color="error">
              <ul>
                <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
              </ul>
            </v-alert>
            <v-textarea
              v-if="dialog"
              v-model="comment"
              outline
              autofocus
              no-resize
              name="comment-input"
              label="input comment"
            />

            <!-- 新規投稿のときのみダイレクトコメントを選択可能 -->
            <v-container
              v-if="editingCommentId === null"
              grid-list-md
              class="px-0 py-0"
            >
              <v-layout wrap row>
                <v-row shrink>
                  <v-checkbox
                    v-model="isDirect"
                    color="primary"
                    class="my-0 py-0"
                  >
                    <template #label>
                      <span class="black--text">
                        ダイレクトコメントにする
                      </span>
                    </template>
                  </v-checkbox>
                </v-row>
                <v-row>
                  <v-tooltip right>
                    <template #activator="{ on }">
                      <v-icon color="primary" v-on="on">help</v-icon>
                    </template>
                    <span
                      ><strong>ダイレクトコメント</strong
                      >：<br />発表者と投稿者のみが<br />閲覧できるコメント</span
                    >
                  </v-tooltip>
                </v-row>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="postCommnet"> submit </v-btn>
            <v-btn color="primary" flat @click="closeComment"> cancel </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-card-text class="text-xs-center">
            <p class="title mt-3">コメントしてみませんか？</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="light-green" :to="{ path: '/login' }">
              ログインする
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-xs-center">
            <p>ログインすると発表にコメントできます。</p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-progress-linear v-else indeterminate />
  </v-layout>
</template>

<script>
import moment from "moment";
import { PresentationService } from "@/services/PresentationService";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      service: new PresentationService(),
      presentation: null,
      unsubscribes: [],
      dialog: false,
      comment: "",
      isDirect: false,
      editingCommentId: null,
      errors: [],
    };
  },
  computed: {
    event() {
      return this.presentation.event;
    },
    comments() {
      return this.presentation.comments.filter((cm) => cm.canShowBy(this.user));
    },
    prevLink() {
      return {
        path: `/events/${this.presentation.eventId}`,
      };
    },
    user() {
      return (
        this.$store.getters.loginUser || {
          id: null,
          isAdmin: false,
        }
      );
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.closeComment();
      }
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.presentation = await this.service.get(this.id);
    },
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD（ddd）");
    },
    formatDateTime(date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
    editPresentation() {
      this.$router.push({
        path: `/${this.presentation.eventId}/draftPresentations/${this.id}`,
      });
    },
    deletePresentation() {
      if (confirm("この発表を削除します。よろしいですか？")) {
        this.$store.dispatch("deletePresentation", this.id);
        this.$router.push({ path: `/events/${this.presentation.eventId}` });
      }
    },
    /**
     * 指定したコメントの編集モーダルを開く
     * @param {string} commentId
     */
    openModifyComment(commentId) {
      const target = this.comments.find((c) => c.id === commentId);
      if (target || !target.canEdit(this.user)) {
        return alert("そのコメントは編集できません！");
      }
      this.editingCommentId = commentId;
      this.comment = target.comment;
      this.isDirect = target.isDirect;
      this.dialog = true;
    },
    validateComment(c) {
      return {
        length: c.length <= 1000,
        required: c.replace(/\s+$/gm, "").length > 0,
      };
    },
    /**
     * コメントを保存する
     */
    postCommnet() {
      // eslint-disable-next-line no-irregular-whitespace
      const rtrimRegex = /[ \t\f　]+$/gm;
      const com = this.comment.replace(rtrimRegex, "");
      const res = this.validateComment(com);
      if (Object.values(res).every((v) => v)) {
        if (this.editingCommentId == null) {
          this.service.appendComment({
            comment: com,
            presentationId: this.id,
            isDirect: this.isDirect,
          });
        } else {
          const target = this.comments.find(
            (c) => c.id === this.editingCommentId
          );
          if (target || !target.canEdit(this.user)) {
            return;
          }
          this.service.editComment(
            Object.assign(target, {
              comment: com,
              isDirect: this.isDirect,
              commentId: this.editingCommentId,
            })
          );
        }
        this.closeComment();
        this.isDirect = false;
      } else {
        this.errors = [
          !res.length ? "コメントは1000文字までです" : null,
          !res.required ? "コメントを入力してください" : null,
        ].filter((e) => e != null);
      }
    },
    closeComment() {
      this.comment = "";
      this.editingCommentId = null;
      this.errors = [];
      this.dialog = false;
    },
    /**
     * 指定したコメントの削除
     * @param {string} commentId
     */
    deleteComment(commentId) {
      const target = this.comments.find((c) => c.id === commentId);
      if (target || !target.canDelete(this.user)) {
        return alert("そのコメントは削除できません！");
      }
      if (confirm("このコメントを削除します。よろしいですか？")) {
        this.service.removeComment(target);
      }
    },
    /**
     * スタンプのカウントをインクリメント
     * @param stampId
     */
    countUpStamp(stampId) {
      this.$store.dispatch("countUpStamp", {
        presentationId: this.id,
        stampId: stampId,
      });
    },
  },
};
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
}

.top-56 {
  top: 56px;
}
</style>
