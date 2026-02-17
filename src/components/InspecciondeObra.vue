<template>
  <div class="gov-container">
    <header class="gov-header">
      <h1>Sistema de Gestión de Expedientes</h1>
      <p>Suba fotos y PDF firmados del mes</p>
    </header>

    <!-- Recuadro Fotos -->
    <div class="gov-card">
      <h2>📸 Fotos Firmadas (1 - 5)</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        @change="handleImages"
      />
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
      <input
        type="file"
        accept="application/pdf"
        @change="handlePDF"
      />
      <p v-if="pdfName" class="gov-info">Archivo seleccionado: {{ pdfName }}</p>
    </div>

    <!-- Recuadro Excel -->
    <div class="gov-card">
      <h2>📊 Descargar Excel de Expediente</h2>
      <div class="gov-excel-input">
        <label>Nro de Expediente:</label>
        <input
          type="text"
          v-model="expediente"
          placeholder="Ingrese Nro de Expediente"
        />
      </div>
      <button class="gov-btn" @click="downloadExcel">
        Descargar Excel
      </button>
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
  images.value = files.map(file => ({
    file,
    url: URL.createObjectURL(file)
  }));
};

const handlePDF = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const file = target.files[0];

  if (file.type !== "application/pdf") {
    alert("Solo se permiten archivos PDF");
    return;
  }

  pdfName.value = file.name;
};

const downloadExcel = () => {
  if (!expediente.value) {
    alert("Debe ingresar el número de expediente");
    return;
  }

  const data = [
    {
      "Nro de Expediente": expediente.value,
      "Cantidad de Fotos": images.value.length,
      "PDF Subido": pdfName.value || "No"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream"
  });

  saveAs(blob, "reporte_expediente.xlsx");
};
</script>

<style scoped>
/* Contenedor general */
.gov-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f8;
}

/* Header estilo gubernamental */
.gov-header {
  text-align: center;
  background-color: #1a3e7a;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.gov-header h1 {
  margin: 0;
  font-size: 1.8em;
}

.gov-header p {
  margin: 5px 0 0 0;
  font-size: 1em;
  color: #d0d8ea;
}

/* Tarjetas / Recuadros */
.gov-card {
  background: white;
  border-left: 6px solid #1a3e7a;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
}

/* Previews de fotos */
.gov-preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.gov-preview-box {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 4px;
}

.gov-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Inputs */
.gov-excel-input {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.gov-excel-input input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Botón estilo institucional */
.gov-btn {
  background-color: #1a3e7a;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.gov-btn:hover {
  background-color: #16325c;
}

/* Mensajes */
.gov-error {
  color: red;
  font-weight: bold;
}

.gov-info {
  color: #1a3e7a;
  font-weight: bold;
}

/* Footer */
.gov-footer {
  text-align: center;
  font-size: 0.9em;
  color: #555;
  margin-top: 30px;
}
</style>
