<template>
  <div>
    <div @click="showCommentDialog">
      <slot name="activator"></slot>
    </div>
    <comment-edit-dialog
      v-model="comment"
      :comment-id="commentId"
      @postComment:new="$emit('postComment:new', $event)"
      @postComment:update="$emit('postComment:update', $event)"
    >
      <template #activator>
        <button ref="commentEditDialogOpener" style="display: none" />
      </template>
    </comment-edit-dialog>
    <no-registered-dialog
      ref="noPostCommentDialogOpener"
      action-name="コメント"
    />
  </div>
</template>

<script>
import CommentEditDialog from "./CommentEditDialog";
import { NoRegisteredDialog } from "@/components/projects";

export default {
  components: {
    CommentEditDialog,
    NoRegisteredDialog,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    commentId: {
      type: String,
      default: null,
    },
    canPost: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    comment: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    showCommentDialog() {
      if (this.canPost) {
        this.$refs.commentEditDialogOpener.click();
      } else {
        this.$refs.noPostCommentDialogOpener.open();
      }
    },
  },
};
</script>
