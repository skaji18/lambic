<template>
  <v-card class="pa-2">
    <v-card-text>
      <v-container>
        <v-row>
          <div>
            <div class="text-truncate">{{ event.title }}</div>
          </div>
          <v-spacer />
          <div>
            <span>{{ formatDate(event.date) }}</span>
          </div>
        </v-row>
        <v-row>
          <div>
            <p class="text-h4 text--primary">
              {{ presentation.title }}
            </p>
          </div>
          <v-spacer />
          <div>
            <v-menu v-if="canEdit" bottom left>
              <template #activator="{ on }">
                <v-btn icon class="mx-0 my-0" v-on="on">
                  <v-icon color="gray"> more_vert </v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="$emit('edit')">
                  <v-list-item-title>
                    <v-icon class="mr-1"> edit </v-icon>編集する
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="$emit('delete')">
                  <v-list-item-title>
                    <v-icon class="mr-1"> delete_forever </v-icon>削除する
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-row>
      </v-container>

      <p>{{ presenterName }}</p>
      <div class="text--primary">{{ presentation.description }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Presentation } from "@/models/Presentation";
import { Formatter } from "@/utils/Formatter";

export default {
  props: {
    presentation: {
      type: Presentation,
      required: true,
    },
  },
  computed: {
    event() {
      return this.presentation.event;
    },
    loginUser() {
      return (
        this.$store.getters.loginUser || {
          id: null,
          isAdmin: false,
        }
      );
    },
    canEdit() {
      return this.presentation.canEditBy(this.loginUser);
    },
    presenterName() {
      const presenter = this.presentation.getPresenter();
      return !presenter.isDeleted()
        ? `by ${presenter.name}`
        : "（発表者情報は削除されています）";
    },
  },
  methods: {
    formatDate(date) {
      return Formatter.formatDate(date);
    },
  },
};
</script>
