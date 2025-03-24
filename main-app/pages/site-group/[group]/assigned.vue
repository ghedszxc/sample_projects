<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <spgroup-assigned-table
        @on-join="dialog = true"
        @on-assign-site="onPopUpConfirmPassword"
      />
    </v-col>

    <digital-password
      isConfirmTitle="Are you sure you want to Assign this Site into the Group?"
      :isConfirmModal="dialog"
      @close-modal="dialog = false"
      @confirm-sign="onAssignSite"
    />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
const { setSitesCollab } = useSiteCollab();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { assignSiteToSPGroup } = useSPGroup();
const { assignGroupToSite } = useSiteCollab();
const route = useRoute();

const dialog = ref(false);
const site = ref({} as TSite | undefined);
const siteCollabId = ref("");
const groupId = computed(() => String(route.params.group)).value;

onMounted(async () => {
  await getAllSitesApproved();
});

async function getAllSitesApproved() {
  await setSitesCollab({
    serviceProvider: String(currentUser.value.serviceProvider),
    status: "approved",
    isNotAssigned: "Show Not Assigned", // any value here to show not assigned sites into the group
  });
}

function onPopUpConfirmPassword(value: TSite | undefined, id: string) {
  siteCollabId.value = id;
  site.value = value;
  dialog.value = true;
}

async function onAssignSite() {
  try {
    if (
      !(
        site.value &&
        Boolean(site.value) &&
        typeof site.value === "object" &&
        Object.keys(site.value).length > 0
      )
    )
      throw new Error("Site is null or undefined");

    const [resSp] = await Promise.all([
      assignSiteToSPGroup(groupId, {
        status: "connected",
        site: site.value._id,
      }),
      assignGroupToSite(siteCollabId.value, groupId),
    ]);
    1;
    if (resSp && Boolean(resSp)) {
      setSnackbar({
        text: "Successfully assigned group to site",
        modal: true, type: "success"
      });
      await useRouter().push({
        name: "site-group",
      });
    }
  } catch (error: any) {
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  } finally {
    await getAllSitesApproved();
    dialog.value = false;
  }
}
</script>
