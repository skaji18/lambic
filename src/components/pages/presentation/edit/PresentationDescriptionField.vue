<template>
  <base-text-area
    :value="value"
    label="内容"
    :counter="maxLength"
    :rules="rules"
    @input="$emit('input', $event)"
  />
</template>

<script>
import { BaseTextArea } from "@/components/uiParts";

export default {
  components: {
    BaseTextArea,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    maxLength() {
      return 500;
    },
    maxLengthRule() {
      return (v) =>
        v.length <= this.maxLength ||
        `内容は${this.maxLength}文字以内にしてください。`;
    },
    rules() {
      return [this.maxLengthRule];
    },
  },
};
</script>

<style scoped></style>
