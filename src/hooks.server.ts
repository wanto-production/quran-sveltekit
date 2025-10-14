import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers
  })

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  if (session && ['/register', '/login'].includes(event.url.pathname)) throw redirect(302, '/')

  return svelteKitHandler({ event, resolve, auth, building });
}
