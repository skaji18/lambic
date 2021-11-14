<template>
  <base-select
    v-model="value"
    :items="items"
    label="イベントを選択してください"
  />
</template>

<script>
import { Event } from "@/models/Event";
import { BaseSelect, SelectItem } from "@/components/uiParts";

export default {
  components: {
    BaseSelect,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
      validator: (events) => events.every((e) => e instanceof Event),
    },
    selectedEvent: {
      type: Event,
      default: null,
    },
  },
  computed: {
    items() {
      return this.events.map((e) => new SelectItem(e.title, e.id));
    },
    value: {
      get() {
        return this.selectedEvent?.id;
      },
      set(value) {
        const targetEvent = this.events.find((e) => e.id === value);
        this.$emit("selectEvent", targetEvent);
      },
    },
  },
};
</script>
