<template>
  <v-layout class="pb-5">
    <v-flex>

      <v-card class="mb-2 pb-2">
        <v-card-title primary-title>
          <div>
            <div class="grey--text text-subtitle-2 mb-3">{{ screen.name || "（スクリーン名未設定）" }}</div>
            <div class="text-h5">スクリーンの管理</div>
          </div>
        </v-card-title>

        <v-container grid-list-md class="py-0">
          <v-layout wrap>
            <v-flex xs12 sm8>
              <v-select
                :items="events"
                name="event"
                item-text="title"
                item-value="id"
                outlined
                dense
                label="イベントを選択してください"
                @change="setEventsPresentations"
              />
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 sm9 xl11>
              <v-row class="pl-3">
                <div>
                  <strong>表示中の発表：</strong>
                </div>
                <template v-if="screen.displayPresentationRef">
                  <div class="text-truncate">
                    {{ getEventTitle(displayPresentationRef.eventId) }}
                  </div>
                  <div v-if="screen.displayPresentationRef" class="text-truncate">
                    &nbsp;>&nbsp;{{ displayPresentationRef.title }}
                  </div>
                  <div v-if="displayPresentationRef.presenter" class="text-truncate">
                    &nbsp;（{{ displayPresentationRef.presenter.name }}）
                  </div>
                </template>
                <template v-else>
                  <div>
                    なし
                  </div>
                </template>
              </v-row>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12>
              <v-card-actions class="px-0">
                <v-btn small color="grey lighten-1" @click="initializeScreen()">
                  表示を停止する
                </v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

      <v-card v-if="selectedEvent">
        <v-list two-line>

          <template v-for="(presentation, index) in selectedEvent.presentations">
            <v-list-item
              v-if="presentation.id"
              @click="selectPresentation(presentation)"
              :key="presentation.id + '_list'"
              class="my-2">
              <v-list-item-avatar :key="presentation.id + '_avatar'">
                <v-icon v-if="displayPresentationRef && presentation.id === displayPresentationRef.id"
                  x-large
                  color="orange lighten-1">
                  cast_connected
                </v-icon>
                <v-icon v-else
                  x-large
                  color="grey lighten-1">
                  cast
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title :key="presentation.id + '_title'">
                  {{ presentation.title }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="presentation.presenter" :key="presentation.id + '_subtitle'">
                  by {{ presentation.presenter.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              v-if="index+1 < selectedEvent.presentations.length"
              :key="presentation.id + '_divider'"
              class="mx-2 my-2"
            >
            </v-divider>
          </template>

          <template v-if="selectedEvent.presentations.length === 0">
            <v-card-text>
              まだ発表はありません。
            </v-card-text>
          </template>

        </v-list>
      </v-card>

      <v-btn
        fixed
        fab
        bottom
        left
        color="green"
        :to="{ path: '/screens' }"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selectedEvent: null
    }
  },
  computed: {
    /*
     * スクリーン情報取得
     */
    screen () {
      return this.$store.getters.screen(this.id)
    },
    /*
     * イベント情報取得
     */
    events () {
      return this.$store.getters.events
    },
    displayPresentationRef () {
      if (!this.screen) {
        return {}
      }
      return this.screen.displayPresentationRef || {}
    }
  },
  methods: {
    /*
     * プレゼンを表示するイベントをセットする
     */
    setEventsPresentations (eventId) {
      if (!eventId) {
        this.selectedEvent = {}
      } else {
        this.selectedEvent = this.$store.getters.event(eventId)
      }
    },
    /*
     * スクリーンに表示するプレゼンをセット
     */
    selectPresentation (targetPresentation) {
      const msg = 'スクリーンの表示を「' +
        targetPresentation.title +
        '」の情報に変更します。\n' +
        'よろしいですか？'
      if (confirm(msg)) {
        this.$store.dispatch('updateScreenPresentation', {
          screenId: this.id,
          presentationId: targetPresentation.id
        })
      }
    },
    /*
     * イベント名を取得
     */
    getEventTitle (eventId) {
      const targetEvent = this.$store.getters.event(eventId)
      if (targetEvent) {
        return targetEvent.title
      } else {
        return ''
      }
    },
    /*
     * スクリーンを初期化する
     */
    initializeScreen () {
      if (confirm('スクリーンの表示をリセットします。よろしいですか？')) {
        this.$store.dispatch('unsetScreenPresentation', this.id)
      }
    }
  }
}
</script>
