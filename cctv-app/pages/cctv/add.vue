<template>
	<v-row no-gutters justify="center" class="py-8">
		<v-col cols="11" md="6" class="font-weight-light mt-4">
			<v-card
				width="100%"
				elevation="0"
				style="border-width: thin"
				min-height="368px"
			>
				<v-form
					v-model="isCctvValid"
					@submit.prevent="submit()"
				>
					<v-row no-gutters class="pa-8" justify="center">
						<v-col
							cols="12"
							class="text-h4 font-weight-bold mb-7 text-capitalize"
							style="letter-spacing: 2px !important"
						>
							Add CCTV
						</v-col>

	                    <v-col>
	                        <span class="font-weight-bold"
	                            >URL</span
	                        >
	                        <span class="text-red mx-1 mb-2">*</span>
	                    </v-col>

	                    <v-col cols="12" class="mb-4">
	                        <v-text-field
	                            v-model="cctv.ip"
	                            density="comfortable"
	                            :rules="[requiredInput]"
	                            type="text"
	                            class="input-group--focused"
                        
	                        ></v-text-field>
	                    </v-col>

						 <v-col>
							<span class="font-weight-bold"
								>Locations</span
							>
							<span class="text-red mx-1 mb-2">*</span>
						</v-col>

						<v-col cols="12" class="mb-4">
							<v-text-field
								v-model="cctv.location"
								density="comfortable"
								type="text"
								class="input-group--focused"
								hint=""
							></v-text-field>
						</v-col>

						<v-col cols="12">
							<v-row no-gutters>
								<v-btn
									theme="dark"
									class="font-weight-bold"
									:disabled="!isCctvValid"
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
const { cctv, addCCTV, setCctv, isCctvValid } = useCCTV();

onMounted(() => {
	setCctv();
});

function goBack() {
	useRouter().back();
}

async function cancel() {
	await setCctv();
	await goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
	try {
		const result = await addCCTV(cctv.value);
		setSnackbar({ text: "Successfull created camera", modal: true, type: "success" });
		goBack();
	} catch (error) {
		setSnackbar({ text: error as string, modal: true, type: "error" });
	}
}
</script>
