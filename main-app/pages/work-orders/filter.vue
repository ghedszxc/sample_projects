<template>
	<filter-page
		v-if="$ability.can('read', 'view-work-orders')"
		:bgImage="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/work-order-and-feedback-filter-bg.jpg`"
		@submit="submit($event)"
	>
		<template v-slot:form-header>
			<v-col cols="12" style="font-size: 24px">
				<v-row no-gutters>
					<v-col cols="2">
						<v-img
							:src="`${useRuntimeConfig().public.S3_BUCKET}/icons/work-order-filter-icon.svg`"
							style="width: 43px; height: 43px"
						></v-img>
					</v-col>
					<v-col cols="10" class="mt-3"> Work Orders </v-col>
				</v-row>
			</v-col>
		</template>
	</filter-page>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["secure"],
});
const { $ability } = useNuxtApp();
function submit(value: { query: any }) {
	useRouter().push({
		name: "work-orders",
		query: value.query,
	});
}
</script>
