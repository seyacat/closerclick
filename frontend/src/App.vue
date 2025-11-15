<script setup lang="ts">
import { ref, onMounted } from 'vue'

const apiStatus = ref('')
const healthData = ref<{ status: string; timestamp: string } | null>(null)

const checkApiHealth = async () => {
  try {
    const response = await fetch('/api/health')
    if (response.ok) {
      const data = await response.json()
      healthData.value = data
      apiStatus.value = 'API conectada correctamente'
    } else {
      apiStatus.value = 'Error en la API'
    }
  } catch (error) {
    apiStatus.value = 'No se pudo conectar con la API'
    console.error('Error al conectar con la API:', error)
  }
}

onMounted(() => {
  checkApiHealth()
})
</script>

<template>
  <div class="app">
    <header>
      <h1>CloserClick App</h1>
      <p>Frontend Vue + TypeScript con API NestJS</p>
    </header>

    <main>
      <div class="status-card">
        <h2>Estado del Sistema</h2>
        <div class="status-info">
          <p><strong>Frontend:</strong> <span class="status-ok">Funcionando</span></p>
          <p><strong>API:</strong> 
            <span :class="healthData ? 'status-ok' : 'status-error'">
              {{ apiStatus || 'Verificando...' }}
            </span>
          </p>
          <div v-if="healthData" class="health-data">
            <p><strong>Estado:</strong> {{ healthData.status }}</p>
            <p><strong>Última verificación:</strong> {{ new Date(healthData.timestamp).toLocaleString() }}</p>
          </div>
        </div>
        <button @click="checkApiHealth" class="refresh-btn">
          Actualizar Estado
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.status-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.status-card h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.status-info p {
  margin: 0.75rem 0;
  font-size: 1.1rem;
}

.status-ok {
  color: #27ae60;
  font-weight: bold;
}

.status-error {
  color: #e74c3c;
  font-weight: bold;
}

.health-data {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border-left: 4px solid #3498db;
}

.refresh-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background: #2980b9;
}
</style>
