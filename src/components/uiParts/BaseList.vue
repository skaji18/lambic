<template>
  <v-list two-line>
    <template v-for="(item, index) in items">
      <div :key="item.id">
        <v-list-item @click="$emit('click', item)">
          <v-list-item-content>
            <slot :item="item" />
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="showDivider(index)" class="ma-2" />
      </div>
    </template>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    showDivider(index) {
      return index < this.items.length - 1;
    },
  },
};
</script>
