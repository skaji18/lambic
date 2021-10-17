<template>
  <span v-if="canShow">
    <v-chip outlined label class="px-2" @click="$emit('countUp', stamp.id)">
      <v-avatar v-if="stamp.src" tile>
        <img :src="stamp.src" />
      </v-avatar>
      <v-avatar v-else class="black--text">
        {{ stamp.string }}
      </v-avatar>
      <span class="ml-1">
        {{ stampCount }}
      </span>
    </v-chip>
  </span>
</template>

<script>
import { Presentation } from "@/models/Presentation";
import { Stamp } from "@/models/Stamp";

export default {
  props: {
    presentation: {
      type: Presentation,
      required: true,
    },
    stamp: {
      type: Stamp,
      required: true,
    },
  },
  computed: {
    stampCount() {
      return this.presentation.getStampCount(this.stamp.id);
    },
    canShow() {
      return this.presentation.isEnabledStamp(this.stamp.id);
    },
  },
};
</script>
