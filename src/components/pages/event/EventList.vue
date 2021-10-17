<template>
  <v-row row>
    <v-col v-if="!isLoading">
      <v-card>
        <v-card color="light-green">
          <v-card-title>
            <h1 class="headline white--text">イベント一覧</h1>
          </v-card-title>
        </v-card>

        <v-card>
          <base-list :items="events" @click="onClick">
            <template #default="{ item }">
              <div class="text-body-2">
                {{ formatDate(item.date) }}
                <v-chip v-if="item.isFinished" small light>
                  終了しました
                </v-chip>
                <v-chip
                  v-else-if="item.isToday"
                  small
                  color="green"
                  text-color="white"
                >
                  本日開催
                </v-chip>
              </div>
              <v-list-item-title class="text-h6">
                {{ item.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-subtitle-2">
                {{ item.description }}
              </v-list-item-subtitle>
            </template>
          </base-list>
        </v-card>
      </v-card>
    </v-col>
    <v-progress-linear v-else indeterminate />
  </v-row>
</template>
<script>
import BaseList from "@/components/uiParts/BaseList";
import { EventService } from "@/services/EventService";
import { Formatter } from "@/utils/Formatter";

export default {
  components: {
    BaseList,
  },
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
    onClick(event) {
      this.$router.push(`/events/${event.id}`);
    },
    formatDate(date) {
      return Formatter.formatDate(date);
    },
  },
};
</script>
