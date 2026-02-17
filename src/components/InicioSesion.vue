<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>

      <input v-model="usuario" type="text" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <div class="foto">
        <label>Foto de perfil</label>
        <input type="file" @change="cargarImagen" />
        <img v-if="preview" :src="preview" class="preview" />
      </div>

      <button class="btn-login">Ingresar</button>

      <div class="registro-link">
        <p>¿No sos usuario?</p>
        <router-link to="/registro">
          <button class="btn-registro">Crear tu cuenta</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const usuario = ref('')
const password = ref('')
const preview = ref(null)

const cargarImagen = (event) => {
  const file = event.target.files[0]
  if (file) {
    preview.value = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a8a, #1f2937);
  color: white;
}

.login-card {
  background: white;
  color: #1f2d3d;
  padding: 40px;
  border-radius: 20px;
  width: 350px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.btn-login {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 30px;
  border: none;
  background-color: #1e3a8a;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-login:hover {
  background-color: #162d6b;
}

.btn-registro {
  margin-top: 10px;
  padding: 8px 20px;
  border-radius: 30px;
  border: 2px solid #1e3a8a;
  background: transparent;
  color: #1e3a8a;
  cursor: pointer;
}

.btn-registro:hover {
  background: #1e3a8a;
  color: white;
}

.preview {
  margin-top: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
