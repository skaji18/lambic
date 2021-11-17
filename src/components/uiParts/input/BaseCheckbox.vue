<template>
  <div class="base-checkbox">
    <v-checkbox
      :input-value="value"
      hide-details
      color="green"
      dense
      @change="$emit('input', $event)"
    >
      <template #label>
        <span class="black--text">
          {{ label }}
        </span>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
};
</script>
