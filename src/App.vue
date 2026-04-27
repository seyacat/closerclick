<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
const isScrolled = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <nav :class="['navbar', { 'scrolled': isScrolled }]">
      <div class="nav-container">
        <div class="logo">
          <img src="/images/logo.png" alt="Closer Click Logo" class="logo-img" />
          <span class="logo-text">Closer Click</span>
        </div>
        <div class="nav-links">
          <a @click="scrollToSection('aplicaciones')" class="nav-link">Aplicaciones</a>
          <a @click="scrollToSection('servicio')" class="nav-link">Servicio</a>
          <a @click="scrollToSection('api')" class="nav-link">API</a>
        </div>
      </div>
    </nav>

    <section class="hero" :style="{ transform: `translateY(${scrollY * 0.5}px)` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Closer Click</h1>
        <p class="hero-subtitle">
          Un ecosistema de aplicaciones que corren del lado del cliente, 
          conectándose a través de un proxy descentralizado para gestionar y compartir contenido
        </p>
        <button @click="scrollToSection('aplicaciones')" class="cta-button">
          Descubre Más
        </button>
      </div>
    </section>

    <section id="aplicaciones" class="section aplicaciones-section">
      <div class="parallax-bg aplicaciones-bg" :style="{ transform: `translateY(${scrollY * 0.3}px)` }"></div>
      <div class="section-content">
        <h2 class="section-title">Aplicaciones</h2>
        <p class="section-text">
          Closer Click potencia cualquier aplicación de intermediarios con nuestra infraestructura descentralizada. 
          Desde plataformas de e-commerce hasta servicios de transporte y delivery.
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <h3>E-commerce</h3>
            <p>Plataformas de venta online con comunicación directa</p>
          </div>
          <div class="feature-card">
            <h3>Servicios</h3>
            <p>Delivery, transporte y servicios profesionales</p>
          </div>
          <div class="feature-card">
            <h3>Marketplaces</h3>
            <p>Mercados digitales sin intermediarios centralizados</p>
          </div>
        </div>
      </div>
    </section>

    <section id="servicio" class="section servicio-section">
      <div class="parallax-bg servicio-bg" :style="{ transform: `translateY(${scrollY * 0.4}px)` }"></div>
      <div class="section-content">
        <h2 class="section-title">Servicio</h2>
        <p class="section-text">
          Nuestro servicio de proxy descentralizado garantiza comunicación segura y eficiente 
          entre todas las aplicaciones del ecosistema.
        </p>
        <div class="service-features">
          <div class="service-item">
            <h3>Comunicación Segura</h3>
            <p>Conexiones encriptadas punto a punto</p>
          </div>
          <div class="service-item">
            <h3>Alta Disponibilidad</h3>
            <p>Infraestructura redundante continua</p>
          </div>
          <div class="service-item">
            <h3>Escalabilidad</h3>
            <p>Adaptable a cualquier volumen</p>
          </div>
        </div>
      </div>
    </section>

    <section id="api" class="section api-section">
      <div class="parallax-bg api-bg" :style="{ transform: `translateY(${scrollY * 0.2}px)` }"></div>
      <div class="section-content">
        <h2 class="section-title">API</h2>
        <p class="section-text">
          Nuestra API proporciona acceso programático a toda la funcionalidad del ecosistema. 
          Desarrolla aplicaciones personalizadas que se integren perfectamente.
        </p>
        <div class="api-features">
          <div class="api-item">
            <h3>RESTful Endpoints</h3>
            <p>Interfaz estándar para integración</p>
          </div>
          <div class="api-item">
            <h3>WebSocket Real-time</h3>
            <p>Comunicación en tiempo real</p>
          </div>
          <div class="api-item">
            <h3>Documentación Completa</h3>
            <p>Guías detalladas para desarrollo</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Team Closer Click. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.app { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

.navbar {
  position: fixed; top: 0; width: 100%; background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px); z-index: 1000; transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.navbar.scrolled { background: rgba(255, 255, 255, 0.98); box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 0.5rem; }
.logo-img { height: 40px; width: auto; }
.logo-text { font-size: 1.5rem; font-weight: bold; color: #2c3e50; }
.nav-links { display: flex; gap: 2rem; }
.nav-link { color: #2c3e50; text-decoration: none; font-weight: 500; cursor: pointer; transition: color 0.3s ease; position: relative; }
.nav-link:hover { color: #3498db; }
.nav-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: #3498db; transition: width 0.3s ease; }
.nav-link:hover::after { width: 100%; }

.hero {
  height: 100vh; 
  background: linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)),
              url('/images/oficina/work-4166471_1920.png') center/cover;
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
}
.hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3); }
.hero-content { text-align: center; color: white; z-index: 2; max-width: 800px; padding: 0 2rem; }
.hero-title { font-size: 4rem; font-weight: 700; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
.hero-subtitle { font-size: 1.4rem; line-height: 1.6; margin-bottom: 2.5rem; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); }
.cta-button {
  background: #3498db; color: white; border: none; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600;
  border-radius: 50px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}
.cta-button:hover { background: #2980b9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4); }

.section { min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  z-index: -1;
}
.section-content { max-width: 1000px; padding: 4rem 2rem; text-align: center; color: white; z-index: 2; }
.section-title { font-size: 3rem; font-weight: 700; margin-bottom: 2rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
.section-text { font-size: 1.2rem; line-height: 1.8; margin-bottom: 3rem; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); }

.aplicaciones-bg {
  background: linear-gradient(rgba(52, 73, 94, 0.8), rgba(52, 73, 94, 0.8)),
              url('/images/comunicacion/media-998990_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
.feature-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease; }
.feature-card:hover { transform: translateY(-5px); }
.feature-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #3498db; }
.feature-card p { line-height: 1.6; }

.servicio-section {
  background: linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.8)),
              url('/images/oficina/building-4803602_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.servicio-bg {
  background: linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.8)),
              url('/images/oficina/building-4803602_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.service-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem; }
.service-item { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); }
.service-item h3 { color: #2ecc71; margin-bottom: 1rem; font-size: 1.3rem; }

.api-section {
  background: linear-gradient(rgba(41, 128, 185, 0.8), rgba(41, 128, 185, 0.8)),
              url('/images/oficina/desk-593327_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.api-bg {
  background: linear-gradient(rgba(41, 128, 185, 0.8), rgba(41, 128, 185, 0.8)),
              url('/images/oficina/desk-593327_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.api-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem; }
.api-item { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); }
.api-item h3 { color: #e74c3c; margin-bottom: 1rem; font-size: 1.3rem; }

.footer { background: #2c3e50; color: white; text-align: center; padding: 2rem; }
.footer-content { max-width: 1200px; margin: 0 auto; }

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.1rem; }
  .section-title { font-size: 2rem; }
  .nav-container { padding: 1rem; }
  .nav-links { gap: 1rem; }
  .logo-text { font-size: 1.2rem; }
  .features-grid, .service-features, .api-features { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .section-content { padding: 2rem 1rem; }
  .nav-links { flex-direction: column; gap: 0.5rem; }
}
</style>
