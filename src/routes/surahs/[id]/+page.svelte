<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { fly, fade } from 'svelte/transition';
	import { Card, CardContent, CardHeader } from '$components/ui/card';
	import { Button } from '$components/ui/button';
	import { Badge } from '$components/ui/badge';
	import { Skeleton } from '$components/ui/skeleton';
	import { Alert, AlertDescription } from '$components/ui/alert';
	import {
		BookOpen,
		ChevronLeft,
		ChevronRight,
		Play,
		Pause,
		Bookmark,
		BookmarkCheck,
		Share2,
		Volume2
	} from 'lucide-svelte';

	let { data } = $props();

	const query = createQuery(() => ({
		queryKey: ['quran', data.params.id],
		queryFn: async () => {
			const response = await fetch('https://equran.id/api/v2/surat/' + data.params.id);
			return await response.json();
		},
		staleTime: 1000 * 60 * 60
	}));

	let isPlaying = $state(false);
	let currentAudio: HTMLAudioElement | null = $state(null);
	let playingAyat: number | null = $state(null);
	let bookmarkedAyat = $state<number[]>([]);

	function toggleBookmark(ayatNumber: number) {
		if (bookmarkedAyat.includes(ayatNumber)) {
			bookmarkedAyat = bookmarkedAyat.filter((n) => n !== ayatNumber);
		} else {
			bookmarkedAyat = [...bookmarkedAyat, ayatNumber];
		}
	}

	function playFullSurah() {
		if (isPlaying && currentAudio) {
			currentAudio.pause();
			isPlaying = false;
		} else {
			// Using audio from Misyari Rasyid Al-Afasi (05)
			const audioUrl = query.data?.data?.audioFull?.['05'];
			if (audioUrl) {
				currentAudio = new Audio(audioUrl);
				currentAudio.play();
				isPlaying = true;
				currentAudio.onended = () => {
					isPlaying = false;
				};
			}
		}
	}

	function playAyatAudio(ayat: any) {
		if (playingAyat === ayat.nomorAyat && currentAudio) {
			currentAudio.pause();
			playingAyat = null;
		} else {
			if (currentAudio) {
				currentAudio.pause();
			}
			// Using audio from Misyari Rasyid Al-Afasi (05)
			const audioUrl = ayat.audio?.['05'];
			if (audioUrl) {
				currentAudio = new Audio(audioUrl);
				currentAudio.play();
				playingAyat = ayat.nomorAyat;
				currentAudio.onended = () => {
					playingAyat = null;
				};
			}
		}
	}

	function shareAyat(ayat: any) {
		const text = `${query.data?.data.namaLatin} (${query.data?.data.nomor}:${ayat.nomorAyat})\n\n${ayat.teksArab}\n\n${ayat.teksIndonesia}\n\n${ayat.teksLatin}`;

		if (navigator.share) {
			navigator.share({
				title: `${query.data?.data.namaLatin} Ayat ${ayat.nomorAyat}`,
				text: text
			});
		} else {
			navigator.clipboard.writeText(text);
			alert('Ayat berhasil disalin!');
		}
	}
</script>

<svelte:head>
	<title>{query.data?.data?.namaLatin || 'Loading...'} | Al-Qur'an Digital</title>
</svelte:head>

