<template>
  <v-layout row class="pb-5">
    <v-flex>
      <v-card>
        <v-card-title>
          <div>
            <h3 class="headline mb-0">スクリーン管理</h3>
          </div>
        </v-card-title>
      </v-card>

      <v-card v-if="screens">
        <v-list>
          <template v-for="(screen, index) in screens">
            <v-list-item
              :key="screen.id + '_list'"
              :to="{ path: 'screens/' + screen.id }"
            >
              <v-list-item-title class="title ml-2">
                <template v-if="screen.name">
                  {{ screen.name }}
                </template>
                <template v-else> （スクリーン名未設定） </template>
              </v-list-item-title>
            </v-list-item>
            <v-divider
              v-if="index + 1 < screens.length"
              :key="screen.id + '_divider'"
              class="mx-2 my-2"
            />
          </template>
        </v-list>
      </v-card>

      <v-card v-else>
        <v-card-title>
          <div>スクリーンが登録されていません。</div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: "AdminScreenList",
  computed: {
    screens() {
      return this.$store.getters.screens;
    },
  },
};
</script>
