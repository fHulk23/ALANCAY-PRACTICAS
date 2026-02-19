<template>
  <div :class="['obras-container', { 'dark-mode': darkMode }]">
    <div class="top-bar">
      <button class="back-btn" @click="volver">
        ⬅ Volver
      </button>

      <h1 class="title">Listado de Obras</h1>

      <button class="toggle-btn" @click="toggleDarkMode">
        {{ darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙" }}
      </button>
    </div>

    <div class="filters">
      <input
        type="text"
        v-model="filtroBusqueda"
        placeholder="Buscar por expediente, inspector o consorcio..."
      />

      <select v-model="filtroRegion">
        <option value="">Todas las regionales</option>
        <option v-for="reg in regionalesUnicas" :key="reg" :value="reg">
          {{ reg }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Cargando inspecciones...</div>
    <div v-else-if="!loading && obrasFiltradas.length === 0" class="no-results">
      No se encontró ninguna inspección con el dato filtrado.
    </div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Periodo</th> <th>N° Expediente</th>
            <th>Inspector</th>
            <th>Presidente Regional</th>
            <th>Representante Técnico</th>
            <th>Consorcio</th>
            <th>Regional</th>
            <th>Fotos</th>
            <th>PDF / Excel</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="obra in obrasFiltradas" :key="obra.id">
            <td class="periodo-tag">{{ obra.periodo }}</td> <td>{{ obra.expediente }}</td>
            <td>{{ obra.inspector }}</td>
            <td>{{ obra.presidenteRegional }}</td>
            <td>{{ obra.representanteTecnico }}</td>
            <td>{{ obra.consorcio }}</td>
            <td>{{ obra.regional }}</td>

            <td>
              <button class="btn-primary" @click="openModal(obra.fotos)">Ver Fotos</button>
            </td>

            <td>
              <button class="btn-success" @click="descargarExcel(obra)">Excel</button>
              <button class="btn-danger" @click="descargarPdf(obra)">PDF</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Fotos de la Obra</h3>

        <div class="modal-images">
          <img v-for="(foto, index) in fotosSeleccionadas" :key="index" :src="foto" />
        </div>

        <button class="btn-close" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "../service/supabase";
export default {
  name: "Obras",
  data() {
    return {
      darkMode: false,
      showModal: false,
      fotosSeleccionadas: [],
      filtroBusqueda: "",
      filtroRegion: "",
      obras: [],
      loading: false,
    };
  },
  async mounted() {
    await this.cargarObras();
  },
  methods: {
    volver() {
      this.$router.push("/Home");
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    openModal(fotos) {
      this.fotosSeleccionadas = fotos;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    descargarExcel(obra) {
      window.open(obra.excel, "_blank");
    },
    descargarPdf(obra) {
      window.open(obra.pdf, "_blank");
    },
    // Función auxiliar para formatear el periodo
    formatearPeriodo(fechaIso) {
      if (!fechaIso) return "N/A";
      const fecha = new Date(fechaIso);
      const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      return `${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
    },
    async cargarObras() {
      this.loading = true;

      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando obras:", error);
        this.loading = false;
        return;
      }

      this.obras = data.map((o) => ({
        id: o.id,
        periodo: this.formatearPeriodo(o.created_at), // Generamos el periodo aquí
        expediente: o.expediente,
        inspector: o.inspector,
        presidenteRegional: o.presidente_regional,
        representanteTecnico: o.representante_tecnico,
        consorcio: o.consorcio,
        regional: o.regional,
        fotos: o.fotos ? o.fotos.split(",") : [],
        excel: o.excel,
        pdf: o.pdf,
      }));

      this.loading = false;
    },
  },
  computed: {
    regionalesUnicas() {
      return [...new Set(this.obras.map((o) => o.regional))];
    },
    obrasFiltradas() {
      return this.obras.filter((obra) => {
        const texto = this.filtroBusqueda.toLowerCase();

        const coincideBusqueda =
          obra.expediente.toLowerCase().includes(texto) ||
          obra.inspector.toLowerCase().includes(texto) ||
          obra.presidenteRegional.toLowerCase().includes(texto) ||
          obra.representanteTecnico.toLowerCase().includes(texto) ||
          obra.consorcio.toLowerCase().includes(texto) ||
          obra.regional.toLowerCase().includes(texto) ||
          obra.periodo.toLowerCase().includes(texto); // También filtramos por periodo

        const coincideRegional = this.filtroRegion === "" || obra.regional === this.filtroRegion;

        return coincideBusqueda && coincideRegional;
      });
    },
  },
};
</script>

<style scoped>
/* --- ESTILOS ANTERIORES SE MANTIENEN IGUAL --- */
.obras-container {
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  background-color: #f4f6f9;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 15px;
  position: relative;
  min-height: 60px;
}

.title {
  margin: 0;
  color: #1565c0;
  font-size: 1.8rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.back-btn {
  background-color: transparent;
  color: #1565c0;
  border: 2px solid #1565c0;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-btn:hover {
  background-color: #1565c0;
  color: white;
  transform: translateX(-3px);
}

.toggle-btn {
  background-color: #333;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  z-index: 10;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 250px;
  background-color: white;
  color: #333;
  font-size: 14px;
  outline: none;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px; /* Un poco más ancho por la nueva columna */
}

thead {
  background-color: #1565c0;
  color: white;
}

th {
  font-weight: 600;
  padding: 18px 15px;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
  color: #444;
  font-size: 14px;
}

/* Estilo para resaltar el periodo */
.periodo-tag {
  font-weight: bold;
  color: #1565c0;
}

.dark-mode .periodo-tag {
  color: #448aff;
}

tbody tr:hover {
  background-color: #f8fbff;
}

.btn-primary { background-color: #1565c0; color: white; }
.btn-success { background-color: #2e7d32; color: white; }
.btn-danger { background-color: #c62828; color: white; }
.btn-close { background-color: #444; color: white; margin-top: 20px; width: 100%; padding: 12px; }

button:not(.back-btn, .toggle-btn) {
  padding: 8px 14px;
  margin: 3px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.2s ease;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 80%;
  max-width: 1000px;
  max-height: 85vh;
  overflow-y: auto;
  color: #333;
}

.modal-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.modal-images img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.loading, .no-results {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #1565c0;
  background: white;
  border-radius: 12px;
  margin-top: 20px;
}

.dark-mode {
  background-color: #121212;
  color: #f1f1f1;
}

.dark-mode .top-bar { border-color: #333; }
.dark-mode .title { color: #448aff; }
.dark-mode .back-btn { color: #448aff; border-color: #448aff; }
.dark-mode .back-btn:hover { background-color: #448aff; color: #121212; }
.dark-mode .filters input, .dark-mode .filters select { background-color: #1e1e1e; color: #f1f1f1; border: 1px solid #444; }
.dark-mode .table-container { background-color: #1e1e1e; border: 1px solid #333; }
.dark-mode td { border-bottom: 1px solid #333; color: #ccc; }
.dark-mode tbody tr:hover { background-color: #252525; }
.dark-mode .modal { background-color: #1e1e1e; color: #f1f1f1; }
.dark-mode .toggle-btn { background-color: #f1f1f1; color: #121212; }

@media (max-width: 850px) {
  .title { position: static; transform: none; order: 2; font-size: 1.4rem; }
  .top-bar { flex-wrap: wrap; justify-content: space-between; }
  .back-btn { order: 1; }
  .toggle-btn { order: 3; }
  .filters input, .filters select { min-width: 100%; }
}
</style>