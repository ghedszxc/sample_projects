<template>
  <BaseGCard :loading="isLoading" :elevation="elevation">
    <v-row no-gutters>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-data-iterator
              :items="items"
              :items-per-page="itemPerPage"
              :search="search"
            >
              <template v-slot:header>
                <slot v-if="$slots.customHeader" name="customHeader" />
                <v-row v-else no-gutters class="pa-4" justify="space-between">
                  <v-col cols="12" md="4">
                    <v-row align="center">
                      <v-col
                        v-if="$vuetify.display.mdAndDown && tableName"
                        cols="12"
                        md="1"
                      >
                        <span class="font-weight-bold text-h6 text-truncate">
                          {{ tableName }}
                        </span>
                      </v-col>

                      <v-col cols="12" md="12" class="d-flex">
                        <span
                          v-if="$vuetify.display.lgAndUp && tableName"
                          class="font-weight-bold text-h6 mr-6 pt-1 text-truncate"
                        >
                          {{ tableName }}
                        </span>
                        <BaseSearch v-if="searchDisplay ?? true">
                          @on-search="emit('onSearch', $event)"
                          @on-clear-search="emit('onClear')" ></BaseSearch
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                  <slot name="headerActions" />
                </v-row>
                <v-divider v-if="$vuetify.display.smAndUp"></v-divider>
                <v-list-item class="title-header pt-4">
                  <v-list-item-title>
                    <v-row no-gutters class="pb-4" align-content="center">
                      <template v-for="(col, idx) in headers">
                        <v-col
                          :key="idx"
                          cols="12"
                          v-if="col.visible"
                          :sm="col.sm"
                          :md="col.md"
                          :lg="col.lg"
                          class="text-capitalize white--text text"
                        >
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-capitalize w-100 font-weight-bold text-body-2 mr-2"
                              :class="`text-${col.align}`"
                              style="
                                word-break: break-word;
                                white-space: normal;
                              "
                            >
                              {{ col.title }}
                            </span>
                          </v-row>
                        </v-col>
                      </template>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>
              </template>

              <template #default="{ items }">
                <slot name="tableItems" :items="items" />
              </template>

              <template #no-data>
                <v-row no-gutters justify="center" class="pa-16">
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-img
                        :src="noDataImg"
                        width="100px"
                        height="100px"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <span class="font-weight-bold">
                        {{ noDataMsg }}
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-col>
        </v-row>
      </v-col>

      <v-divider></v-divider>
      <v-col cols="12" class="pa-4">
        <!-- Pagination -->
        <BaseTablePagination
          v-if="pageRange"
          @next-page="emit('nextPage')"
          @prev-page="emit('prevPage')"
          :pageRange="pageRange"
          :page="page"
          :pages="pages"
        />
      </v-col>
    </v-row>
  </BaseGCard>
</template>
<script setup lang="ts" generic="T">
const props = defineProps<{
  tableName?: string;
  items: T[];
  search?: string;
  searchDisplay?: boolean;
  headers: {
    sm?: string;
    md?: string;
    lg?: string;
    title: string;
    align: string;
    visible: boolean;
  }[];
  itemPerPage?: number;
  pageRange?: string;
  page?: number;
  pages?: number;
  noDataMsg: string;
  noDataImg: string;
  isLoading: boolean;
  elevation?: number;
}>();

const emit = defineEmits<{
  (event: "nextPage"): void;
  (event: "prevPage"): void;
  (event: "onSearch", keywords: string): void;
  (event: "onClear"): void;
}>();
</script>
<style scoped>
@media only screen and (max-width: 599px) {
  .title-header {
    display: none;
  }
}
</style>
