<template>
  <div :class="['gov-container', { dark: darkMode }]">

    <!-- Barra superior -->
    <div class="top-bar">
      <button class="back-btn" @click="volver">
        ⬅ Volver
      </button>

      <div class="profile-info">
        <span class="user-name">{{ usuario }}</span>
        <span class="user-role">{{ rol }}</span>
      </div>
      
      <button class="mode-btn" @click="toggleDarkMode">
        {{ darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙" }}
      </button>
    </div>

    <!-- Header -->
    <header class="gov-header">
      <h1>Sistema de Gestión de Expedientes</h1>
      <p>Seleccione un expediente para trabajar</p>
    </header>

    <!-- Cards de expedientes -->
    <div v-if="loading" class="gov-info">
      Cargando expedientes...
    </div>
    <div v-else class="expedientes-grid">
      <div 
        v-for="exp in expedientes" 
        :key="exp.id"
        class="exp-card"
        :class="{ selected: exp.id === expedienteSeleccionado?.id }"
        @click="seleccionarExpediente(exp)"
      >
        <h3>{{ exp.expediente }}</h3>
        <p>{{ exp.consorcio }}</p>
        <p>{{ exp.regional }}</p>
        <p>{{ "Pres. " + exp.presidenteRegional }}</p>
        <p>{{ "Tec. " + exp.representanteTecnico }}</p>
      </div>
    </div>

    <!-- Links del expediente -->
    <div v-if="expedienteSeleccionado" class="gov-card">
      <h2>🔗 Links del Expediente</h2>

      <div class="input-group">
        <label>Link Foto</label>
        <input type="text" v-model="linkFotos" placeholder="https://..." />
        <p v-if="errores.fotos" class="gov-error">{{ errores.fotos }}</p>
      </div>

      <div class="input-group">
        <label>Link PDF Firmado</label>
        <input type="text" v-model="linkPdf" placeholder="https://..." />
        <p v-if="errores.pdf" class="gov-error">{{ errores.pdf }}</p>
      </div>

      <div class="input-group">
        <label>Link Planilla Excel</label>
        <input type="text" v-model="linkExcel" placeholder="https://..." />
        <p v-if="errores.excel" class="gov-error">{{ errores.excel }}</p>
      </div>

      <button class="gov-btn" @click="guardarLinks">
        Guardar Links
      </button>
    </div>

    <footer class="gov-footer">
      <p>© 2026 Ministerio de Gestión Documental</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from "@/service/supabase";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

interface Expediente {
  id: string;
  expediente: string;
  regional: string;
  presidenteRegional: string;
  representanteTecnico: string;
  consorcio: string;
}

// Datos
const usuario = ref("");
const rol = ref("");

const router = useRouter();

onMounted(async () => {
  const logueado = localStorage.getItem("logueado");

  if (!logueado) {
    window.location.href = "/"; // o router.push si preferís
    return;
  }

  usuario.value = localStorage.getItem("nombreCompleto") || "";
  rol.value = localStorage.getItem("rol") || "";

  await cargarExpedientes();
});

const darkMode = ref(false);
const toggleDarkMode = () => { darkMode.value = !darkMode.value; };

const expedientes = ref<Expediente[]>([]);
const loading = ref(false);

const cargarExpedientes = async () => {
  loading.value = true;

  const { data, error } = await supabase
    .from("expedientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando expedientes:", error);
    loading.value = false;
    return;
  }

  expedientes.value = data.map((o: any) => ({
    id: o.id,
    expediente: o.NroExpediente,
    regional: o.Regional,
    presidenteRegional: o.PresidenteRegional,
    representanteTecnico: o.RepresentanteTecnico,
    consorcio: o.Consorcio
  }));

  loading.value = false;
};

const expedienteSeleccionado = ref<Expediente | null>(null);

// Manejo de selección de tarjeta
const seleccionarExpediente = (exp: Expediente) => {
  expedienteSeleccionado.value = exp;
};

const linkFotos = ref("");
const linkPdf = ref("");
const linkExcel = ref("");

const errores = ref({
  fotos: "",
  pdf: "",
  excel: ""
});

const esURLValida = (url: string) => {
  const pattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm;
  return pattern.test(url);
};

const guardarLinks = async () => {
  errores.value = { fotos: "", pdf: "", excel: "" };

  if (linkFotos.value && !esURLValida(linkFotos.value)) errores.value.fotos = "Link fotos inválido.";
  if (linkPdf.value && !esURLValida(linkPdf.value)) errores.value.pdf = "Link PDF inválido.";
  if (linkExcel.value && !esURLValida(linkExcel.value)) errores.value.excel = "Link Excel inválido.";

  if (errores.value.fotos || errores.value.pdf || errores.value.excel) return;
  if (!expedienteSeleccionado.value) return alert("Por favor, selecciona un expediente primero.");

  loading.value = true;
  
  try {
    const { error } = await supabase
      .from("obras")
      .insert([
        {
          expediente: expedienteSeleccionado.value.expediente,
          regional: expedienteSeleccionado.value.regional,
          presidente_regional: expedienteSeleccionado.value.presidenteRegional,
          representante_tecnico: expedienteSeleccionado.value.representanteTecnico,
          consorcio: expedienteSeleccionado.value.consorcio,
          fotos: linkFotos.value,
          pdf: linkPdf.value,
          excel: linkExcel.value,
          inspector: usuario.value // Aprovechamos el nombre del usuario logueado
        }
      ]);

    if (error) throw error;

    // 3. Limpiar el formulario para un nuevo ingreso
    limpiarFormulario();

    volver();
  } catch (err) {
    console.error("Error al insertar:", err);
    alert("Error al intentar guardar la obra.");
  } finally {
    loading.value = false;
  }
};

// Función para resetear campos
const limpiarFormulario = () => {
  expedienteSeleccionado.value = null;
  linkFotos.value = "";
  linkPdf.value = "";
  linkExcel.value = "";
};

const volver = () => {
  router.push("/Home"); 
};
</script>

<style scoped>
/* --- CONTENEDOR PRINCIPAL --- */
.gov-container {
  max-width: 950px;
  width: 95%;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  background-color: #f4f6f8;
  color: #333; /* Texto oscuro por defecto */
}

/* --- BARRA SUPERIOR (Layout de 3 columnas) --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative; /* Base para el centrado del perfil */
  min-height: 50px;
}

