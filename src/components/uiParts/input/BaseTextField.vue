<template>
  <div class="base-text-field">
    <v-text-field
      :value="value"
      :label="label"
      outlined
      dense
      :required="required"
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
    required: {
      type: Boolean,
      default: false,
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
.base-text-field {
  width: 100%;
}
</style>
