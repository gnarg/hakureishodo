<script>
  // @ts-nocheck
  import { marked } from 'marked';
  import { Images } from "svelte-images";
  import images from '$lib/images.json';
  import { _, locale } from 'svelte-i18n';

  let p = (key) => marked.parse($_(key));
</script>

<div class="masthead">
  <div class="masthead__inner-wrap">
    <div class="masthead__menu">
      <nav id="site-nav" class="greedy-nav">
          <a class="site-logo" data-sveltekit-reload href="/"><img src="/images/stamp.png" alt="Hakurei Shodo"></a>
          <!-- <a class="site-title" href="/">
                Hakurei Shodo
                <span class="site-subtitle">Japanese Caligraphy</span>
          </a> -->
          <ul class="visible-links">
            <li class="masthead__menu-item">
              <a href="#class-information">Classes</a>
            </li>
            <li class="masthead__menu-item">
              <a href="#gallery">Gallery</a>
            </li>
            <li class="masthead__menu-item">
              <a href="/?lang=ja" data-sveltekit-reload>日本語</a>
            </li>
            <li class="masthead__menu-item">
              <a href="/?lang=en" data-sveltekit-reload>English</a>
            </li>
          </ul>
          <button class="greedy-nav__toggle hidden" type="button">
            <span class="visually-hidden">Toggle menu</span>
            <div class="navicon"></div>
          </button>
      </nav>
    </div>
  </div>
</div>

<div class="initial-content">
  <div class="page__hero--overlay" style=" background-image: url('/images/IMG_1150.jpeg');">
    <div class="wrapper">
      <h1 id="page-title" class="page__title" itemprop="headline">
          Hakurei Shodo
      </h1>
    </div>
  </div>

  <div id="main" role="main">
    <div class="sidebar sticky">
      <div itemscope itemtype="https://schema.org/Person">
        <div class="author__avatar">
          <img src="/images/thumb-kaori-3.JPG" alt="Hakueri Ito" itemprop="image">
        </div>
        <div class="author__content">
          <h3 class="author__name" itemprop="name">Hakueri Ito</h3>
          <div class="author__bio" itemprop="description">
            {@html p('bio') }
          </div>
          <div class="author__urls-wrapper">
            <ul class="author__urls social-icons">
              <li itemprop="homeLocation" itemscope itemtype="https://schema.org/Place">
                <i class="fas fa-fw fa-map-marker-alt" aria-hidden="true"></i> <span itemprop="name">Portland, Oregon</span>
              </li>    
              <li><a href="mailto:hakurei.shodo@gmail.com" rel="nofollow noopener noreferrer">
                <i class="fas fa-envelope" aria-hidden="true"></i><span class="label">hakurei.shodo@gmail.com</span>
              </a></li>
              <li><a href="https://instagram.com/ito.hakurei" rel="nofollow noopener noreferrer">
                <i class="fab fa-instagram-square" aria-hidden="true"></i><span class="label">Instagram</span>
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="archive">
      {@html p('introduction')}
      <h1 id="class-information">Class Information</h1>
      {@html p('richmond_class')}
      {@html p('community_class')}
      {@html p('what_to_bring')}

      <h1 id="gallery">Gallery</h1>

      <Images {images} gutter={5} />
    </div>
  </div>
</div>
