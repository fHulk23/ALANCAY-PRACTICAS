<template>
  <div :class="['gov-container', { dark: darkMode }]">

    <!-- Barra superior: perfil + modo oscuro -->
    <div class="top-bar">
      <div class="profile-info">
        <span class="user-name">{{ usuario }}</span>
        <span class="user-role">{{ rol }}</span>
        <button class="logout-btn" @click="cerrarSesion">Cerrar sesión</button>
      </div>

      <button class="mode-btn" @click="toggleDarkMode">
        {{ darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙" }}
      </button>
    </div>

    <!-- Header principal -->
    <header class="gov-header">
      <h1>Sistema de Gestión de Expedientes</h1>
      <p>Suba fotos y PDF firmados del mes</p>
    </header>

    <!-- Recuadro Fotos -->
    <div class="gov-card">
      <h2>📸 Fotos Firmadas (1 - 5)</h2>
      <input type="file" accept="image/*" multiple @change="handleImages" />
      <p v-if="imageError" class="gov-error">{{ imageError }}</p>

      <div class="gov-preview">
        <div v-for="(img, index) in images" :key="index" class="gov-preview-box">
          <img :src="img.url" />
        </div>
      </div>
    </div>

    <!-- Recuadro PDF -->
    <div class="gov-card">
      <h2>📄 PDF Firmado del Mes</h2>
      <input type="file" accept="application/pdf" @change="handlePDF" />
      <p v-if="pdfName" class="gov-info">Archivo seleccionado: {{ pdfName }}</p>
    </div>

    <!-- Línea única: Expediente + Obra + Excel -->
    <div class="gov-card">
      <h2>📊 Generar Planilla</h2>
      <div class="gov-line">
        <input v-model="expediente" placeholder="Nro Expediente" />
        <input v-model="obra" placeholder="Nombre de Obra" />
        <button class="gov-btn" @click="downloadExcel">Descargar Excel</button>
      </div>
    </div>

    <footer class="gov-footer">
      <p>© 2026 Ministerio de Gestión Documental</p>
    </footer>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ImageFile {
  file: File;
  url: string;
}

const images = ref<ImageFile[]>([]);
const imageError = ref("");
const pdfName = ref("");
const expediente = ref("");
const obra = ref("");

const usuario = ref("Juan Pérez");
const rol = ref("Inspector");
const darkMode = ref(false);

const toggleDarkMode = () => { darkMode.value = !darkMode.value };
const cerrarSesion = () => { alert("Sesión cerrada") };

const handleImages = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  if (files.length < 1 || files.length > 5) {
    imageError.value = "Debe subir mínimo 1 y máximo 5 imágenes.";
    images.value = [];
    return;
  }
  imageError.value = "";
  images.value = files.map(file => ({ file, url: URL.createObjectURL(file) }));
};

const handlePDF = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  const file = target.files[0];
  if (file.type !== "application/pdf") { alert("Solo se permiten archivos PDF"); return; }
  pdfName.value = file.name;
};

const downloadExcel = () => {
  if (!expediente.value || !obra.value) { alert("Debe completar expediente y obra"); return; }
  const data = [{
    "Nro de Expediente": expediente.value,
    "Obra": obra.value,
    "Cantidad de Fotos": images.value.length,
    "PDF Subido": pdfName.value || "No"
  }];
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Expediente_${expediente.value}.xlsx`);
};
</script>

<style scoped>
/* Contenedor general centrado */
.gov-container {
  max-width: 900px;
  width: 95%;
  margin: auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

/* Barra superior */
.top-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.user-name { font-weight: bold; }
.user-role {
  background: #1a3e7a;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}
.logout-btn {
  background: #b02a37;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.mode-btn {
  background: #444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 5px;
}

/* Header */
.gov-header {
  text-align: center;
  background-color: #1a3e7a;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
}
.gov-header h1 { margin: 0; font-size: 1.8em; }
.gov-header p { margin: 5px 0 0 0; font-size: 1em; color: #d0d8ea; }

/* Tarjetas */
.gov-card {
  background: white;
  border-left: 6px solid #1a3e7a;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

/* Previews */
.gov-preview { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.gov-preview-box { width: 100px; height: 100px; border: 1px solid #ccc; overflow: hidden; border-radius: 4px; }
.gov-preview-box img { width: 100%; height: 100%; object-fit: cover; }

/* Línea única */
.gov-line { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.gov-line input { flex: 1 1 150px; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; }

/* Botón */
.gov-btn { background-color: #1a3e7a; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.gov-btn:hover { background-color: #16325c; }

/* Mensajes */
.gov-error { color: red; font-weight: bold; }
.gov-info { color: #1a3e7a; font-weight: bold; }

/* Footer */
.gov-footer { text-align: center; font-size: 0.9em; color: #555; margin-top: 30px; width: 100%; }

/* Modo oscuro */
.dark { background-color: #1e1e1e; color: #f1f1f1; }
.dark .gov-card { background: #2c2c2c; border-left-color: #4e8cff; }
.dark .gov-header { background-color: #111; }
.dark input { background: #333; color: white; border: 1px solid #555; }

/* Responsive: móviles */
@media (max-width: 600px) {
  .gov-container { padding: 10px; }
  .gov-line { flex-direction: column; }
  .mode-btn { margin-top: 10px; }
}
</style>

