<template>
  <base-text-field
    label="タイトル"
    :value="value"
    required
    :rules="rules"
    @input="$emit('input', $event)"
  />
</template>

<script>
import { BaseTextField } from "@/components/uiParts";

export default {
  components: {
    BaseTextField,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    requiredRule() {
      return (v) => !!v || "タイトルは必須です。";
    },
    maxLengthRule() {
      const maxLength = 50;
      return (v) =>
        v.length <= maxLength ||
        `タイトルは${maxLength}文字以内にしてください。`;
    },
    rules() {
      return [this.requiredRule, this.maxLengthRule];
    },
  },
};
</script>
