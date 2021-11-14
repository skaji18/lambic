<template>
  <v-row>
    <v-col v-if="screen !== null">
      <admin-screen-setting-content
        :screen="screen"
        :events="events"
        :selected-event="selectedEvent"
        @selectEvent="setEvent"
        @resetDisplay="initializeScreen"
      />

      <v-card v-if="selectedEvent">
        <base-list
          :items="selectedEvent.presentations"
          @click="selectPresentation"
        >
          <template #default="{ item }">
            <div style="display: flex">
              <div class="mr-3">
                <v-avatar>
                  <v-icon
                    v-if="isActivePresentation(item)"
                    x-large
                    color="orange lighten-1"
                  >
                    cast_connected
                  </v-icon>
                  <v-icon v-else x-large color="grey lighten-1"> cast </v-icon>
                </v-avatar>
              </div>
              <div>
                <v-list-item-title class="text-h6">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2">
                  by {{ item.getPresenter().name }}
                </v-list-item-subtitle>
              </div>
            </div>
          </template>
        </base-list>
        <v-list two-line>
          <template v-if="selectedEvent.presentations.length === 0">
            <v-card-text> まだ発表はありません。 </v-card-text>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ScreenService, EventService } from "@/services";
import { BaseList } from "@/components/uiParts";
import { AdminScreenSettingContent } from "./setting";

export default {
  components: {
    BaseList,
    AdminScreenSettingContent,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      service: new ScreenService(),
      eventService: new EventService(),
      screen: null,
      events: [],
      selectedEvent: null,
    };
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.screen = await this.service.get(this.id);
      this.events = await this.eventService.getAll();
    },
    async setEvent(event) {
      this.selectedEvent = await this.eventService.get(event.id);
    },
    async selectPresentation(targetPresentation) {
      const msg = `スクリーンの表示を「${targetPresentation.title}」の情報に変更します。\nよろしいですか？`;
      if (confirm(msg)) {
        await this.service.edit(
          Object.assign(this.screen, {
            presentation: targetPresentation,
          })
        );
      }
    },
    isActivePresentation(presentation) {
      return presentation.id === this.screen.getPresentation()?.id;
    },
    getEventTitle(eventId) {
      const targetEvent = this.events.filter((e) => e.id === eventId);
      return targetEvent?.title || "";
    },
    async initializeScreen() {
      if (confirm("スクリーンの表示をリセットします。よろしいですか？")) {
        await this.service.edit(
          Object.assign(this.screen, {
            presentation: null,
          })
        );
      }
    },
  },
};
</script>
