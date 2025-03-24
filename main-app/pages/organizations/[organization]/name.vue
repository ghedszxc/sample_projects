<template>
	<v-row no-gutters justify="center" class="py-8">
		<v-row no-gutters justify="center" class="py-8">
			<v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-4">
				<v-card width="100%" elevation="0" style="border-width: thin">
					<v-form v-model="isOrganizationValid" @submit.prevent="submit()">
						<v-row no-gutters justify="center">
							<v-col cols="12" class="pa-4">
								<v-row no-gutters class="fill-height" align-content="center">
									<v-btn
										fav
										density="compact"
										icon="mdi-arrow-left"
										variant="text"
										class="mt-1"
										@click="goBack()"
									></v-btn>
									<span
										class="ml-2 text-h6 font-weight-bold text-capitalize"
										style="letter-spacing: 2px !important"
									>
										{{ organization.name }}
									</span>
								</v-row>
							</v-col>

							<v-col cols="12">
								<v-divider></v-divider>
							</v-col>

							<v-col cols="12">
								<v-row no-gutters class="pa-8">
									<v-col cols="12" class="mb-8">
										<v-img src="/organization-add.svg" height="150px"></v-img>
									</v-col>
									<v-col cols="12" class="mb-4">
										<div class="text-subtitle-1 text-medium-emphasis">
											Organization Name
										</div>
										<v-text-field
											:readonly="
												$ability.can('read', 'view-organizations') &&
												!$ability.can('update', 'edit-organizations')
											"
											v-model="organization.name"
											density="comfortable"
											placeholder="Enter organization name"
											:rules="[requiredInput]"
											:persistent-hint="false"
											:clearable="$ability.can('update', 'edit-organizations')"
										></v-text-field>
									</v-col>

									<v-col
										cols="12"
										v-if="$ability.can('update', 'edit-organizations')"
									>
										<v-row no-gutters>
											<v-btn
												block
												class="font-weight-bold"
												:disabled="!isOrganizationValid"
												type="submit"
												color="primary"
											>
												Update
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
	</v-row>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["secure", "organization"],
});
const { $ability } = useNuxtApp();
const { requiredInput } = useUtils();
const { organization, isOrganizationValid, updateOrgNameById } =
	useOrganization();

function goBack() {
	useRouter().back();
}

async function cancel() {
	goBack();
}

onMounted(() => {
	console.log("data: ", organization);
});

async function submit() {
	await updateOrgNameById({
		_id: organization.value._id as string,
		name: organization.value.name,
	});
	goBack();
}
</script>
