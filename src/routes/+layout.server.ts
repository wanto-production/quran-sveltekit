
export const load = ({ locals, depends }) => {
  depends('load:user')
  return {
    user: locals.user,
  }
}
