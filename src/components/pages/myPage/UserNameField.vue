<template>
  <base-text-field
    :value="value"
    label="ユーザ名を入力してください"
    required
    :rules="rules"
    @input="$emit('input', $event)"
  />
</template>

<script>
import { BaseTextField } from "@/components/uiParts/input";

export default {
  components: { BaseTextField },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    requiredRule() {
      return (v) => !!v || "ユーザ名は必須です。";
    },
    maxLengthRule() {
      const maxLength = 50;
      return (v) =>
        v.length <= maxLength ||
        `ユーザ名は${maxLength}文字以内にしてください。`;
    },
    rules() {
      return [this.requiredRule, this.maxLengthRule];
    },
  },
};
</script>
