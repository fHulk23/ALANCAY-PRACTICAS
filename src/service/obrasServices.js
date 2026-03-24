import apiClient from "./apiClient";

export async function getObras() {
  const resp = await apiClient.get("/obras");
  return resp.data;
}

export async function deleteObra(id) {
  try {
    await apiClient.delete(`/obras/${id}`);
  } catch (error) {
    console.error(error, "- Error al eliminar obra");
    throw error;
  }
}

export async function getExpedientes() {
  try {
    const resp = await apiClient.get("/obras/expedientes");
    return resp.data;
  } catch (error) {
    console.error(error, "- Error al obtener expedientes");
    throw error;
  }
}

export async function createObra(data) {
  try {
    const resp = await apiClient.post("/obras", data);
    return resp.data;
  } catch (error) {
    console.error(error, "- Error al crear obra");
    throw error;
  }
}