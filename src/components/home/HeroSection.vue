<script setup lang="ts">
import { copy, site } from '@/config/site'
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__text">
        <span class="eyebrow">Catálogo {{ site.catalogYear }} · Pedidos a domicilio</span>
        <h1>Tu despensa <em>saludable</em>, llena de sabor.</h1>
        <p class="hero__sub">{{ site.sub }}</p>
        <div class="hero__cta">
          <a href="#catalogo" class="btn btn--primary">{{ copy.hero.cta }} <i class="fa-solid fa-arrow-down" /></a>
          <a href="#como-funciona" class="btn btn--ghost">{{ copy.hero.secondary }}</a>
        </div>
        <ul class="hero__pills">
          <li v-for="p in copy.hero.pills" :key="p"><i class="fa-solid fa-check" /> {{ p }}</li>
        </ul>
      </div>
      <div class="hero__art" aria-hidden="true">
        <div class="hero__photo">
          <img src="/products/hero-1.jpg" alt="" width="640" height="800" fetchpriority="high" />
        </div>
        <div class="hero__disc">
          <img src="/logo-512.png" alt="" width="320" height="320" />
        </div>
        <div class="hero__card hero__card--a">
          <i class="fa-solid fa-snowflake" />
          <div><strong>Congelados</strong><span>Listos en minutos</span></div>
        </div>
        <div class="hero__card hero__card--b">
          <i class="fa-solid fa-ice-cream" />
          <div><strong>Sweet Bites</strong><span>Sin azúcar añadida</span></div>
        </div>
        <div class="hero__card hero__card--c">
          <i class="fa-solid fa-leaf" />
          <div><strong>YOKA Green</strong><span>Jugos prensados</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(60% 60% at 100% 0%, rgba($yellow, 0.22), transparent 70%),
    linear-gradient(180deg, $cream 0%, $cream 100%);
  &__inner {
    @include container;
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding-block: 48px 56px;
    @include from(md) {
      flex-direction: row;
      align-items: center;
      gap: 48px;
      padding-block: 72px 80px;
    }
  }
  &__text {
    flex: 1 1 55%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    h1 {
      font-size: clamp(38px, 6.5vw, 66px);
      font-weight: 800;
      letter-spacing: -0.03em;
      max-width: 12ch;
      em {
        font-style: normal;
        position: relative;
        display: inline-block;
        z-index: 0;
        &::after {
          content: '';
          position: absolute;
          left: -2%;
          right: -2%;
          bottom: 8%;
          height: 32%;
          background: $yellow;
          border-radius: 4px;
          z-index: -1;
          transform: rotate(-1.2deg);
        }
      }
    }
  }
  &__sub {
    font-size: clamp(16px, 2vw, 19px);
    color: $ink-soft;
    max-width: 52ch;
  }
  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 6px;
  }
  &__pills {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    color: $ink-soft;
    i {
      color: $green;
      margin-right: 4px;
    }
  }
  &__art {
    flex: 1 1 45%;
    position: relative;
    min-height: 300px;
    display: grid;
    place-items: center;
    @include from(md) {
      min-height: 420px;
    }
  }
  &__photo {
    width: min(380px, 82%);
    aspect-ratio: 4 / 5;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-lg;
    transform: rotate(-2deg);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__disc {
    position: absolute;
    width: 112px;
    aspect-ratio: 1;
    left: 2%;
    bottom: 4%;
    border-radius: 50%;
    box-shadow: 0 18px 40px rgba($yellow-deep, 0.35);
    animation: float 7s ease-in-out infinite;
    border: 4px solid $cream;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    @include from(md) {
      width: 140px;
      left: 0;
      bottom: 8%;
    }
  }
  &__card {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 16px;
    background: $white;
    box-shadow: $shadow;
    font-size: 13px;
    i {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      background: $yellow-soft;
      color: $yellow-deep;
      font-size: 15px;
    }
    div {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
    }
    strong {
      font-family: $font-head;
      font-size: 14px;
    }
    span {
      color: $muted;
    }
    &--a {
      top: 4%;
      left: -2%;
      animation: float 6s ease-in-out infinite 0.4s;
    }
    &--b {
      bottom: 8%;
      right: 0;
      animation: float 8s ease-in-out infinite 1s;
      i {
        background: $kraft-soft;
        color: $kraft;
      }
    }
    &--c {
      top: 42%;
      right: -2%;
      animation: float 7s ease-in-out infinite 0.8s;
      i {
        background: $green-soft;
        color: $green;
      }
    }
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
