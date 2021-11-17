<template>
  <div class="base-select">
    <v-select
      :value="value"
      :items="items"
      :label="label"
      @change="$emit('input', $event)"
    />
  </div>
</template>

<script lang="ts">
import { SelectItem } from "./InputDefine";

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
    items: {
      type: Array,
      default: () => [],
      validator: (items) => items.every((i) => i instanceof SelectItem),
    },
  },
};
</script>
