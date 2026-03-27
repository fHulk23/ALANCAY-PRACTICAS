<template>
  <div :class="['gov-container', { dark: darkMode }]">

    
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

    
    <header class="gov-header">
      <h2>✏️ Editar Obra</h2>
    </header>

    
    <div v-if="loading" class="gov-info">
      Cargando expedientes...
    </div>
    <div v-else class="expedientes-grid">
      <div 
        v-for="exp in expedientes" 
        :key="exp.id"
        class="exp-card"
        :class="{ selected: exp.id === expedienteSeleccionado?.id }"
      >
        <h3>{{ exp.expediente }}</h3>
        <p>{{ exp.consorcio }}</p>
        <p>{{ exp.regional }}</p>
        <p>{{ "Pres. " + exp.presidenteRegional }}</p>
        <p>{{ "Tec. " + exp.representanteTecnico }}</p>
      </div>
    </div>

    
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getExpedientes, getObras, updateObra } from "@/service/obrasServices";

const route = useRoute();
const obraId = route.params.id as string;

interface Expediente {
  id: string;
  expediente: string;
  regional: string;
  presidenteRegional: string;
  representanteTecnico: string;
  consorcio: string;
}

const usuario = ref("");
const rol = ref("");

const router = useRouter();

onMounted(async () => {
  const logueado = localStorage.getItem("logueado");

  if (!logueado) {
    window.location.href = "/";
    return;
  }

  usuario.value = localStorage.getItem("nombreCompleto") || "";
  rol.value = localStorage.getItem("rol") || "";

  await cargarExpedientes();
  await cargarObra();
});

const darkMode = ref(false);
const toggleDarkMode = () => { darkMode.value = !darkMode.value; };

const expedientes = ref<Expediente[]>([]);
const loading = ref(false);

const cargarExpedientes = async () => {
  loading.value = true;

  try {
    expedientes.value = await getExpedientes();
  } catch (error) {
    console.error("Error cargando expedientes:", error);
  }

  loading.value = false;
};

const expedienteSeleccionado = ref<Expediente | null>(null);

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
  if (!expedienteSeleccionado.value) return alert("Seleccioná un expediente");

  loading.value = true;

  try {
    await updateObra(obraId, {
      expediente: expedienteSeleccionado.value.expediente,
      regional: expedienteSeleccionado.value.regional,
      presidenteRegional: expedienteSeleccionado.value.presidenteRegional,
      representanteTecnico: expedienteSeleccionado.value.representanteTecnico,
      consorcio: expedienteSeleccionado.value.consorcio,
      fotos: linkFotos.value,
      pdf: linkPdf.value,
      excel: linkExcel.value,
      inspector: usuario.value
    });

    alert("Obra actualizada correctamente");
    volver();

  } catch (err) {
    console.error(err);
    alert("Error al actualizar");
  } finally {
    loading.value = false;
  }
};

const cargarObra = async () => {
  if (!obraId) return;

  try {
    const obras = await getObras();
    const obra = obras.find(o => o.id == obraId);

    if (!obra) {
      alert("Obra no encontrada");
      volver();
      return;
    }

    const exp = expedientes.value.find(e => 
      e.expediente === obra.expediente
    );

    if (exp) {
      expedienteSeleccionado.value = exp;
    }

    linkFotos.value = obra.fotos || "";
    linkPdf.value = obra.pdf || "";
    linkExcel.value = obra.excel || "";

  } catch (error) {
    console.error("Error cargando obra:", error);
  }
};

const volver = () => {
  router.push("/Home"); 
};
</script>

<style scoped>
.gov-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 20px 40px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #f4f6f8; 
  color: #333;
  box-sizing: border-box;
}


.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px; 
  margin-bottom: 30px;
  position: relative;
  min-height: 60px;
}


