import { Client, Account } from 'appwrite'

let client: Client | null = null
let account: Account | null = null

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!client) {
    client = new Client()
      .setEndpoint(config.public.awEndpoint)
      .setProject(config.public.awProject)
  }

  if (!account) {
    account = new Account(client)
  }

  return {
    provide: {
      appwrite: {
        client,
        account
      }
    }
  }
})
