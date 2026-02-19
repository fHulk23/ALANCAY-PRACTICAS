<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <div class="user-info">
          {{ usuario.nombre }} <span class="user-role">| {{ usuario.cargo }}</span>
        </div>

        <button class="logout-btn" @click="logout">
          Cerrar Sesión 🚪
        </button>
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
      // Limpiamos todo el rastro de la sesión
      localStorage.removeItem("logueado")
      localStorage.removeItem("nombreCompleto")
      localStorage.removeItem("rol")
      
      // Redirigimos al Login
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
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* --- HEADER --- */
.header {
  background-color: #1565c0;
  color: white;
  padding: 15px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between; /* Empuja los elementos a los extremos */
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.user-info {
  font-size: 1.1rem;
  font-weight: 500;
}

.user-role {
  font-weight: 300;
  opacity: 0.9;
}

/* --- BOTÓN CERRAR SESIÓN --- */
.logout-btn {
  background-color: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.7);
  padding: 8px 18px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: white;
  color: #c62828; /* Rojo al pasar el mouse para indicar salida */
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* --- OPCIONES / CARDS --- */
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
  transition: all 0.5s ease;
  overflow: hidden;
}

.option-card:hover {
  width: 55%; /* Efecto de expansión sutil */
}

.overlay {
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.option-card:hover .overlay {
  background: rgba(21, 101, 192, 0.6); /* Tinte azul al hacer hover */
}

.overlay h1 {
  color: white;
  font-size: 2.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .header { padding: 15px 20px; }
  .user-info { font-size: 0.9rem; }
  .options-container { flex-direction: column; }
  .option-card { width: 100%; height: 50%; }
  .option-card:hover { width: 100%; height: 55%; }
}
</style>