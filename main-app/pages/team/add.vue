<template>
	<v-row no-gutters justify="center" class="py-8">
		<v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-4">
			<v-card width="100%" elevation="0" style="border-width: thin">
				<v-form v-model="isInviteValid" @submit.prevent="submit()">
					<v-row no-gutters justify="center">
						<v-col cols="12" class="pa-4">
							<v-row no-gutters class="fill-height" align-content="center">
								<v-btn
									fav
									density="compact"
									icon="mdi-arrow-left"
									variant="text"
									class="mt-1"
									:to="{ name: 'team' }"
								></v-btn>
								<span
									class="ml-2 text-h6 font-weight-bold text-capitalize"
									style="letter-spacing: 2px !important"
								>
									Team
								</span>
							</v-row>
						</v-col>

						<v-col cols="12">
							<v-divider></v-divider>
						</v-col>

						<v-col cols="12">
							<v-row no-gutters class="pa-8">
								<v-col cols="12" class="mb-2">
									<div class="text-subtitle-1 text-medium-emphasis">E-mail</div>
									<v-text-field
										v-model="user.email"
										density="comfortable"
										placeholder="Enter e-mail"
										:rules="[requiredInput, validEmail]"
										clearable
										:persistent-hint="false"
									></v-text-field>
								</v-col>

								<v-col cols="12" class="mb-2">
									<div class="text-subtitle-1 text-medium-emphasis">
										Given Name
									</div>
									<v-text-field
										v-model="user.givenName"
										density="comfortable"
										placeholder="Enter given name"
										:rules="[requiredInput]"
										clearable
										:persistent-hint="false"
									></v-text-field>
								</v-col>

								<v-col cols="12" class="mb-4">
									<div class="text-subtitle-1 text-medium-emphasis">
										Surname
									</div>
									<v-text-field
										v-model="user.surname"
										density="comfortable"
										placeholder="Enter surname"
										:rules="[requiredInput]"
										:persistent-hint="false"
									></v-text-field>
								</v-col>

								<v-col cols="12">
									<v-row no-gutters>
										<v-btn
											block
											class="font-weight-bold"
											:disabled="!isInviteValid"
											type="submit"
											color="primary"
										>
											submit
										</v-btn>
									</v-row>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-form>
			</v-card>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "secure",
});

const { requiredInput, validEmail } = useUtils();
const { inviteUser, currentUser } = useLocalAuth();
const { user, isInviteValid, setUser } = useUser();

onMounted(() => {
	setUser();
});

function goBack() {
	useRouter().back();
}

async function cancel() {
	goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
	try {
		const result = await inviteUser({
			givenName: user.value.givenName,
			surname: user.value.surname,
			email: user.value.email,
			type: currentUser.value.type,
			organization: currentUser.value.organization,
			site: mySite.value,
			role: "",
		});
		setSnackbar({ text: result.message, modal: true, type: "success" });
		goBack();
	} catch (error) {
		setSnackbar({ text: error as string, modal: true , type: "error"});
	}
}
</script>
