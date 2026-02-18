<template>
  <div :class="['obras-container', { 'dark-mode': darkMode }]">

    <div class="top-bar">
        <h1 class="title">Listado de Obras</h1>
        <button class="toggle-btn" @click="toggleDarkMode">
            {{ darkMode ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙' }}
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
            <option 
                v-for="reg in regionalesUnicas" 
                :key="reg" 
                :value="reg"
            >
                {{ reg }}
            </option>
        </select>
    </div>


    <div class="table-container">
      <table>
        <thead>
            <tr>
                <th>N° Expediente</th>
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
                <td>{{ obra.expediente }}</td>
                <td>{{ obra.inspector }}</td>
                <td>{{ obra.presidenteRegional }}</td>
                <td>{{ obra.representanteTecnico }}</td>
                <td>{{ obra.consorcio }}</td>
                <td>{{ obra.regional }}</td>

                <td>
                    <button class="btn-primary" @click="openModal(obra.fotos)">
                    Ver Fotos
                    </button>
                </td>

                <td>
                    <button class="btn-success" @click="descargarExcel(obra)">
                    Excel
                    </button>
                    <button class="btn-danger" @click="descargarPdf(obra)">
                    PDF
                    </button>
                </td>
            </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Fotos -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Fotos de la Obra</h3>

        <div class="modal-images">
          <img
            v-for="(foto, index) in fotosSeleccionadas"
            :key="index"
            :src="foto"
          />
        </div>

        <button class="btn-close" @click="closeModal">
          Cerrar
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Obras",
  data() {
    return {
      darkMode: false,
      showModal: false,
      fotosSeleccionadas: [],
      filtroBusqueda: "",
      filtroRegion: "",
      obras: [
        {
            id: 1,
            expediente: "EXP-001",
            inspector: "Agustin Gimenez",
            presidenteRegional: "Carlos Fernandez",
            representanteTecnico: "Ing. Mariana Lopez",
            consorcio: "12 - Consorcio Centro",
            regional: "01 - Regional Norte",
            fotos: [
            "https://www.argentina.gob.ar/sites/default/files/san-roque1.jpeg"
            ]
        },
        {
            id: 2,
            expediente: "EXP-002",
            inspector: "Juan Perez",
            presidenteRegional: "Luis Martinez",
            representanteTecnico: "Ing. Pablo Suarez",
            consorcio: "08 - Consorcio Sur",
            regional: "02 - Regional Sur",
            fotos: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIBBv2tP_m8PTkUTqNZQ7hUizpD-xxom6A8A&s"
            ]
        }
        ]
    };
  },
  methods: {
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
      alert("Descargando Excel de " + obra.expediente);
    },
    descargarPdf(obra) {
      alert("Descargando PDF de " + obra.expediente);
    }
  },
  computed: {
    regionalesUnicas() {
    return [...new Set(this.obras.map(o => o.regional))];
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
            obra.regional.toLowerCase().includes(texto);

        const coincideRegional =
            this.filtroRegion === "" ||
            obra.regional === this.filtroRegion;

        return coincideBusqueda && coincideRegional;
        });
    }
    }
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 220px;
}

.dark-mode .filters input,
.dark-mode .filters select {
  background-color: #2c2c2c;
  color: white;
  border: 1px solid #555;
}

.obras-container {
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  background-color: #f4f6f9;
  transition: background-color 0.3s, color 0.3s;
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.title {
  margin: 0;
}

.toggle-btn {
  background-color: #333;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.toggle-btn:hover {
  opacity: 0.85;
}

/* Tabla */
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: background-color 0.3s;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #1565c0;
  color: white;
}

th {
  font-weight: 600;
  padding: 15px;
}

td {
  padding: 15px;
  text-align: center;
}

tbody tr {
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

/* Botones */
button {
  padding: 6px 12px;
  margin: 3px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #1565c0;
  color: white;
}

.btn-success {
  background-color: #2e7d32;
  color: white;
}

.btn-danger {
  background-color: #c62828;
  color: white;
}

.btn-close {
  background-color: #444;
  color: white;
  margin-top: 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 70%;
  max-height: 80vh;
  overflow-y: auto;
  transition: background-color 0.3s;
}

.modal h3 {
  margin-top: 0;
}

.modal-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
}

.modal-images img {
  width: 200px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.modal-images img:hover {
  transform: scale(1.05);
}

/* ========================= */
/* DARK MODE */
/* ========================= */

.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-mode .table-container {
  background-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.dark-mode table {
  color: #e0e0e0;
}

.dark-mode thead {
  background-color: #0d47a1;
}

.dark-mode tbody tr:hover {
  background-color: #2c2c2c;
}

.dark-mode .modal {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark-mode .toggle-btn {
  background-color: #e0e0e0;
  color: #121212;
}

/* ========================= */
/* RESPONSIVE */
/* ========================= */

@media (max-width: 768px) {

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  th, td {
    padding: 10px;
    font-size: 13px;
  }

  .modal {
    width: 90%;
  }

  .modal-images img {
    width: 100%;
  }
}

</style>
