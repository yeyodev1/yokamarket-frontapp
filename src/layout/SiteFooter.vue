<script setup lang="ts">
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { copy, site } from '@/config/site'
import { whatsappLink } from '@/utils/whatsapp'

const catalog = useCatalogStore()
const wa = computed(() => whatsappLink(catalog.settings.whatsapp, 'Hola YOKA Market, quiero hacer un pedido.'))
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img src="/wordmark.png" :alt="site.name" width="150" height="52" />
        <p>{{ site.tagline }}</p>
        <p class="footer__muted">Pedidos a domicilio{{ catalog.settings.city ? ` · ${catalog.settings.city}` : '' }}</p>
      </div>
      <div class="footer__col">
        <h4>Encuéntranos</h4>
        <a :href="catalog.settings.instagram || site.instagram" target="_blank" rel="noopener"><i class="fa-brands fa-instagram" /> {{ site.handle }}</a>
        <a v-if="wa" :href="wa" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" /> WhatsApp</a>
        <a v-if="catalog.settings.email" :href="`mailto:${catalog.settings.email}`"><i class="fa-regular fa-envelope" /> {{ catalog.settings.email }}</a>
      </div>
      <div class="footer__col">
        <h4>Puntos de venta</h4>
        <p v-for="p in site.pointsOfSale" :key="p.name + p.place"><i class="fa-solid fa-location-dot" /> {{ p.name }} <span class="footer__muted">· {{ p.place }}</span></p>
      </div>
      <div class="footer__col">
        <h4>Pedidos</h4>
        <RouterLink to="/#catalogo">Catálogo {{ site.catalogYear }}</RouterLink>
        <RouterLink to="/checkout">Finalizar pedido</RouterLink>
        <p class="footer__muted">{{ catalog.settings.deliveryNote }}</p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>{{ copy.footer.rights }}</span>
      <span><i class="fa-solid fa-lock" /> {{ copy.footer.pay }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: 64px;
  background: $white;
  border-top: 1px solid $line;
  &__inner {
    @include container;
    @include flex-cards(200px, 32px);
    padding-block: 48px 32px;
  }
  &__brand {
    flex-basis: 260px;
    img {
      height: 40px;
      width: auto;
      margin-bottom: 12px;
    }
    p {
      font-weight: 500;
    }
  }
  &__col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    h4 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    a,
    p {
      font-size: 14px;
      display: flex;
      gap: 8px;
      align-items: baseline;
    }
    a:hover {
      color: $yellow-deep;
    }
    i {
      width: 16px;
      color: $yellow-deep;
    }
  }
  &__muted {
    color: $muted;
    font-size: 13px;
  }
  &__bottom {
    @include container;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    padding-block: 16px;
    border-top: 1px solid $line;
    font-size: 12px;
    color: $muted;
    i {
      margin-right: 4px;
    }
  }
}
</style>
