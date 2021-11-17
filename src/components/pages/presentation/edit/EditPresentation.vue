<template>
  <v-row row class="pb-5">
    <v-col v-if="presentation != null">
      <v-card class="pa-2">
        <v-card-text>
          <v-container>
            <v-row class="mb-1">
              <div>
                <div class="text-truncate">{{ event.title }}</div>
              </div>
              <v-spacer />
              <div>
                <span>{{ formatDate(event.date) }}</span>
              </div>
            </v-row>

            <v-row class="mb-1">
              <div>
                <p class="text-h5 text--primary">発表登録</p>
              </div>
            </v-row>

            <v-row>
              <v-form ref="form" v-model="valid" style="width: 100%">
                <presentation-title-field v-model="presentation.title" />
                <presentation-description-field
                  v-model="presentation.description"
                />

                <base-checkbox
                  v-model="presentation.isAllowComment"
                  label="発表へのコメント投稿を許可する。"
                />
                <base-checkbox
                  v-model="checkConfidential"
                  label="上記登録内容に、社外へ公開不可な情報は含まれていません。"
                />
              </v-form>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>

      <v-btn
        :disabled="!canSubmit"
        color="orange"
        block
        large
        class="my-2 white--text"
        @click="submit"
      >
        登録内容を確定する
      </v-btn>
    </v-col>
    <v-progress-linear v-else indeterminate />
  </v-row>
</template>

<script>
import { Formatter } from "@/utils/Formatter";
import { Presentation } from "@/models/Presentation";
import {
  EventService,
  PresentationService,
  PresentationRegisterServiceImpl,
} from "@/services";
import { BaseCheckbox } from "@/components/uiParts";
import PresentationDescriptionField from "./PresentationDescriptionField.vue";
import PresentationTitleField from "./PresentationTitleField.vue";

export default {
  components: {
    BaseCheckbox,
    PresentationDescriptionField,
    PresentationTitleField,
  },
  props: {
    eventId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      eventService: new EventService(), // FIXME: vue側で呼び分けるのではなく、ロジック内で処理する
      service: new PresentationService(),
      registerService: new PresentationRegisterServiceImpl(),
      presentation: null,
      valid: false,
      checkConfidential: false, // 社外秘チェック
    };
  },
  computed: {
    event() {
      return this.presentation?.event;
    },
    user() {
      return this.$store.getters.loginUser;
    },
    isNew() {
      return !this.id;
    },
    canSubmit() {
      return this.checkConfidential && this.valid;
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      let presentation = null;
      if (this.isNew) {
        presentation = Presentation.create({});
        presentation.event = await this.eventService.get(this.eventId);
        presentation.eventId = presentation.event.id;
      } else {
        presentation = await this.service.get(this.id);
      }
      this.presentation = presentation;
    },
    formatDate(date) {
      return Formatter.formatDate(date);
    },
    async submit() {
      // Note: チェックボックスOFF時の値が null なので、boolean値に丸める
      this.presentation.isAllowComment = !!this.presentation.isAllowComment;
      if (this.isNew) {
        this.presentation.setPresenter(this.user);
        await this.registerService.append(this.presentation);
        await this.$router.push(`/events/${this.eventId}`);
      } else {
        await this.registerService.edit(this.presentation);
        await this.$router.push(
          `/events/${this.eventId}/presentations/${this.id}`
        );
      }
    },
  },
};
</script>
