<template>
  <div class="base-text-area">
    <v-textarea
      :value="value"
      :label="label"
      outlined
      dense
      :counter="maxLength"
      :rules="rules"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    maxLength: {
      type: Number,
      default: null,
    },
    rules: {
      type: Array,
      default: () => [],
      validator: (rules) => rules.every((r) => r instanceof Function),
    },
  },
};
</script>

<style scoped>
.base-text-area {
  width: 100%;
}
</style>
