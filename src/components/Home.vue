<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <div class="user-info">
          {{ usuario.nombre }} ({{ usuario.cargo }})
        </div>
      </div>
    </header>

    <div class="options-container">
      
      <div 
        class="option-card"
        @click="goTo('InspecciondeObra')"
        :style="{ backgroundImage: `url('https://quickapp.es/wp-content/uploads/2020/06/2020-01-13-13_29_09-Start-1024x645-1.jpg')` }"
      >
        <div class="overlay">
          <h1>Inspección de Obra</h1>
        </div>
      </div>

      <div 
        class="option-card"
        @click="goTo('Obras')"
        :style="{ backgroundImage: `url('https://prensa.cba.gov.ar/wp-content/uploads/2023/03/Circunvalacion-Sur-Avanzan-las-obras-en-los-distribuidores-San-Carlos-1.jpg')` }"
      >
        <div class="overlay">
          <h1>Obras</h1>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      usuario: {
        nombre: "",
        cargo: ""
      }
    };
  },

  mounted() {
    const logueado = localStorage.getItem("logueado")

    if (!logueado) {
      this.$router.push("/")
      return
    }

    this.usuario.nombre = localStorage.getItem("nombreCompleto")
    this.usuario.cargo = localStorage.getItem("rol")
  },

  methods: {
    goTo(routeName) {
      this.$router.push({ name: routeName });
    },

    logout() {
      localStorage.removeItem("logueado")
      localStorage.removeItem("nombreCompleto")
      localStorage.removeItem("rol")
      this.$router.push("/")
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header {
  background-color: #1565c0;
  color: white;
  padding: 15px 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
}

.user-info {
  font-weight: bold;
}

/* OPCIONES */
.options-container {
  flex: 1;
  display: flex;
}

.option-card {
  width: 50%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.option-card:hover {
  transform: scale(1.02);
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay h1 {
  color: white;
  font-size: 2rem;
}
</style>
