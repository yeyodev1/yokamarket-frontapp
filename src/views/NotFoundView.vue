<template>
  <div class="nf">
    <span class="nf__code">404</span>
    <h1>Esa página no existe</h1>
    <p>Pero el catálogo sí, y está delicioso.</p>
    <RouterLink to="/" class="btn btn--yellow">Ir al inicio</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.nf {
  @include container(600px);
  padding-block: 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  &__code {
    font-family: $font-head;
    font-weight: 800;
    font-size: 72px;
    color: $yellow;
    line-height: 1;
  }
  p {
    color: $ink-soft;
    margin-bottom: 8px;
  }
}
</style>
