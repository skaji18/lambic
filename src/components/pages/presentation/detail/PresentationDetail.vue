<template>
  <v-row row class="pb-5">
    <v-col v-if="presentation != null">
      <presentation-content
        :presentation="presentation"
        @edit="editPresentation"
        @delete="deletePresentation"
      />

      <v-card class="pa-3 mb-2 sticky-top top-56">
        <stamp-count
          v-for="stamp in presentation.stamps"
          :key="stamp.id"
          :presentation="presentation"
          :stamp="stamp"
          class="mx-1"
          @countUp="countUpStamp"
        />
      </v-card>

      <comment-list
        :is-allow-comment="presentation.isAllowComment"
        :comments="comments"
        @edit="openModifyComment"
        @delete="deleteComment"
      />

      <v-btn fixed fab bottom right color="green" @click="openNewComment">
        <v-icon>create</v-icon>
      </v-btn>

      <comment-dialog
        v-if="presentation.isAllowComment"
        v-model="comment"
        :comment-id="editingCommentId"
        :can-post="!!user.id"
        @postComment:new="addComment"
        @postComment:update="updateComment"
      >
        <template #activator>
          <button ref="commentDialogOpener" style="display: none" />
        </template>
      </comment-dialog>
    </v-col>
    <v-progress-linear v-else indeterminate />
  </v-row>
</template>

<script>
import { CommentDialog, CommentList } from "./comment";
import PresentationContent from "./PresentationContent";
import StampCount from "./StampCount";
import {
  PresentationService,
  PresentationRegisterServiceImpl,
} from "@/services";

export default {
  components: {
    CommentList,
    CommentDialog,
    PresentationContent,
    StampCount,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      service: new PresentationService(),
      registerService: new PresentationRegisterServiceImpl(),
      unsubscribe: null,
      presentation: null,
      editingCommentId: null,
      comment: "",
    };
  },
  computed: {
    comments() {
      return (
        this.presentation?.comments?.filter((cm) => cm.canShowBy(this.user)) ||
        []
      );
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
  async created() {
    await this.init();
  },
  beforeDestroy() {
    this.unsubscribe || this.unsubscribe();
  },
  methods: {
    async init() {
      this.unsubscribe = (await this.service.observe(this.id)).subscribe(
        (pr) => (this.presentation = pr)
      );
    },
    editPresentation() {
      this.$router.push(
        `/events/${this.presentation.eventId}/presentations/${this.id}/edit`
      );
    },
    deletePresentation() {
      if (confirm("この発表を削除します。よろしいですか？")) {
        this.registerService.delete(this.presentation);
        this.$router.push(`/events/${this.presentation.eventId}`);
      }
    },
    getComment(commentId) {
      return this.comments.find((c) => c.id === commentId);
    },
    openNewComment() {
      this.editingCommentId = null;
      this.comment = "";
      this.$refs.commentDialogOpener.click();
    },
    /**
     * 指定したコメントの編集モーダルを開く
     * @param {string} commentId
     */
    openModifyComment(commentId) {
      const target = this.getComment(commentId);
      if (!target?.canEdit(this.user)) {
        alert("そのコメントは編集できません！");
        return;
      }
      this.editingCommentId = commentId;
      this.comment = target.comment;
      this.$refs.commentDialogOpener.click();
    },
    /**
     * 指定したコメントの削除
     * @param {string} commentId
     */
    deleteComment(commentId) {
      const target = this.getComment(commentId);
      if (!target?.canDelete(this.user)) {
        alert("そのコメントは削除できません！");
        return;
      }
      if (confirm("このコメントを削除します。よろしいですか？")) {
        this.service.removeComment(target);
      }
    },
    addComment({ comment, isDirect }) {
      this.service.appendComment({
        comment,
        isDirect,
        presentationId: this.id,
        user: this.user,
      });
    },
    updateComment({ comment, commentId }) {
      const target = this.getComment(commentId);
      this.service.editComment(
        Object.assign(target, {
          comment,
        })
      );
    },
    /**
     * スタンプのカウントをインクリメント
     * @param stampId
     */
    countUpStamp(stampId) {
      const stampCount = this.presentation.stampCounts.find(
        (s) => s.stampId === stampId && s.presentationId === this.id
      );
      this.service.countUp(stampCount);
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
