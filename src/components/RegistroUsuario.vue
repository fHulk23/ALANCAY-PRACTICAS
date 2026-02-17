<template>
  <div class="registro-container">
    <div class="registro-card">
      <h2>Crear Cuenta</h2>

      <input type="text" placeholder="Nombre completo" />
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />

      <button class="btn-crear">Crear Cuenta</button>
    </div>
  </div>
</template>

<style scoped>
.registro-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
}

.registro-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 350px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.btn-crear {
  width: 100%;
  padding: 12px;
  border-radius: 30px;
  border: none;
  background-color: #1e3a8a;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
