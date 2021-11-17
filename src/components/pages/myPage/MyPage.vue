<template>
  <v-row row wrap>
    <v-col v-if="!isLoading">
      <v-card class="pa-2">
        <v-card-title class="text-h5">アカウント情報</v-card-title>
        <v-card-text>
          <v-container>
            <user-name-field v-model="user.name" />
          </v-container>
        </v-card-text>
      </v-card>
      <v-btn
        color="orange"
        block
        large
        class="my-2 white--text"
        @click="updateUserInfo"
      >
        更新する
      </v-btn>
      <v-snackbar v-model="snackbar" :bottom="true" color="green">
        更新しました。
      </v-snackbar>
    </v-col>
    <v-progress-linear v-else indeterminate />
  </v-row>
</template>

<script>
import UserNameField from "./UserNameField.vue";
import { UserService } from "@/services";
import { User } from "@/models/User";

export default {
  components: { UserNameField },
  data() {
    return {
      user: null,
      service: new UserService(),
      snackbar: false,
    };
  },
  computed: {
    isLoading() {
      return this.user === null;
    },
  },
  created() {
    this.user = new User(this.$store.getters.loginUser);
  },
  methods: {
    async updateUserInfo() {
      await this.service.edit(this.user);
      this.snackbar = true;
    },
  },
};
</script>
