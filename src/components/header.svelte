<script lang="ts">
	import { fly } from 'svelte/transition';
	import { BookOpen, Menu, LogIn, UserPlus, XIcon } from 'lucide-svelte';
	import { Button } from '$components/ui/button';
	import ModeTogle from '$components/mode-togle.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto, invalidate } from '$app/navigation';
	import type { User } from 'better-auth';

	let { user } = $props<{ user: User }>();

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleLogout() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					await invalidate('load:user');
					goto('/login');
				}
			}
		});
	}
</script>

<!-- Main Header -->
<header
	class="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto max-w-7xl">
		<div class="flex h-16 items-center justify-between px-4 sm:h-20">
			<!-- Logo & Title -->
			<a href="/" class="group flex items-center gap-2 sm:gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
				>
					<BookOpen class="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
				</div>
				<div class="hidden sm:block">
					<h1 class="text-lg leading-tight font-bold sm:text-xl">Al-Qur'an Digital</h1>
					<p class="text-xs text-muted-foreground">Kitab Suci Umat Islam</p>
				</div>
				<h1 class="text-lg font-bold sm:hidden">Al-Qur'an</h1>
			</a>

			<!-- Navigation & Actions -->
			<div class="flex items-center gap-2 sm:gap-3">
				<!-- Desktop Navigation -->
				<nav class="hidden items-center gap-1 md:flex">
					<Button variant="ghost" size="sm" href="/">Beranda</Button>
					<Button variant="ghost" size="sm" href="/juz">Juz</Button>
					<Button variant="ghost" size="sm" href="/bookmarks">Bookmark</Button>
					<Button variant="ghost" size="sm" href="/about">Tentang</Button>
				</nav>

				<!-- Auth Buttons (Desktop) -->
				<div class="hidden items-center gap-2 md:flex">
					{#if !user}
						<Button variant="outline" size="sm" href="/login" class="gap-2">
							<LogIn class="h-4 w-4" />
							<span>Login</span>
						</Button>
						<Button size="sm" href="/register" class="gap-2">
							<UserPlus class="h-4 w-4" />
							<span>Register</span>
						</Button>
					{:else}
						<Button variant="outline" onclick={toggleLogout} size="sm" class="gap-2">
							<LogIn class="h-4 w-4" />
							<span>Logout</span>
						</Button>
					{/if}
				</div>

				<!-- Theme Toggle -->
				<ModeTogle />

				<!-- Mobile Menu Button -->
				<Button variant="ghost" size="icon" onclick={toggleMenu} class="h-9 w-9 md:hidden">
					{#if isMenuOpen}
						<XIcon />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
					<span class="sr-only">Toggle menu</span>
				</Button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<nav
				transition:fly={{ y: -20, duration: 200 }}
				class="border-t bg-background px-4 py-4 md:hidden"
			>
				<div class="flex flex-col gap-2">
					<Button variant="ghost" class="justify-start" href="/" onclick={toggleMenu}>
						Beranda
					</Button>
					<Button variant="ghost" class="justify-start" href="/juz" onclick={toggleMenu}>
						Juz
					</Button>
					<Button variant="ghost" class="justify-start" href="/bookmarks" onclick={toggleMenu}>
						Bookmark
					</Button>
					<Button variant="ghost" class="justify-start" href="/about" onclick={toggleMenu}>
						Tentang
					</Button>

					<!-- Auth Buttons (Mobile) -->
					<div class="mt-2 flex flex-col gap-2 border-t pt-3">
						{#if !user}
							<Button
								variant="outline"
								class="justify-start gap-2"
								href="/login"
								onclick={toggleMenu}
							>
								<LogIn class="h-4 w-4" />
								<span>Login</span>
							</Button>
							<Button class="justify-start gap-2" href="/register" onclick={toggleMenu}>
								<UserPlus class="h-4 w-4" />
								<span>Register</span>
							</Button>
						{:else}
							<Button variant="outline" onclick={toggleLogout} class="justify-start gap-2">
								<LogIn class="h-4 w-4" />
								<span>Logout</span>
							</Button>
						{/if}
					</div>
				</div>
			</nav>
		{/if}
	</div>
</header>
