<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Iniciar Sesión</h2>

      <input v-model="usuario" type="text" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button class="btn-primary" @click="login">Ingresar</button>

      <p class="switch-text">
        ¿No tenés cuenta?
        <router-link to="/Registro">Crear cuenta</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const usuario = ref("")
const password = ref("")

const login = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"))

  if (
    usuarioGuardado &&
    usuarioGuardado.usuario === usuario.value &&
    usuarioGuardado.password === password.value
  ) {
    localStorage.setItem("nombreCompleto", usuarioGuardado.nombreCompleto)
    localStorage.setItem("rol", usuarioGuardado.rol ?? "Inspector")
    localStorage.setItem("logueado", "true")

    router.push("/Home")
  } else {
    alert("Usuario o contraseña incorrectos")
  }
}
</script>

<style scoped>
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
