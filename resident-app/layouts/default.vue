<template>
	<v-app :theme="theme">
		<v-navigation-drawer v-model="drawer">
			<v-list density="compact">
				<template v-for="route in routes" :key="route.text">
					<v-list-item
						class="text-subtitle-2 my-1"
						active-class="font-weight-black"
						:to="{ name: route.name }"
						:prepend-icon="route.icon"
					>
						{{ route.text }}
					</v-list-item>
				</template>
			</v-list>

			<v-list class="pa-0">
				<v-list-subheader>Services</v-list-subheader>

				<v-list density="compact">
					<template v-for="service in services" :key="service.text">
						<v-list-item
							class="text-subtitle-2 my-1"
							active-class="font-weight-black"
							:prepend-icon="service.icon"
							:href="service.to"
							target="_blank"
						>
							{{ service.text }}
						</v-list-item>
					</template>
				</v-list>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar density="comfortable" extension-height="65">
			<template #prepend>
				<v-app-bar-nav-icon
					@click="drawer = !drawer"
				></v-app-bar-nav-icon>
			</template>

			<template #append>
				<v-btn
					icon
					class="mx-1"
					density="comfortable"
					@click="theme = theme === 'light' ? 'dark' : 'light'"
				>
					<v-icon>mdi-theme-light-dark</v-icon>
				</v-btn>
				<v-menu
					v-model="menu"
					:close-on-content-click="false"
					location="bottom"
				>
					<template #activator="{ props }">
						<v-btn variant="text" v-bind="props">
							<template #append>
								<v-icon>{{
									props["aria-expanded"] === "false"
										? "mdi-chevron-down"
										: "mdi-chevron-up"
								}}</v-icon>
							</template>
							{{ currentUser.givenName }}
						</v-btn>
					</template>

					<v-card width="350">
						<v-list density="compact" class="pa-0">
							<v-list-item
								class="mt-2"
								:subtitle="currentUser.email"
							>
								<template #title>
									<span class="font-weight-bold">
										{{ currentUser.givenName }}
										{{ currentUser.surname }}
									</span>
								</template>
							</v-list-item>

							<v-divider class="mt-4"></v-divider>
						</v-list>
						<v-card-text>
							<span
								class="font-weight-bold text-primary pointer-cursor nuxt-link"
								@click="
									useRouter().push({
										name: 'logout',
									})
								"
							>
								Sign Out
							</span>
						</v-card-text>
					</v-card>
				</v-menu>
			</template>
		</v-app-bar>

		<v-main>
			<slot />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
const { currentUser } = useLocalAuth();

const drawer = ref(false);
const menu = ref(false);
const { theme } = useLocal();

const { routes, services } = useLocalRoute();
</script>
