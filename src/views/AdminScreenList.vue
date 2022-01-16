<template>
  <v-layout class="pb-5">
    <v-flex>
      <v-card>
        <v-card-title>
          <div>
            <h3 class="text-h5 mb-0">スクリーン管理</h3>
          </div>
        </v-card-title>
      </v-card>

      <v-card v-if="screens">
        <v-list>

          <template v-for="(screen, index) in screens">
            <v-list-item
              :to="{ path: 'screens/' + screen.id }"
              :key="screen.id + '_list'">
              <v-list-item-title class="text-h6 ml-2" :key="screen.id + '_title'">
                <template v-if="screen.name">
                  {{ screen.name }}
                </template>
                <template v-else>
                  （スクリーン名未設定）
                </template>
              </v-list-item-title>
            </v-list-item>
            <v-divider
              v-if="index+1 < screens.length"
              :key="screen.id + '_divider'"
              class="mx-2 my-2">
            </v-divider>
          </template>

        </v-list>
      </v-card>

      <v-card v-else>
        <v-card-title>
          <div>
            スクリーンが登録されていません。
          </div>
        </v-card-title>
      </v-card>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    screens () {
      return this.$store.getters.screens
    }
  }
}
</script>
