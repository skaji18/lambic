<template>
  <v-row v-if="!isLoading" row wrap>
    <v-col>
      <v-card class="mb-2" color="light-green lighten-4">
        <v-card-subtitle class="pb-0">
          {{ formatDate(event.date) }}
        </v-card-subtitle>
        <v-card-title class="text-h5">
          {{ event.title }}
        </v-card-title>
        <v-card-text class="text-body-1">
          {{ event.description }}
        </v-card-text>
      </v-card>

      <v-card v-if="presentations.length !== 0">
        <base-list :items="presentations" @click="onClick">
          <template #default="{ item }">
            <v-list-item-title class="text-h6">
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-1">
              {{ item.getPresenter().name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-subtitle-2">
              {{ item.description }}
            </v-list-item-subtitle>
          </template>
        </base-list>
      </v-card>

      <v-card v-else>
        <v-card-text> まだ発表はありません。 </v-card-text>
      </v-card>

      <v-btn fixed fab bottom right color="green" @click="goAddPresentation">
        <v-icon>add</v-icon>
      </v-btn>
      <no-registered-dialog
        ref="notRegisteredDialogOpener"
        action-name="発表登録"
      />
    </v-col>
  </v-row>
  <v-progress-linear v-else indeterminate />
</template>

<script>
import { BaseList } from "@/components/uiParts";
import { NoRegisteredDialog } from "@/components/projects";
import { EventService } from "@/services/EventService";
import { Formatter } from "@/utils/Formatter";

export default {
  components: {
    BaseList,
    NoRegisteredDialog,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      event: null,
    };
  },
  computed: {
    presentations() {
      return this.event.presentations;
    },
    isLoading() {
      return !this.event;
    },
    user() {
      return this.$store.getters.loginUser;
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const useCase = new EventService();
      this.event = await useCase.get(this.id);
    },
    onClick(presentation) {
      this.$router.push(`/events/${this.id}/presentations/${presentation.id}`);
    },
    formatDate(date) {
      return Formatter.formatDate(date);
    },
    goAddPresentation() {
      if (!this.user) {
        this.$refs.notRegisteredDialogOpener.open();
        return;
      }
      this.$router.push(`/events/${this.id}/presentations/new`);
    },
  },
};
</script>
