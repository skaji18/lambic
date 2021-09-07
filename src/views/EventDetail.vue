<template>
  <v-layout v-if="!isLoading" row wrap class="pb-5">
    <v-row>
      <v-card class="mb-2" color="light-green lighten-4">
        <v-card-title primary-title>
          <div>
            <div class="grey--text mb-3">{{ formatDate(event.date) }}</div>
            <div class="headline">{{ event.title }}</div>
          </div>
        </v-card-title>
        <v-card-text>
          {{ event.description }}
        </v-card-text>
      </v-card>

      <v-card v-if="presentations.length !== 0">
        <v-list two-line>
          <template
            v-for="(presentation, index) in presentations"
            :key="presentation.id"
          >
            <v-list-item :to="{ path: '/presentations/' + presentation.id }">
              <v-list-item-title class="title">
                {{ presentation.title }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="presentation.presenter">
                by {{ presentation.presenter.name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ presentation.description }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider
              v-if="showDivider(index)"
              :key="presentation.id + '_divider'"
              class="mx-2 my-2"
            >
            </v-divider>
          </template>
        </v-list>
      </v-card>

      <v-card v-else>
        <v-card-text> まだ発表はありません。 </v-card-text>
      </v-card>

      <v-btn
        color="green"
        block
        size="large"
        class="my-2 white--text"
        @click="goAddPresentation"
      >
        <v-icon color="white">add</v-icon>
        発表を申し込む
      </v-btn>

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-text class="text-xs-center">
            <p class="title mt-3">発表登録にはログインが必要です。</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="light-green" :to="{ path: '/login' }">
              ログインする
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-xs-center">
            <p>ログインして発表を申し込みましょう。</p>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-btn fixed fab bottom left color="green" :to="{ path: '/events' }">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-row>
  </v-layout>
  <v-progress-linear v-else indeterminate />
</template>

<script>
import moment from "moment";
import { EventService } from "@/services/EventService";

export default {
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
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const useCase = new EventService();
      this.event = await useCase.get(this.id);
    },
    showDivider(index) {
      return index < this.presentations.length - 1;
    },
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD（ddd）");
    },
    goAddPresentation() {
      if (!this.$store.getters.loginUser) {
        this.dialog = true;
        return;
      }
      this.$router.push({
        path: `/${this.id}/draftPresentations/new`,
      });
    },
  },
};
</script>