<div class="min-h-screen bg-background pt-[70px] pb-8">
	{#if query.isPending}
		<!-- Loading Skeleton -->
		<div class="container mx-auto max-w-4xl px-4 py-8">
			<Skeleton class="mb-6 h-64 w-full rounded-xl" />
			{#each Array(5) as _, i (i)}
				<Card class="mb-4">
					<CardContent class="p-6">
						<Skeleton class="mb-4 h-6 w-24" />
						<Skeleton class="mb-4 h-24 w-full" />
						<Skeleton class="h-16 w-full" />
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else if query.error}
		<div class="container mx-auto max-w-4xl px-4 py-8">
			<Alert variant="destructive">
				<AlertDescription>Gagal memuat surah. Silakan coba lagi.</AlertDescription>
			</Alert>
		</div>
	{:else if query.data?.data}
		<div class="container mx-auto max-w-4xl px-4 py-8">
			<!-- Surah Header -->
			<Card class="mb-6 overflow-hidden shadow-xl">
				<div class="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8">
					<!-- Navigation -->
					<div class="mb-4 flex items-center justify-between">
						<Button variant="ghost" size="sm" href="/" class="gap-2">
							<ChevronLeft class="h-4 w-4" />
							Kembali
						</Button>

						<div class="flex gap-2">
							{#if query.data.data.suratSebelumnya}
								<Button
									variant="outline"
									size="sm"
									href="/surahs/{query.data.data.suratSebelumnya.namaLatin.toLowerCase()}"
									class="gap-2"
								>
									<ChevronLeft class="h-4 w-4" />
									<span class="hidden sm:inline">Sebelumnya</span>
								</Button>
							{/if}
							{#if query.data.data.suratSelanjutnya}
								<Button
									variant="outline"
									size="sm"
									href="/surahs/{query.data.data.suratSelanjutnya.namaLatin.toLowerCase()}"
									class="gap-2"
								>
									<span class="hidden sm:inline">Selanjutnya</span>
									<ChevronRight class="h-4 w-4" />
								</Button>
							{/if}
						</div>
					</div>

					<div class="text-center">
						<!-- Surah Number Badge -->
						<div class="mb-4 flex justify-center">
							<div
								class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg"
							>
								<span class="text-2xl font-bold text-primary-foreground">
									{query.data.data.nomor}
								</span>
							</div>
						</div>

						<!-- Arabic Name -->
						<h1 class="mb-2 font-scherazade text-4xl font-bold sm:text-5xl md:text-6xl">
							{query.data.data.nama}
						</h1>

						<!-- Latin Name -->
						<h2 class="mb-2 text-2xl font-bold sm:text-3xl">
							{query.data.data.namaLatin}
						</h2>

						<!-- Meaning -->
						<p class="mb-4 text-lg text-muted-foreground italic">
							{query.data.data.arti}
						</p>

						<!-- Info Badges -->
						<div class="flex flex-wrap items-center justify-center gap-2">
							<Badge variant="secondary" class="gap-1">
								<BookOpen class="h-3 w-3" />
								{query.data.data.tempatTurun}
							</Badge>
							<Badge variant="secondary">
								{query.data.data.jumlahAyat} Ayat
							</Badge>
						</div>

						<!-- Audio Player -->
						<div class="mt-6 flex justify-center">
							<Button onclick={playFullSurah} class="gap-2" size="lg">
								{#if isPlaying}
									<Pause class="h-5 w-5" />
									Pause Audio
								{:else}
									<Volume2 class="h-5 w-5" />
									Putar Surah
								{/if}
							</Button>
						</div>
					</div>
				</div>

				<!-- Description -->
				{#if query.data.data.deskripsi}
					<CardContent class="border-t p-6">
						<h3 class="mb-3 font-semibold">Tentang Surah</h3>
						<div class="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
							{@html query.data.data.deskripsi}
						</div>
					</CardContent>
				{/if}
			</Card>

			<!-- Bismillah (except for At-Taubah and Al-Fatihah) -->
			{#if query.data.data.nomor !== 9 && query.data.data.nomor !== 1}
				<Card class="mb-6 bg-primary/5">
					<CardContent class="p-6 text-center">
						<p class="font-scherazade text-3xl sm:text-4xl">
							بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
						</p>
						<p class="mt-2 text-sm text-muted-foreground">
							Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
						</p>
					</CardContent>
				</Card>
			{/if}

			<!-- Ayat List -->
			<div class="space-y-4">
				{#each query.data.data.ayat as ayat, i (ayat.nomorAyat)}
					<Card class="group overflow-hidden transition-all hover:shadow-lg">
						<CardHeader class="border-b bg-muted/30 p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary"
									>
										{ayat.nomorAyat}
									</div>
									<span class="text-sm text-muted-foreground">
										Ayat {ayat.nomorAyat}
									</span>
								</div>

								<div class="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => playAyatAudio(ayat)}
									>
										{#if playingAyat === ayat.nomorAyat}
											<Pause class="h-4 w-4" />
										{:else}
											<Play class="h-4 w-4" />
										{/if}
									</Button>

									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => toggleBookmark(ayat.nomorAyat)}
									>
										{#if bookmarkedAyat.includes(ayat.nomorAyat)}
											<BookmarkCheck class="h-4 w-4 fill-primary text-primary" />
										{:else}
											<Bookmark class="h-4 w-4" />
										{/if}
									</Button>

									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										onclick={() => shareAyat(ayat)}
									>
										<Share2 class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>

						<CardContent class="space-y-4 p-6">
							<!-- Arabic Text -->
							<div class="text-right">
								<p class="font-scherazade text-3xl leading-loose sm:text-4xl">
									{ayat.teksArab}
								</p>
							</div>

							<!-- Latin Text -->
							<div class="rounded-lg bg-muted/50 p-4">
								<p class="text-sm text-muted-foreground italic sm:text-base">
									{ayat.teksLatin}
								</p>
							</div>

							<!-- Indonesian Translation -->
							<div class="border-l-4 border-primary pl-4">
								<p class="text-sm leading-relaxed sm:text-base">
									{ayat.teksIndonesia}
								</p>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>

			<!-- Navigation Bottom -->
			<div
				class="mt-8 flex items-center justify-between gap-4"
				in:fade={{ duration: 300, delay: 200 }}
			>
				{#if query.data.data.suratSebelumnya}
					<Button
						variant="outline"
						href="/surahs/{query.data.data.suratSebelumnya.nomor}"
						class="flex-1 gap-2"
					>
						<ChevronLeft class="h-4 w-4" />
						<div class="text-left">
							<div class="text-xs text-muted-foreground">Sebelumnya</div>
							<div class="font-semibold">{query.data.data.suratSebelumnya.namaLatin}</div>
						</div>
					</Button>
				{:else}
					<div class="flex-1"></div>
				{/if}

				<Button variant="outline" href="/" size="icon" class="h-12 w-12">
					<BookOpen class="h-5 w-5" />
				</Button>

				{#if query.data.data.suratSelanjutnya}
					<Button
						variant="outline"
						href="/surahs/{query.data.data.suratSelanjutnya.nomor}"
						class="flex-1 gap-2"
					>
						<div class="text-right">
							<div class="text-xs text-muted-foreground">Selanjutnya</div>
							<div class="font-semibold">{query.data.data.suratSelanjutnya.namaLatin}</div>
						</div>
						<ChevronRight class="h-4 w-4" />
					</Button>
				{:else}
					<div class="flex-1"></div>
				{/if}
			</div>
		</div>
	{/if}
</div>
