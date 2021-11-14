<template>
  <v-card class="pa-2">
    <v-card-text>
      <v-container>
        <v-row>
          <div class="text-truncate">
            {{ screen.name || "（スクリーン名未設定）" }}
          </div>
        </v-row>
        <v-row>
          <div>
            <p class="text-h4 text--primary">スクリーン管理</p>
          </div>
        </v-row>
        <v-row>
          <event-selection
            :selected-event="selectedEvent"
            :events="events"
            label="イベントを選択してください"
            @selectEvent="$emit('selectEvent', $event)"
          />
        </v-row>
        <v-row>
          <v-card-title class="pa-0">
            <div>
              <strong>表示中の発表：</strong>
            </div>
            <template v-if="presentation">
              <v-breadcrumbs :items="breadcrumbs" divider=">" />
            </template>
            <template v-else>
              <div>なし</div>
            </template>
          </v-card-title>
        </v-row>
        <v-row>
          <v-btn small color="grey lighten-1" @click="$emit('resetDisplay')">
            表示を停止する
          </v-btn>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { Event } from "@/models/Event";
import { Screen } from "@/models/Screen";
import EventSelection from "./EventSelection.vue";

export default {
  components: {
    EventSelection,
  },
  props: {
    screen: {
      type: Screen,
      required: true,
    },
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
    presentation() {
      return this.screen?.getPresentation();
    },
    breadcrumbs() {
      return [
        {
          text: this.selectedEvent?.title,
          disabled: true,
        },
        { text: this.presentation?.title, disabled: true },
        { text: this.presentation?.getPresenter()?.name, disabled: true },
      ];
    },
  },
};
</script>
