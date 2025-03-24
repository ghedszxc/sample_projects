<template>
	<v-row no-gutters justify="center" class="py-8">
		<v-col cols="11" md="6" class="font-weight-light mt-4">
			<v-card
				width="100%"
				elevation="0"
				style="border-width: thin"
				min-height="368px"
			>
				<v-form v-model="isFeedbackValid" @submit.prevent="submit()">
						<v-row no-gutters class="pa-8" justify="center">
							<v-col
								cols="12"
								class="text-h4 font-weight-bold mb-7 text-capitalize"
								style="letter-spacing: 2px !important"
							>
								Update Service
							</v-col>

							<v-col>
								<span class="font-weight-bold">Service</span>
								<span class="text-red mx-1 mb-2">*</span>
							</v-col>
							<v-col cols="12" class="mb-4">
								<v-select
									v-model="feedback.service"
									:items="['Security', 'Maintenance', 'Pest Control', 'Service Desk', 'Landscaping']"
									
									density="comfortable"
									:rules="[requiredInput]"
									:disabled="isDisabledService"
								></v-select>
							</v-col>

							<v-col cols="12">
								<v-row no-gutters>
									<v-btn
										theme="dark"
										class="font-weight-bold"
										:disabled="!isFeedbackValid || isDisabledService"
										type="submit"
									>
										submit
									</v-btn>
									<v-btn
										variant="text"
										class="font-weight-bold"
										@click="cancel()"
									>
										cancel
									</v-btn>
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

const { requiredInput } = useUtils();
const { feedback, getFeedbackById, setFeedback, isFeedbackValid, updateFeedback } = useFeedback();

const id = computed(() => useRoute().params.id as string);

const isDisabledService = ref(false)

onMounted(async () => {
	const result = await getFeedbackById(id.value)
	setFeedback(result);
	
	isDisabledService.value = !result.status ? false : true 
});


function goBack() {
	useRouter().back();
}

async function cancel() {
	goBack();
}

async function submit() {
	await updateFeedback(id.value, { service: feedback.value.service, status: "Pending" });
	goBack();
}
</script>
