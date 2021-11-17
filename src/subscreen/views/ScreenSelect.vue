<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>Select Screen</v-toolbar-title>
    </v-toolbar>
    <v-progress-linear v-if="isLoading" indeterminate />
    <v-content v-else>
      <v-container fluid>
        <v-layout row>
          <v-flex v-if="screens.length === 0" class="display-1">
            会場がありません。
          </v-flex>
          <v-flex v-else>
            <v-list>
              <v-list-item
                v-for="screen in screens"
                :key="screen.id"
                :to="{ path: screen.id }"
              >
                <v-list-item-title class="title">
                  {{ screen.name || "（名称未設定の会場）" }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { firestore } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";

export default {
  name: "SelectSubscreen",
  data() {
    return {
      isLoading: true,
      screens: [],
    };
  },
  async created() {
    const screens = await getDocs(query(collection(firestore, "screens")));
    for (const screen in screens.docs()) {
      this.screens.push({
        id: screen.id,
        ...screen.data(),
      });
    }
    this.isLoading = false;
  },
};
</script>
