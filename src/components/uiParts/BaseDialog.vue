<template>
  <v-dialog v-model="showDialog" :width="width" persistent>
    <template #activator="{ on }">
      <div v-on="on">
        <slot name="activator"></slot>
      </div>
    </template>

    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-alert :value="errorMessages.length > 0" outlined color="error">
          <ul>
            <li v-for="(err, i) in errorMessages" :key="i">
              {{ err }}
            </li>
          </ul>
        </v-alert>
        <slot></slot>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <slot name="action"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    errorMessages: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "500",
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    close() {
      this.showDialog = false;
    },
  },
};
</script>
