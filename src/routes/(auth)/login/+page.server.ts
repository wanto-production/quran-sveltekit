import { message, superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import { loginSchema } from "$lib/schema"
import { fail, redirect } from "@sveltejs/kit"
import { auth } from "$lib/auth"

export const load = async () => {
  const form = await superValidate(zod4(loginSchema))
  return { form }
}

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(loginSchema))

    if (!form.valid) return fail(400, { form })

    try {
      await auth.api.signInEmail({
        body: {
          email: form.data.email,
          password: form.data.password
        }
      })

      throw redirect(302, '/')
    } catch (err) {
      return message(form, `oops something wrong: ${(err as Error).message}`)
    }
  }
}
