<template>
  <v-container>
    <v-layout wrap row>
      <v-row shrink>
        <v-checkbox
          :value="isDirect"
          hide-details
          color="primary"
          class="my-0 py-0"
        >
          <template #label>
            <span class="black--text"> ダイレクトコメントにする </span>
          </template>
        </v-checkbox>
        <v-tooltip right>
          <template #activator="{ on }">
            <v-icon color="primary" v-on="on"> help </v-icon>
          </template>
          <span
            ><strong>ダイレクトコメント</strong
            >：発表者と投稿者のみが閲覧できるコメント</span
          >
        </v-tooltip>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isDirect: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      },
    },
  },
};
</script>