/* Perfil centrado en el medio de la pantalla */
.profile-info { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.user-name { font-weight: bold; font-size: 0.95em; color: #333; }
.user-role { 
  background: #1a3e7a; 
  color: white; 
  padding: 2px 10px; 
  border-radius: 12px; 
  font-size: 0.75em; 
}

/* Botones laterales */
.back-btn {
  background-color: transparent;
  color: #1a3e7a;
  border: 2px solid #1a3e7a;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-btn:hover {
  background-color: #1a3e7a;
  color: white;
  transform: translateX(-3px);
}

.mode-btn { 
  background: #444; 
  color: white; 
  border: none; 
  padding: 8px 14px; 
  border-radius: 20px; 
  cursor: pointer; 
  z-index: 10;
}

/* --- HEADER --- */
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

/* --- GRID Y CARDS --- */
.expedientes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
  width: 100%;
}

.exp-card {
  background: white;
  border-left: 6px solid #1a3e7a;
  border-radius: 8px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  text-align: center;
  color: #333;
}

.exp-card:hover { transform: translateY(-5px); box-shadow: 0 8px 18px rgba(0,0,0,0.2); }
.exp-card.selected { background: #e0f0ff; border-left-color: #007bff; color: #1a3e7a; }

/* --- FORMULARIO Y LINKS --- */
.gov-card {
  background: white;
  border-left: 6px solid #1a3e7a;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label { font-weight: bold; margin-bottom: 5px; color: #333; }
.input-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  background: white;
}

.gov-btn { 
  background-color: #1a3e7a; 
  color: white; 
  padding: 10px 20px; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-weight: bold;
}
.gov-btn:hover { background-color: #16325c; }

/* --- MENSAJES Y FOOTER --- */
.gov-error { color: #d32f2f; font-weight: bold; font-size: 0.85em; margin-top: 4px; }
.gov-info { color: #1a3e7a; font-weight: bold; }
.gov-footer { text-align: center; font-size: 0.9em; color: #555; margin-top: 30px; width: 100%; }

/* --- MODO OSCURO (Overrides) --- */
.dark { background-color: #1e1e1e; color: #f1f1f1; }

.dark .user-name { color: #f1f1f1; }
.dark .back-btn { color: #f1f1f1; border-color: #f1f1f1; }
.dark .back-btn:hover { background-color: #f1f1f1; color: #1e1e1e; }

.dark .gov-card, .dark .exp-card { 
  background: #2c2c2c; 
  border-left-color: #4e8cff; 
  color: #f1f1f1; 
}

.dark .exp-card.selected { background: #004a99; color: white; }

.dark input { 
  background: #333; 
  color: white; 
  border: 1px solid #555; 
}

.dark .input-group label { color: #f1f1f1; }
.dark .gov-header { background-color: #111; }
.dark .gov-footer { color: #aaa; }

/* --- RESPONSIVE --- */
@media (max-width: 700px) {
  .top-bar { flex-direction: row; justify-content: space-between; }
  .profile-info { 
    position: static; 
    transform: none; 
    order: 3; 
    width: 100%; 
    margin-top: 15px; 
  }
  .exp-card { width: 100%; }
}
</style>