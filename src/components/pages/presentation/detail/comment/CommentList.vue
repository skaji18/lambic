<template>
  <div>
    <v-card v-if="isAllowComment">
      <v-card-title>
        <h3>コメント一覧</h3>
      </v-card-title>
      <v-card-text v-if="comments.length === 0">
        <p>まだコメントはありません。</p>
      </v-card-text>
      <div
        v-for="comment in comments"
        v-else
        :key="comment.id"
        :class="{ yellow: comment.isDirect, 'lighten-4': comment.isDirect }"
      >
        <v-divider />
        <v-card-text class="py-2">
          <v-row v-if="comment.isDirect">
            <small class="grey--text">ダイレクトコメント</small>
          </v-row>
          <v-layout align-center mb-1>
            <v-avatar size="28" class="mr-1">
              <img
                v-if="comment.getCommenter().photoURL"
                :src="comment.getCommenter().photoURL"
              />
              <v-icon v-else size="28" color="gray"> account_circle </v-icon>
            </v-avatar>
            <strong class="text-truncate">
              {{ comment.getCommenter().name || "（削除されたユーザ）" }}
            </strong>
            <v-spacer />
            <span>{{ formatDateTime(comment.postedAt) }}</span>
            <v-menu v-if="showMenu(comment)" bottom left>
              <template #activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-if="comment.canEdit(loginUser)"
                  @click="$emit('edit', comment.id)"
                >
                  <v-list-item-title>編集</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item
                  v-if="comment.canDelete(loginUser)"
                  @click="$emit('delete', comment.id)"
                >
                  <v-list-item-title>削除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-layout>
          <p>{{ comment.comment }}</p>
        </v-card-text>
      </div>
    </v-card>
    <v-card v-else>
      <v-card-title>
        <div class="grey--text">この発表にはコメントできません。</div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import { Comment } from "@/models/Comment";
import { Formatter } from "@/utils/Formatter";

export default {
  props: {
    isAllowComment: {
      type: Boolean,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
      validator: (comments) => comments.every((c) => c instanceof Comment),
    },
  },
  computed: {
    loginUser() {
      return (
        this.$store.getters.loginUser || {
          id: null,
          isAdmin: false,
        }
      );
    },
  },
  methods: {
    formatDateTime(date) {
      return Formatter.formatDateTime(date);
    },
    /**
     * @param {Comment} comment
     * @returns {boolean}
     */
    showMenu(comment) {
      return (
        comment.canEdit(this.loginUser) || comment.canDelete(this.loginUser)
      );
    },
  },
};
</script>
