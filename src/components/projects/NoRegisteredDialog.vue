<template>
  <base-dialog ref="dialog" :title="title">
    <template #activator>
      <button ref="opener" style="display: none" />
    </template>
    <template>
      <p>{{ content }}</p>
    </template>
    <template #action>
      <v-btn text @click="close"> キャンセル </v-btn>
      <v-btn color="light-green" :to="{ path: '/login' }"> ログイン </v-btn>
    </template>
  </base-dialog>
</template>

<script>
import { BaseDialog } from "@/components/uiParts";

export default {
  components: {
    BaseDialog,
  },
  props: {
    actionName: {
      type: String,
      default: "",
    },
  },
  computed: {
    title() {
      return this.actionName
        ? `${this.actionName}にはログインが必要です`
        : "ログインが必要です";
    },
    content() {
      return this.actionName
        ? `ログインして${this.actionName}しましょう。`
        : "";
    },
  },
  methods: {
    open() {
      this.$refs.opener.click();
    },
    close() {
      this.$refs.dialog.close();
    },
  },
};
</script>

<style scoped></style>
