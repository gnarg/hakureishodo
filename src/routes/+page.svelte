<script>
// @ts-nocheck

  import { I18n } from 'i18n-js';
  import { marked } from 'marked';
  import { Images } from "svelte-images";
  // import { page } from '$app/stores';

  export let data;

  let i18n = new I18n(data.translations);

  const urlParams = new URLSearchParams(window.location.search);
  let lang = (urlParams.has('lang')) ? urlParams.get('lang') : 'en';
  // let lang = $page.url.searchParams.get("lang")
  // $: { lang };
  i18n.locale = lang || 'en';

  let p = (key) => marked.parse(i18n.t(key));

  let handleImage = (e) => {
    console.log(e);
  }

  const images = [
    { 
      src: '/images/IMG_7932.jpeg',
      thumbnail: '/images/thumb-IMG_7932.jpeg',
    },
    {
      src: '/images/IMG_7933.png',
      thumbnail: '/images/thumb-IMG_7933.png',
    },
    {
      src: '/images/IMG_7935.png',
      thumbnail: '/images/thumb-IMG_7935.png',
    },
    { 
      src: '/images/IMG_0572.jpeg',
      thumbnail: '/images/thumb-IMG_0572.jpeg',
    },
    { 
      src: '/images/fans.jpg',
      thumbnail: '/images/thumb-fans.jpg',
    },
    { 
      src: '/images/IMG_1289.jpeg',
      thumbnail: '/images/thumb-IMG_1289.jpeg',
    },
    { 
      src: '/images/IMG_8700.jpeg',
      thumbnail: '/images/thumb-IMG_8700.jpeg',
    },
    { 
      src: '/images/IMG_8701.png',
      thumbnail: '/images/thumb-IMG_8701.png',
    },
    { 
      src: '/images/IMG_8702.png',
      thumbnail: '/images/thumb-IMG_8702.png',
    },
    { 
      src: '/images/IMG_1150.jpeg',
      thumbnail: '/images/thumb-IMG_1150.jpeg',
    },
    { 
      src: '/images/IMG_1155.jpeg',
      thumbnail: '/images/thumb-IMG_1155.jpeg',
    },
    { 
      src: '/images/IMG_5902.jpeg',
      thumbnail: '/images/thumb-IMG_5902.jpeg',
    },
    { 
      src: '/images/new-IMG_1707.JPG',
      thumbnail: '/images/thumb-new-IMG_1707.JPG',
    },
    { 
      src: '/images/new-IMG_1602.JPG',
      thumbnail: '/images/thumb-new-IMG_1602.JPG',
    },
    { 
      src: '/images/new-IMG_1479.JPG',
      thumbnail: '/images/thumb-new-IMG_1479.JPG',
    },
    { 
      src: '/images/new-IMG_9988.JPG',
      thumbnail: '/images/thumb-new-IMG_9988.JPG',
    },
    { 
      src: '/images/new-IMG_1370.JPG',
      thumbnail: '/images/thumb-new-IMG_1370.JPG',
    },
    { 
      src: '/images/new-IMG_9311.JPG',
      thumbnail: '/images/thumb-new-IMG_9311.JPG',
    },
  ];
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
                  <a data-sveltekit-reload href="/?lang=ja">日本語</a>
                </li>
                <li class="masthead__menu-item">
                  <a data-sveltekit-reload href="/?lang=en">English</a>
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
