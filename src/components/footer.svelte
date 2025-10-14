<script lang="ts">
	import { BookOpen, Mail, Github, Twitter, Heart } from '@lucide/svelte';
	import { Button } from '$components/ui/button';

	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Beranda', href: '/' },
		{ name: 'Juz', href: '/juz' },
		{ name: 'Bookmark', href: '/bookmarks' },
		{ name: 'Tentang', href: '/about' }
	];

	const resources = [
		{ name: 'API Documentation', href: '/docs' },
		{ name: 'Panduan Penggunaan', href: '/guide' },
		{ name: 'FAQ', href: '/faq' },
		{ name: 'Kontak', href: '/contact' }
	];

	const socialLinks = [
		{ name: 'Twitter', icon: Twitter, href: '#' },
		{ name: 'GitHub', icon: Github, href: '#' },
		{ name: 'Email', icon: Mail, href: 'mailto:info@alquran.com' }
	];
</script>

<footer class="border-t bg-background">
	<div class="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand Section -->
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60"
					>
						<BookOpen class="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<h3 class="text-lg font-bold">Al-Qur'an Digital</h3>
					</div>
				</div>
				<p class="text-sm text-muted-foreground">
					Platform digital untuk membaca dan mempelajari Al-Qur'an dengan mudah dan nyaman.
				</p>
				<div class="flex items-center gap-2">
					{#each socialLinks as social}
						<Button variant="ghost" size="icon" href={social.href} class="h-9 w-9">
							<social.icon class="h-4 w-4" />
							<span class="sr-only">{social.name}</span>
						</Button>
					{/each}
				</div>
			</div>

			<!-- Quick Links -->
			<div class="space-y-4">
				<h4 class="text-sm font-semibold">Menu</h4>
				<ul class="space-y-2">
					{#each quickLinks as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources -->
			<div class="space-y-4">
				<h4 class="text-sm font-semibold">Sumber Daya</h4>
				<ul class="space-y-2">
					{#each resources as resource}
						<li>
							<a
								href={resource.href}
								class="text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{resource.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Stats -->
			<div class="space-y-4">
				<h4 class="text-sm font-semibold">Al-Qur'an</h4>
				<div class="space-y-3">
					<div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
						<span class="text-sm text-muted-foreground">Total Surah</span>
						<span class="text-sm font-bold">114</span>
					</div>
					<div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
						<span class="text-sm text-muted-foreground">Total Ayat</span>
						<span class="text-sm font-bold">6,236</span>
					</div>
					<div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
						<span class="text-sm text-muted-foreground">Total Juz</span>
						<span class="text-sm font-bold">30</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row sm:gap-0"
		>
			<p class="text-center text-sm text-muted-foreground sm:text-left">
				© {currentYear} Al-Qur'an Digital. All rights reserved.
			</p>
			<div class="flex items-center gap-1 text-sm text-muted-foreground">
				<span>Made with</span>
				<Heart class="h-4 w-4 fill-red-500 text-red-500" />
				<span>for the Ummah</span>
			</div>
		</div>

		<!-- Data Source Attribution -->
		<div class="mt-4 text-center">
			<p class="text-xs text-muted-foreground">
				Data Al-Qur'an dari
				<a
					href="https://equran.id"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium transition-colors hover:text-primary"
				>
					equran.id
				</a>
			</p>
		</div>
	</div>
</footer>
