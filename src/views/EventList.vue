<template>
  <v-layout>
    <v-flex v-if="events.length !== 0">
      <v-card>

        <v-card color="light-green">
          <v-card-title>
            <h1 class="text-h5 white--text">イベント一覧</h1>
          </v-card-title>
        </v-card>

        <v-card>
          <v-list two-line>
            <template v-for="(event, index) in events">

                <v-list-item :key="event.title" :to="{ path: 'events/' + event.id }" class="my-2">
                  <v-list-item-content>
                    <div>
                      {{ event.date | toDateString }}
                      <v-chip v-if="event.isFinished" small light>終了しました</v-chip>
                      <v-chip v-else-if="event.isToday" small color="green" text-color="white">本日開催</v-chip>
                    </div>
                    <v-list-item-title class="text-h6">
                      {{ event.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ event.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="index + 1 < events.length" :key="event.id" class="mx-2"></v-divider>
            </template>
          </v-list>
        </v-card>

      </v-card>
    </v-flex>
    <v-progress-linear v-else indeterminate />
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  computed: {
    /*
     * イベント一覧取得
     */
    events () {
      const nowDate = new Date()
      return this.$store.getters.events
        .map((ev) => {
          return {
            ...ev,
            isFinished: moment(ev.date).isBefore(nowDate, 'day'),
            isToday: moment(ev.date).isSame(nowDate, 'day')
          }
        })
    }
  },
  filters: {
    toDateString (date) {
      return moment(date).format('YYYY/MM/DD（ddd）')
    }
  }
}
</script>
