<template>
  <v-row row>
    <v-col v-if="screens !== null">
      <v-card>
        <v-card color="light-green">
          <v-card-title>
            <h1 class="headline white--text">スクリーン管理</h1>
          </v-card-title>
        </v-card>
      </v-card>

      <v-card v-if="screens">
        <base-list :items="screens" @click="onClick">
          <template #default="{ item }">
            <v-list-item-title class="text-h6">
              {{ item.name || "（スクリーン名未設定）" }}
            </v-list-item-title>
          </template>
        </base-list>
      </v-card>

      <v-card v-else>
        <v-card-title>
          <div>スクリーンが登録されていません。</div>
        </v-card-title>
      </v-card>
    </v-col>
    <v-progress-linear v-else indeterminate />
  </v-row>
</template>

<script>
import { ScreenService } from "@/services/ScreenService";
import BaseList from "@/components/uiParts/BaseList";

export default {
  components: {
    BaseList,
  },
  data() {
    return {
      service: new ScreenService(),
      screens: null,
    };
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.screens = await this.service.getAll();
    },
    onClick(screen) {
      this.$router.push(`/screens/${screen.id}`);
    },
  },
};
</script>
