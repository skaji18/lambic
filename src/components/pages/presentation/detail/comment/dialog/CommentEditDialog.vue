<template>
  <base-dialog ref="dialog" :title="title" :error-messages="errors">
    <template #activator>
      <slot name="activator"></slot>
    </template>
    <template>
      <v-textarea v-model="comment" outline autofocus no-resize />
      <direct-comment-chooser v-if="isNew" v-model="isDirect" />
    </template>
    <template #action>
      <v-btn text @click="close"> cancel </v-btn>
      <v-btn color="primary" @click="post"> submit </v-btn>
    </template>
  </base-dialog>
</template>

<script>
import BaseDialog from "@/components/uiParts/BaseDialog";
import DirectCommentChooser from "./DirectCommentChooser";
import { PresentationService } from "@/services/PresentationService";

export default {
  components: {
    BaseDialog,
    DirectCommentChooser,
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
  },
  data() {
    return {
      service: new PresentationService(),
      isDirect: false,
      errors: [],
    };
  },
  computed: {
    isNew() {
      return this.commentId === null;
    },
    title() {
      return this.isNew ? "コメント投稿" : "コメント編集";
    },
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
    validate(c) {
      return {
        length: c.length <= 1000,
        required: c.replace(/\s+$/gm, "").length > 0,
      };
    },
    post() {
      // eslint-disable-next-line no-irregular-whitespace
      const rtrimRegex = /[ \t\f　]+$/gm;
      const comment = this.comment.replace(rtrimRegex, "");
      const res = this.validate(comment);
      if (!Object.values(res).every((v) => v)) {
        this.errors = [
          !res.length ? "コメントは1000文字までです" : null,
          !res.required ? "コメントを入力してください" : null,
        ].filter((e) => e != null);
        return;
      }
      if (this.isNew) {
        this.$emit("postComment:new", {
          comment,
          isDirect: this.isDirect,
        });
      } else {
        this.$emit("postComment:update", {
          comment,
          commentId: this.commentId,
        });
      }
      this.$refs["dialog"].close();
    },
    close() {
      this.$refs["dialog"].close();
      this.comment = "";
      this.isDirect = false;
      this.errors = [];
    },
  },
};
</script>
