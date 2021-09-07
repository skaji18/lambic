<template>
  <v-layout row class="pb-5">
    <v-row v-if="!isLoading">
      <v-card>
        <v-card color="light-green">
          <v-card-title>
            <h1 class="headline white--text">イベント一覧</h1>
          </v-card-title>
        </v-card>

        <v-card>
          <v-list two-line>
            <template v-for="(event, index) in events" :key="event.id">
              <v-list-item :to="{ path: `/events/${event.id}` }" class="my-2">
                <v-list-item-title class="title">{{
                  event.title
                }}</v-list-item-title>
                <v-list-item-subtitle class="title">{{
                  event.description
                }}</v-list-item-subtitle>
                <div>
                  {{ formatDate(event.date) }}
                  <v-chip v-if="event.isFinished" size="small" light
                    >終了しました</v-chip
                  >
                  <v-chip
                    v-else-if="event.isToday"
                    size="small"
                    color="green"
                    text-color="white"
                    >本日開催</v-chip
                  >
                </div>
              </v-list-item>
              <v-divider v-if="showDivider(index)" class="mx-2"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-card>
    </v-row>
    <v-progress-linear v-else :indeterminate="isLoading"></v-progress-linear>
  </v-layout>
</template>
<script>
import moment from "moment";
import { EventService } from "@/services/EventService";

export default {
  data() {
    return {
      events: [],
    };
  },
  computed: {
    isLoading() {
      return this.events.length === 0;
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const nowDate = new Date();
      const service = new EventService();
      const events = await service.getAll();
      this.events = events.map((ev) => {
        return {
          ...ev,
          isFinished: ev.isFinished(nowDate),
          isToday: ev.isToday(nowDate),
        };
      });
    },
    showDivider(index) {
      return index < this.events.length - 1;
    },
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD（ddd）");
    },
  },
};
</script>