.profile-info { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.user-name { 
  font-weight: 700; 
  font-size: 1rem; 
  color: #1a3e7a; 
}

.user-role { 
  background: #1a3e7a; 
  color: white; 
  padding: 3px 12px; 
  border-radius: 15px; 
  font-size: 0.75rem; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
}


.back-btn {
  background-color: transparent;
  color: #1a3e7a;
  border: 2px solid #1a3e7a;
  padding: 8px 18px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-btn:hover {
  background-color: #1a3e7a;
  color: white;
  transform: translateX(-4px);
}

.mode-btn { 
  background: #333; 
  color: white; 
  border: none; 
  padding: 10px 16px; 
  border-radius: 25px; 
  cursor: pointer; 
  font-weight: 600;
  transition: 0.3s;
  z-index: 10;
}


.gov-header { 
  text-align: center; 
  background-color: #1a3e7a; 
  color: white; 
  padding: 40px 20px; 
  border-radius: 12px; 
  margin-bottom: 30px; 
  width: 100%;
  max-width: 1400px;
  box-shadow: 0 4px 20px rgba(26, 62, 122, 0.15);
}

.gov-header h1 { margin: 0; font-size: 2.2rem; letter-spacing: -0.5px; }
.gov-header p { margin: 10px 0 0 0; font-size: 1.1rem; color: #d0d8ea; font-weight: 300; }


.expedientes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 1400px;
}

.exp-card {
  background: white;
  border-left: 8px solid #1a3e7a;
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  color: #333;
}

.exp-card:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
  border-left-color: #007bff;
}

.exp-card.selected { 
  background: #eef6ff; 
  border-left-color: #007bff; 
  outline: 2px solid #007bff;
}

.exp-card h3 { 
  margin: 0 0 12px 0; 
  color: #1a3e7a; 
  font-size: 1.3rem; 
}

.exp-card p { 
  margin: 5px 0; 
  font-size: 0.95rem; 
  color: #555; 
  line-height: 1.4;
}


.gov-card {
  background: white;
  border-top: 6px solid #1a3e7a;
  padding: 40px;
  margin-bottom: 40px;
  border-radius: 15px;
  width: 100%;
  max-width: 850px; 
  box-shadow: 0px 15px 35px rgba(0,0,0,0.08);
}

.gov-card h2 { 
  margin-top: 0; 
  margin-bottom: 25px; 
  color: #1a3e7a; 
  font-size: 1.6rem; 
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-group label { 
  font-weight: 600; 
  margin-bottom: 8px; 
  color: #444; 
  font-size: 0.95rem;
}

.input-group input {
  padding: 14px 18px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.input-group input:focus {
  border-color: #1a3e7a;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(26, 62, 122, 0.1);
}

.gov-btn { 
  background-color: #1a3e7a; 
  color: white; 
  padding: 16px 32px; 
  border: none; 
  border-radius: 30px; 
  cursor: pointer; 
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  transition: 0.3s;
  margin-top: 10px;
}

.gov-btn:hover { 
  background-color: #0d2650; 
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 62, 122, 0.3);
}


.gov-error { color: #d32f2f; font-weight: 600; font-size: 0.85rem; margin-top: 6px; }
.gov-info { font-size: 1.2rem; color: #1a3e7a; padding: 40px; font-weight: 600; }
.gov-footer { text-align: center; padding: 40px 0; color: #888; font-size: 0.9rem; width: 100%; }


.dark { background-color: #121212; color: #e0e0e0; }

.dark .user-name { color: #4e8cff; }
.dark .back-btn { color: #e0e0e0; border-color: #444; }
.dark .back-btn:hover { background-color: #e0e0e0; color: #121212; border-color: #e0e0e0; }
.dark .mode-btn { background: #e0e0e0; color: #121212; }

.dark .gov-header { background-color: #0a1931; }
.dark .gov-card, .dark .exp-card { 
  background: #1e1e1e; 
  border-left-color: #4e8cff; 
  color: #e0e0e0; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.dark .exp-card h3 { color: #4e8cff; }
.dark .exp-card p { color: #bbb; }
.dark .exp-card.selected { background: #1a3e7a; border-left-color: #4e8cff; }

.dark .gov-card { border-top-color: #4e8cff; }
.dark .gov-card h2 { color: #4e8cff; }
.dark .input-group label { color: #bbb; }
.dark input { 
  background: #2c2c2c; 
  color: white; 
  border-color: #444; 
}
.dark input:focus { border-color: #4e8cff; }
.dark .gov-btn { background-color: #4e8cff; color: #0a1931; }
.dark .gov-footer { color: #555; }


@media (max-width: 900px) {
  .gov-container { padding: 15px 20px; }
  .top-bar { flex-direction: row; flex-wrap: wrap; }
  .profile-info { 
    position: static; 
    transform: none; 
    order: 3; 
    width: 100%; 
    margin-top: 20px; 
  }
  .expedientes-grid { grid-template-columns: 1fr; }
  .gov-header h1 { font-size: 1.6rem; }
}
</style>