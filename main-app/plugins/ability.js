import { PureAbility } from '@casl/ability'
import { reactive } from 'vue'

const initialAbility = [
  {
    action: 'read',
    subject: 'Auth',
  },
]

export default defineNuxtPlugin((nuxtApp) => {
  const { permissions, setPermissions } = usePermission();

  let existingAbility = initialAbility

  if (process.client) {
    const userAbilitiesCookie = permissions.value // localStorage.getItem('userAbilities')
    const stringifiedUserAbilities = userAbilitiesCookie //JSON.parse(userAbilitiesCookie)
    if (stringifiedUserAbilities) {
      existingAbility = stringifiedUserAbilities
    }
  }
  const ability = reactive(new PureAbility(existingAbility))

  const updateAbility = (newAbilities) => {
    ability.update(newAbilities)
  }

  if (process.client) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'userAbilities') {
        const newAbilities = JSON.parse(event.newValue)
        updateAbility(newAbilities)
      }
    })
  }

  // Make the ability instance and update function available throughout the app
  nuxtApp.provide('ability', ability)
  nuxtApp.provide('updateAbility', updateAbility)
})
