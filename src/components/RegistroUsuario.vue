<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Crear Cuenta</h2>

      <input v-model="nombreCompleto" type="text" placeholder="Nombre completo" />
      <input v-model="usuario" type="text" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <select v-model="rol">
        <option value="">Seleccionar Rol</option>
        <option value="Admin">Administrador</option>
        <option value="Inspector">Inspector</option>
      </select>

      <button class="btn-primary" @click="registrar">
        Crear Cuenta
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const nombreCompleto = ref("")
const usuario = ref("")
const password = ref("")
const rol = ref("")

const registrar = () => {
  const nuevoUsuario = {
    nombreCompleto: nombreCompleto.value,
    usuario: usuario.value,
    password: password.value,
    rol: rol.value ?? "Inspector"
  }

  localStorage.setItem("usuario", JSON.stringify(nuevoUsuario))

  alert("Cuenta creada correctamente")
  router.push("/")
}
</script>

<style scoped>
select {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;

  /* Quitar estilo nativo */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* Flecha personalizada */
  background-image: url("data:image/svg+xml;utf8,<svg fill='%231e3a8a' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
}

select:focus {
  border-color: #1e3a8a;
  outline: none;
}

.h2 {
  color: black;
}
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a8a, #0f172a);
}

.auth-card {
  color: black;
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 380px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  animation: fadeIn 0.5s ease;
}

input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px solid #ddd;
  transition: 0.2s;
}

input:focus {
  border-color: #1e3a8a;
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  border-radius: 30px;
  border: none;
  background: #1e3a8a;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  background: #162d6b;
  transform: translateY(-2px);
}

.switch-text {
  margin-top: 15px;
  font-size: 14px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>