<template>
  <div class="container">
    <div 
      v-for="item in botones" 
      :key="item" 
      class="card-boton"
    >
      <span class="titulo">{{ item }}</span>
    </div>
  </div>
</template>

<script setup>
const botones = [
  "Regionales",
  "Consorcios",
  "Representantes",
  "Técnicos"
]
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 80px 20px;
  background-color: #f4f6f9;
  flex-wrap: wrap;
}

/* Botón estilo corporativo */
.card-boton {
  background: #ffffff;
  width: 220px;
  height: 120px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Texto */
.titulo {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
  letter-spacing: 0.5px;
}

/* Hover corporativo elegante */
.card-boton:hover {
  transform: translateY(-6px);
  border: 2px solid #1e3a8a;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.card-boton:hover .titulo {
  color: #1e3a8a;
}
</style>
