<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Card } from '$components/ui/card';
	import { Skeleton } from '$components/ui/skeleton';
	import { Alert, AlertDescription } from '$components/ui/alert';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import { Badge } from '$components/ui/badge';

	const query = createQuery(() => ({
		queryKey: ['quran'],
		queryFn: async () => {
			const response = await fetch('https://equran.id/api/v2/surat');
			return await response.json();
		},
		staleTime: 1000 * 60 * 60
	}));

	let searchQuery = $state('');
	let filterTempat = $state('semua');
 	
  let filteredData = $derived.by(() => {
		if (!query.data?.data) return [];

		return query.data.data.filter((surah: any) => {
			const matchSearch =
				surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
				surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
				surah.nomor.toString().includes(searchQuery);

			const matchTempat =
				filterTempat === 'semua' || surah.tempatTurun.toLowerCase() === filterTempat.toLowerCase();

			return matchSearch && matchTempat;
		});
	});
</script>

<svelte:head>
	<title>Al-Qur'an | home</title>
</svelte:head>

<main class="flex min-h-screen flex-col bg-background pt-[100px]">
	<!-- Search & Filter (tidak sticky) -->
	<div class="border-b bg-background">
		<div class="container mx-auto max-w-7xl px-4 py-4">
			<Card class="p-4 shadow-lg">
				<div class="flex flex-col gap-3 sm:gap-4">
					<div class="w-full">
						<Input
							bind:value={searchQuery}
							placeholder="Cari surah..."
							class="h-10 w-full text-sm sm:h-12 sm:text-base"
						/>
					</div>
					<div class="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
						<Button
							variant={filterTempat === 'semua' ? 'default' : 'outline'}
							onclick={() => (filterTempat = 'semua')}
							class="h-9 flex-shrink-0 text-xs whitespace-nowrap sm:h-10 sm:text-sm"
						>
							Semua
						</Button>
						<Button
							variant={filterTempat === 'mekah' ? 'default' : 'outline'}
							onclick={() => (filterTempat = 'mekah')}
							class="h-9 flex-shrink-0 text-xs whitespace-nowrap sm:h-10 sm:text-sm"
						>
							Mekah
						</Button>
						<Button
							variant={filterTempat === 'madinah' ? 'default' : 'outline'}
							onclick={() => (filterTempat = 'madinah')}
							class="h-9 flex-shrink-0 text-xs whitespace-nowrap sm:h-10 sm:text-sm"
						>
							Madinah
						</Button>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<!-- Scrollable Content Container -->
	<div class=" max-h-[650px] flex-1 overflow-y-auto">
		<div class="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
			{#if query.isPending}
				<!-- Skeleton Loading -->
				<div class="space-y-3 sm:space-y-4">
					{#each Array(6) as _, i (i)}
						<Card class="p-4 sm:p-6">
							<div class="flex items-center gap-3 sm:gap-6">
								<Skeleton class="h-12 w-12 flex-shrink-0 rounded-xl sm:h-16 sm:w-16" />
								<div class="flex-1 space-y-2 sm:space-y-3">
									<div class="flex items-start justify-between gap-2">
										<div class="flex-1 space-y-2">
											<Skeleton class="h-5 w-32 sm:h-6 sm:w-48" />
											<Skeleton class="h-3 w-24 sm:h-4 sm:w-32" />
										</div>
										<Skeleton class="h-6 w-24 sm:h-8 sm:w-32" />
									</div>
									<Skeleton class="h-3 w-full max-w-xs sm:h-4 sm:max-w-md" />
								</div>
							</div>
						</Card>
					{/each}
				</div>
			{:else if query.error}
				<Alert variant="destructive">
					<AlertDescription>Gagal memuat data surah. Silakan coba lagi.</AlertDescription>
				</Alert>
			{:else if filteredData.length === 0}
				<Card class="p-8 text-center sm:p-12">
					<p class="text-base text-muted-foreground sm:text-lg">Tidak ada surah yang ditemukan</p>
				</Card>
			{:else}
				<!-- Surah List -->
				<div class="flex flex-col space-y-3 sm:space-y-4">
					{#each filteredData as surah (surah.nomor)}
						<a href="/surahs/{surah.namaLatin.toLowerCase()}">
							<Card
								class="group cursor-pointer border-l-4 border-l-transparent p-4 transition-all duration-200 hover:scale-[1.01] hover:border-l-primary hover:shadow-xl sm:p-6"
							>
								<div class="flex items-start gap-3 sm:items-center sm:gap-6">
									<!-- Nomor Badge -->
									<div
										class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-all group-hover:from-primary/30 group-hover:to-primary/10 sm:h-16 sm:w-16"
									>
										<span class="text-lg font-bold text-primary sm:text-2xl">{surah.nomor}</span>
									</div>

									<!-- Content -->
									<div class="min-w-0 flex-1">
										<div class="mb-2 flex flex-col gap-2 sm:mb-3 sm:gap-3">
											<div class="flex items-start justify-between gap-2">
												<div class="min-w-0 flex-1">
													<h3
														class="mb-1 truncate text-lg font-bold transition-colors group-hover:text-primary sm:text-2xl"
													>
														{surah.namaLatin}
													</h3>
													<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
														<Badge variant="secondary" class="text-xs">
															{surah.tempatTurun}
														</Badge>
														<span class="text-xs text-muted-foreground sm:text-sm">
															{surah.jumlahAyat} Ayat
														</span>
													</div>
												</div>
												<div class="flex-shrink-0 text-right">
													<p class="mb-1 font-scherazade text-xl sm:text-3xl">{surah.nama}</p>
													<p
														class="hidden text-xs text-muted-foreground italic sm:block sm:text-sm"
													>
														{surah.arti}
													</p>
												</div>
											</div>

											<!-- Arti untuk mobile -->
											<p class="text-xs text-muted-foreground italic sm:hidden">{surah.arti}</p>
										</div>

										<!-- Deskripsi (truncated) -->
										{#if surah.deskripsi}
											<p class="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
												{@html surah.deskripsi.replace(/<[^>]*>/g, '').substring(0, 150)}...
											</p>
										{/if}
									</div>
								</div>
							</Card>
						</a>
					{/each}
				</div>

				<!-- Result Count -->
				<div class="mt-4 text-center sm:mt-6">
					<p class="text-xs text-muted-foreground sm:text-sm">
						Menampilkan {filteredData.length} dari {query.data.data.length} surah
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>
