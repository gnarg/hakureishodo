<script lang="ts">
	import { marked } from 'marked';
	// @ts-expect-error - svelte-images ships no type declarations
	import { Images } from 'svelte-images';
	import { _, locale } from 'svelte-i18n';

	export let data;
	const images = data.images;

	let p = (key: string) => marked.parse($_(key));

	function reveal(el: Element) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('in');
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 }
		);
		el.querySelectorAll('.js-reveal').forEach((node) => io.observe(node));
		return {
			destroy() {
				io.disconnect();
			}
		};
	}
</script>

<svelte:window />

<!-- ==================== TOPBAR ==================== -->
<nav class="topbar" aria-label="Site">
	<div class="wrap topbar__inner">
		<a class="topbar__brand" data-sveltekit-reload href="/">
			<img src="https://static.hakureishodo.art/images/stamp.png" alt="Hakurei Shodō" />
			<span class="word">Hakurei Shodō<small>書道</small></span>
		</a>
		<div class="topbar__nav">
			<a class="topbar__link" href="#class-information">Classes</a>
			<a class="topbar__link" href="#gallery">Gallery</a>
			<div class="lang">
				<a href="/?lang=ja" data-sveltekit-reload data-active={$locale === 'ja'}>日本語</a>
				<a href="/?lang=en" data-sveltekit-reload data-active={$locale === 'en'}>EN</a>
			</div>
		</div>
	</div>
</nav>

<!-- ==================== HERO ==================== -->
<header class="hero">
	<div class="hero__enso" aria-hidden="true"></div>
	<div class="hero__inner wrap">
		<p class="hero__overline">Portland · Japanese Calligraphy · 書道</p>
		<div class="hero__seal" aria-hidden="true">書道</div>
		<h1 class="hero__title">Hakurei Shodō</h1>
		<p class="hero__sub">
			Hand-lettered ink &amp; paper. Begin the way of the brush — one stroke at a time.
		</p>
		<a class="hero__scroll" href="#class-information">Scroll</a>
	</div>
</header>

<main use:reveal>
	<!-- ==================== INTRO / TEACHER ==================== -->
	<section class="block" aria-labelledby="intro-title">
		<div class="wrap">
			<div class="block__head">
				<span class="block__num">序</span>
				<h2 class="block__title" id="intro-title">Welcome<small>The teacher · 師</small></h2>
				<hr class="block__rule" />
			</div>

			<div class="intro__grid js-reveal">
				<div class="prose">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted admin-authored markdown -->
					{@html p('introduction')}
				</div>

				<aside class="teacher">
					<div class="hanko" title="Hakurei" aria-hidden="true">白</div>
					<figure class="teacher__avatar">
						<img
							src="https://static.hakureishodo.art/images/thumb-kaori-3.JPG"
							alt="Hakurei Ito, shodō instructor"
						/>
					</figure>
					<h3 class="teacher__name">Hakurei Ito</h3>
					<span class="teacher__role">Shodō Instructor · 伊藤白礼</span>
					<div class="teacher__bio">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted admin-authored markdown -->
						{@html p('bio')}
					</div>
					<ul class="teacher__links">
						<li><span class="tmark">址</span><span>Portland, Oregon</span></li>
						<li>
							<span class="tmark">〒</span>
							<a href="mailto:hakurei.shodo@gmail.com">hakurei.shodo@gmail.com</a>
						</li>
						<li>
							<span class="tmark">写</span>
							<a href="https://instagram.com/ito.hakurei" rel="noopener noreferrer">Instagram</a>
						</li>
					</ul>
				</aside>
			</div>
		</div>
	</section>

	<!-- ==================== CLASSES ==================== -->
	<section class="block classes" id="class-information" aria-labelledby="classes-title">
		<div class="wrap classes__inner">
			<div class="block__head js-reveal">
				<span class="block__num">授業</span>
				<h2 class="block__title" id="classes-title">
					Class Information<small>The invitation · 稽古のご案内</small>
				</h2>
				<hr class="block__rule" />
			</div>

			<p class="classes__note js-reveal">— 入門をお待ちしております —</p>

			<div class="class-grid">
				<article class="ticket js-reveal">
					<span class="ticket__edge l" aria-hidden="true"></span>
					<span class="ticket__edge r" aria-hidden="true"></span>
					<p class="ticket__num">一</p>
					<p class="ticket__sub">Richmond Class</p>
					<div class="ticket__body">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted admin-authored markdown -->
						{@html p('richmond_class')}
					</div>
					<span class="ticket__seal">学</span>
				</article>

				<article class="ticket js-reveal" data-delay="1">
					<span class="ticket__edge l" aria-hidden="true"></span>
					<span class="ticket__edge r" aria-hidden="true"></span>
					<p class="ticket__num">二</p>
					<p class="ticket__sub">Community Class</p>
					<div class="ticket__body">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted admin-authored markdown -->
						{@html p('community_class')}
					</div>
					<span class="ticket__seal">集</span>
				</article>

				<article class="ticket js-reveal" data-delay="2">
					<span class="ticket__edge l" aria-hidden="true"></span>
					<span class="ticket__edge r" aria-hidden="true"></span>
					<p class="ticket__num">三</p>
					<p class="ticket__sub">What to Bring</p>
					<div class="ticket__body">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted admin-authored markdown -->
						{@html p('what_to_bring')}
					</div>
					<span class="ticket__seal inked">道具</span>
				</article>
			</div>

			<div class="classes__cta js-reveal">
				<a class="mail" href="mailto:hakurei.shodo@gmail.com">Ask about a seat →</a>
			</div>
		</div>
	</section>

	<!-- ==================== GALLERY ==================== -->
	<section class="block gallery" id="gallery" aria-labelledby="gallery-title">
		<div class="wrap">
			<div class="block__head js-reveal">
				<span class="block__num">作</span>
				<h2 class="block__title" id="gallery-title">Gallery<small>The work · 作品</small></h2>
				<hr class="block__rule" />
			</div>

			<div class="gallery__frame js-reveal">
				<Images {images} gutter={5} />
			</div>
		</div>
	</section>
</main>
