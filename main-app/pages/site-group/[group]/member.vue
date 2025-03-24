<template>
	<v-row no-gutters class="pa-8">
		<v-col cols="12">
			<spgroup-members-table
				@on-invite="dialog = true"
				:actions="actions"
				@on-open-pending-member="isOpenPendingMember = true"
			/>
		</v-col>

		<spgroup-members-invite
			:isConfirmModal="dialog"
			@close-modal="dialog = false"
			@submit="submit($event)"
		/>

		<spgroup-members-groups
			:isConfirmModal="transferModal"
			:currentGroup="String(route.params.group)"
			@close-modal="transferModal = false"
			@transfer-member="transferMemberConfirm($event)"
		/>

		<spgroup-members-pending
			v-if="isOpenPendingMember"
			:isConfirmModal="isOpenPendingMember"
			@on-hide-dialog="isOpenPendingMember = false"
		/>

		<digital-password
			is-confirm-title="Please confirm to transfer member to other Group"
			:isConfirmModal="dialogConfirm"
			@close-modal="dialogConfirm = false"
			@confirm-sign="confirmTransfer($event)"
		/>

		<!-- dialogAssignRoles -->
		<dialog-role
			:isConfirmModal="dialogAssignRoles"
			:roleSet="selectedTeam"
			@close-modal="dialogAssignRoles = false"
			@confirm-select="submitReassign($event)"
		></dialog-role>
	</v-row>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["secure", "role"],
});

const { setSnackbar } = useLocal();
const dialog = ref(false);
const dialogConfirm = ref(false);
const dialogAssignRoles = ref(false);
const transferModal = ref(false);
const isOpenPendingMember = ref(false);

const { user, users, getAllGroupMemberSP, setUser, updateUserRole, setUsers } =
	useUser();
const { setSPGroup, getSPGroupById } = useSPGroup();

const {
	currentUser,
	inviteUserToGroup,
	removeMembertoGroup,
	transferMembertoGroup,
} = useLocalAuth();
const route = useRoute();
onMounted(async () => {
	users.value = [];
	await getAllGroupMemberSP({
		serviceProvider: String(currentUser.value.serviceProvider),
		serviceProviderGroup: String(route.params.group),
	});

	const _group = await getSPGroupById(route.params.group as string);
	setSPGroup(_group!);
});
const selectedTeam = ref({});
const actions = computed(() => {
	return [
		{
			text: "Assign Role",
			disabled: false,
			isLink: false,
			dialogData: {
				action: (value: any) => {
					selectedTeam.value = value;
					dialogAssignRoles.value = true;
				},
			},
		},
		{
			text: "Transfer Member",
			disabled: false,
			isLink: false,
			dialogData: {
				action: async (value: any) => {
					transferModal.value = true;
					setUser(value);
				},
			},
		},
		{
			text: "Remove Member",
			disabled: false,
			isLink: false,
			dialogData: {
				action: async (value: any) => {
					const result = await removeMembertoGroup({
						id: value._id,
						serviceProviderGroup: "",
						status: "inactive",
					});

					setSnackbar({ text: result.message, modal: true, type: "success" });
					getAllGroupMemberSP({
						serviceProvider: currentUser.value.serviceProvider,
						serviceProviderGroup: route.params.group,
					});
				},
			},
		},
	];
});

const selectedGroupToTransfer = ref({});
async function transferMemberConfirm(value: any) {
	dialogConfirm.value = true;
	selectedGroupToTransfer.value = value;
}

async function submitReassign(_role: any) {
	try {
		await Promise.all([
			updateUserRole({
				id: selectedTeam.value._id,
				role: _role._id,
			}),
			await getAllGroupMemberSP({
				serviceProvider: String(currentUser.value.serviceProvider),
				serviceProviderGroup: String(route.params.group),
			}),
		]);
		setSnackbar({ text: "Role updated successfully", modal: true, type: "success" });
		dialogAssignRoles.value = false;
	} catch (error) {
		setSnackbar({ text: error.message, modal: true, type: "error" });
	}
}

async function confirmTransfer(value: any) {
	const result = await transferMembertoGroup({
		id: user.value._id,
		serviceProviderGroup: selectedGroupToTransfer.value._id,
	});

	setSnackbar({ text: result.message, modal: true, type: "success" });

	dialogConfirm.value = false;
	transferModal.value = false;
	getAllGroupMemberSP({
		serviceProvider: currentUser.value.serviceProvider,
		serviceProviderGroup: route.params.group,
	});
}

async function submit(value: string) {
	try {
		const result = await inviteUserToGroup({
			email: value,
			serviceProvider: currentUser.value.serviceProvider,
			serviceProviderGroup: route.params.group,
		});
		setSnackbar({ text: result.message, modal: true, type: "success" });
		dialog.value = false;

		getAllGroupMemberSP({
			serviceProvider: currentUser.value.serviceProvider,
			serviceProviderGroup: route.params.group,
		});
	} catch (error) {
		setSnackbar({ text: error as string, modal: true, type: "error" });
	}
}
</script>
