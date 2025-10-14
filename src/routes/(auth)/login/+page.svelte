<script lang="ts">
	import * as Form from '$components/ui/form';
	import * as Card from '$components/ui/card';

	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';

	import { Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	let showPassword = $state(false);

	const form = superForm(data.form);
	const { form: formData, enhance, message } = form;

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<main class="flex min-h-screen w-full items-center justify-center bg-background">
	<Card.Root class="max-w-[350px] shadow-xl">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl font-bold">Login</Card.Title>
			<Card.Description>Masukkan email dan password Anda untuk melanjutkan</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:enhance method="post" class="space-y-4">
				<!-- Email Field -->
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium">Email</Form.Label>
							<div class="relative">
								<Mail
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									{...props}
									type="email"
									placeholder="nama@email.com"
									bind:value={$formData.email}
									class="pl-10"
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Password Field -->
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label class="text-sm font-medium">Password</Form.Label>
								<a href="/forgot-password" class="text-xs text-primary hover:underline">
									Lupa password?
								</a>
							</div>
							<div class="relative">
								<Lock
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									{...props}
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									bind:value={$formData.password}
									class="pr-10 pl-10"
								/>
								<button
									type="button"
									onclick={togglePasswordVisibility}
									class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
								>
									{#if showPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<!-- Submit Button -->
				<Form.Button class="w-full" size="lg">Login</Form.Button>

				<!-- Divider -->
				<div class="relative my-6">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground">Atau</span>
					</div>
				</div>

				<!-- Social Login Buttons -->
				<div class="space-y-2">
					<Button variant="outline" class="w-full" type="button">
						<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</Button>
				</div>
			</form>

			<!-- Register Link -->
			<div class="mt-6 text-center text-sm">
				<span class="text-muted-foreground">Belum punya akun?</span>
				<a href="/register" class="ml-1 font-medium text-primary hover:underline">
					Daftar sekarang
				</a>
			</div>
		</Card.Content>
		<Card.Footer>
			{#if $message}
				<h2>{$message}</h2>
			{/if}
		</Card.Footer>
	</Card.Root>
</main>
