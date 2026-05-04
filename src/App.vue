<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

const VISITED_KEY = 'closerclick.visited'
const compact = ref(localStorage.getItem(VISITED_KEY) === '1')

// PWA install prompt
let deferredPrompt: any = null
const isStandalone = ref(
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true
)
const canInstall = ref(!isStandalone.value)

const onBeforeInstallPrompt = (e: Event) => {
  e.preventDefault()
  deferredPrompt = e
  canInstall.value = true
}

const onAppInstalled = () => {
  deferredPrompt = null
  canInstall.value = false
  isStandalone.value = true
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    deferredPrompt = null
    canInstall.value = false
    return
  }
  if (isIOS) {
    alert('Para instalar: pulsa el botón Compartir y luego "Añadir a pantalla de inicio".')
  } else {
    alert('Tu navegador todavía no permite la instalación automática. Usa el menú del navegador para instalar la app.')
  }
}

const showFullHome = () => {
  compact.value = false
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (sectionId: string) => {
  menuOpen.value = false
  if (compact.value && sectionId !== 'aplicaciones') {
    compact.value = false
  }
  requestAnimationFrame(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
  localStorage.setItem(VISITED_KEY, '1')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
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

        <button
          v-if="!isStandalone"
          @click="installApp"
          class="install-btn"
        >Instalar App</button>

        <div class="nav-links desktop-links">
          <a @click="scrollToSection('aplicaciones')" class="nav-link">Aplicaciones</a>
          <a @click="scrollToSection('servicio')" class="nav-link">Servicio</a>
          <a @click="scrollToSection('api')" class="nav-link">API</a>
        </div>

        <button
          class="hamburger"
          :class="{ open: menuOpen }"
          @click="menuOpen = !menuOpen"
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="mobile-menu" :class="{ open: menuOpen }">
        <a @click="scrollToSection('aplicaciones')" class="nav-link">Aplicaciones</a>
        <a @click="scrollToSection('servicio')" class="nav-link">Servicio</a>
        <a @click="scrollToSection('api')" class="nav-link">API</a>
      </div>
    </nav>

    <section v-if="!compact" class="hero">
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

    <div v-if="compact" class="compact-spacer"></div>

    <section
      id="aplicaciones"
      class="section aplicaciones-section"
      :class="{ 'apps-only': compact }"
    >
      <div class="parallax-bg aplicaciones-bg"></div>
      <div class="section-content">
        <h2 class="section-title">Aplicaciones</h2>
        <p class="section-text">
          Aplicaciones que usan el proxy de Closer Click.
        </p>
        <div class="apps-grid">
          <div class="app-card">
            <h3>Closer Click Chat</h3>
            <p>Chat en tiempo real con salas públicas, descubrimiento de canales y mensajería P2P por WebRTC con caída automática al proxy WebSocket.</p>
            <a
              href="https://seyacat.github.io/simple-websocket-chat/"
              target="_blank"
              rel="noopener"
              class="app-button"
            >Abrir aplicación</a>
            <a
              href="https://github.com/seyacat/simple-websocket-chat"
              target="_blank"
              rel="noopener"
              class="app-repo"
            >github.com/seyacat/simple-websocket-chat</a>
          </div>
          <div class="app-card">
            <h3>Closer Click Messenger</h3>
            <p>Mensajería 1-a-1 con cifrado E2E (ECDH+AES-GCM), contactos compartidos entre apps del ecosistema, histórico local con poda automática, mensajes offline (proxy retiene 24 h) y ranking integrado. Instalable como PWA.</p>
            <a
              href="https://seyacat.github.io/closerclick_messenger/"
              target="_blank"
              rel="noopener"
              class="app-button"
            >Abrir aplicación</a>
            <a
              href="https://github.com/seyacat/closerclick_messenger"
              target="_blank"
              rel="noopener"
              class="app-repo"
            >github.com/seyacat/closerclick_messenger</a>
          </div>
          <div class="app-card">
            <h3>Messenger Extension (Chrome)</h3>
            <p>Extensión Chrome (MV3) que muestra un overlay con notificaciones de mensajes en cualquier pestaña y un popup para componer DMs. Comparte identidad y contactos con la web messenger usando el vault <code>id.closer.click</code>.</p>
            <a
              href="https://github.com/seyacat/closerclick_messenger_extension"
              target="_blank"
              rel="noopener"
              class="app-button"
            >Ver instalación</a>
            <a
              href="https://github.com/seyacat/closerclick_messenger_extension"
              target="_blank"
              rel="noopener"
              class="app-repo"
            >github.com/seyacat/closerclick_messenger_extension</a>
          </div>
          <div class="app-card">
            <h3>QRShare</h3>
            <p>Transferencia de archivos P2P por WebRTC. El proxy solo descubre los peers; los archivos viajan directamente entre dispositivos. Comparte por QR.</p>
            <a
              href="https://seyacat.github.io/qrshare/"
              target="_blank"
              rel="noopener"
              class="app-button"
            >Abrir aplicación</a>
            <a
              href="https://github.com/seyacat/qrshare"
              target="_blank"
              rel="noopener"
              class="app-repo"
            >github.com/seyacat/qrshare</a>
          </div>
          <div class="app-card">
            <h3>Closer Click Chess</h3>
            <p>Ajedrez online multijugador con transporte P2P por WebRTC cuando es posible. Crea partidas públicas o privadas; el lobby se actualiza en tiempo real con los eventos del proxy.</p>
            <a
              href="https://seyacat.github.io/simple-websocket-chess/"
              target="_blank"
              rel="noopener"
              class="app-button"
            >Abrir aplicación</a>
            <a
              href="https://github.com/seyacat/simple-websocket-chess"
              target="_blank"
              rel="noopener"
              class="app-repo"
            >github.com/seyacat/simple-websocket-chess</a>
          </div>
        </div>

        <button
          v-if="compact"
          @click="showFullHome"
          class="full-home-button"
        >Ver home completo</button>
      </div>
    </section>

    <section v-if="!compact" id="servicio" class="section servicio-section">
      <div class="parallax-bg servicio-bg"></div>
      <div class="section-content">
        <h2 class="section-title">Servicio</h2>
        <p class="section-text">
          Comunicación por WebSocket ligero que enruta mensajes
          entre clientes mediante tokens cortos, sin almacenar conversaciones ni requerir cuentas.
        </p>
        <div class="service-features">
          <div class="service-item">
            <h3>Tokens efímeros</h3>
            <p>Al conectar se asigna un token corto (4 caracteres). Sirve como dirección lógica del cliente y se libera al desconectar.</p>
          </div>
          <div class="service-item">
            <h3>Canales públicos</h3>
            <p>Cualquier cliente puede publicarse en un canal nombrado, listarlo o consultar el número de miembros. TTL de 20 min y hasta 100 tokens por canal.</p>
          </div>
          <div class="service-item">
            <h3>Firma ECDSA P-256</h3>
            <p>Las operaciones sobre canales se firman con clave pública JWK (curva P-256). El proxy verifica la firma antes de aceptar publish/unpublish/list.</p>
          </div>
          <div class="service-item">
            <h3>Sin estado persistente</h3>
            <p>El proxy no guarda mensajes en disco ni tiene base de datos. Solo memoria viva: conexiones, pares activos y entradas de canal.</p>
          </div>
          <div class="service-item">
            <h3>WebRTC con fallback al proxy</h3>
            <p>El cliente intenta abrir un <code>RTCDataChannel</code> con cada peer (señalización por el propio proxy, STUN público). Si la negociación tiene éxito los mensajes viajan P2P; si falla, siguen por el proxy de forma transparente.</p>
          </div>
          <div class="service-item">
            <h3>Cola offline 24 h</h3>
            <p>Tras un <code>identify</code> firmado, los clientes pueden direccionar mensajes por <code>to_publickey</code>. Si el destinatario está offline, el proxy retiene en memoria hasta 24 h (200 msgs / 1 MB por pubkey) y los entrega cuando vuelve a identificarse. Tras 24 h se descartan.</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!compact" id="api" class="section api-section">
      <div class="parallax-bg api-bg"></div>
      <div class="section-content">
        <h2 class="section-title">API</h2>
        <p class="section-text">
          Una sola conexión WebSocket. Mensajes JSON. Sin endpoints HTTP, sin SDK obligatorio.
        </p>
        <div class="api-features">
          <div class="api-item">
            <h3>Mensaje directo</h3>
            <p><code>{ to: ["TKN1","TKN2"], message: ... }</code> — entrega a uno o varios tokens. El receptor recibe <code>{ type: "message", from, message }</code>.</p>
          </div>
          <div class="api-item">
            <h3>publish / unpublish</h3>
            <p><code>{ type: "publish", channel: { data, signature } }</code> hace visible al cliente en un canal. Notifica join/leave a los demás miembros.</p>
          </div>
          <div class="api-item">
            <h3>list / list_channels / channel_count</h3>
            <p>Descubrimiento: tokens en un canal, canales por prefijo, conteo. Útil para construir lobbies o salas públicas.</p>
          </div>
          <div class="api-item">
            <h3>disconnect</h3>
            <p><code>{ type: "disconnect", target }</code> rompe el par lógico con otro token y notifica a ambas partes.</p>
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
  position: fixed; top: 0; width: 100%; background: #2c3e50;
  backdrop-filter: blur(10px); z-index: 1000; transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.navbar.scrolled { background: #2c3e50; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3); }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 0.5rem; }
.logo-img { height: 40px; width: auto; }
.logo-text { font-size: 1.5rem; font-weight: bold; color: #ffffff; }
.nav-links { display: flex; gap: 2rem; }
.nav-link { color: #ffffff; text-decoration: none; font-weight: 500; cursor: pointer; transition: color 0.3s ease; position: relative; }
.nav-link:hover { color: #3498db; }
.nav-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: #3498db; transition: width 0.3s ease; }
.nav-link:hover::after { width: 100%; }

.install-btn {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.35);
  white-space: nowrap;
}
.install-btn:hover { background: #2980b9; transform: translateY(-1px); }

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

.mobile-menu {
  display: none;
  flex-direction: column;
  background: #2c3e50;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 300px; }
.mobile-menu .nav-link {
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
}
.mobile-menu .nav-link::after { display: none; }

@media (max-width: 768px) {
  .nav-container { padding: 0.75rem 1rem; }
  .desktop-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
  .install-btn {
    margin-left: auto;
    margin-right: auto;
    padding: 0.4rem 0.9rem;
    font-size: 0.85rem;
  }
  .logo-text { font-size: 1.1rem; }
  .logo-img { height: 32px; }
}

.hero {
  height: 100vh;
  background: linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)),
              url('/images/oficina/desk-593327_1920.jpg') center/cover;
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 95%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 95%, transparent 100%);
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

.compact-spacer { height: 80px; }

.aplicaciones-section.apps-only .section-title,
.aplicaciones-section.apps-only > .section-content > .section-text,
.aplicaciones-section.apps-only .app-card > p {
  display: none;
}
.aplicaciones-section.apps-only .app-card {
  padding: 1.5rem;
  gap: 0.75rem;
}
.aplicaciones-section.apps-only .apps-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.full-home-button {
  margin-top: 3rem;
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.full-home-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-2px);
}

.app { background: #1b2533; }
.section { min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 5%, #000 95%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, #000 5%, #000 95%, transparent 100%);
}
.section-content { position: relative; }
.section-content { width: 100%; max-width: 1000px; padding: 4rem 2rem; text-align: center; color: white; z-index: 2; box-sizing: border-box; }
.section-title { font-size: 3rem; font-weight: 700; margin-bottom: 2rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
.section-text { font-size: 1.2rem; line-height: 1.8; margin-bottom: 3rem; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); }

.aplicaciones-bg {
  background: linear-gradient(rgba(52, 73, 94, 0.8), rgba(52, 73, 94, 0.8)),
              url('/images/comunicacion/social-3408791_1920.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
.feature-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease; }
.feature-card:hover { transform: translateY(-5px); }
.feature-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #3498db; }
.feature-card p { line-height: 1.6; }

.apps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 3rem; }
.app-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.3s ease; display: flex; flex-direction: column; align-items: center; text-align: center; }
.app-card:hover { transform: translateY(-5px); }
.app-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #3498db; }
.app-card p { line-height: 1.6; margin-bottom: 1.5rem; }
.app-button { background: #3498db; color: white; border: none; padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3); text-decoration: none; display: inline-block; }
.app-button:hover { background: #2980b9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4); }
.app-repo { display: block; margin-top: 0.85rem; color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; text-decoration: none; word-break: break-all; }
.app-repo:hover { color: #fff; text-decoration: underline; }

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
.service-item p { line-height: 1.55; }
.service-item code, .api-item code, .section-text code { background: rgba(0,0,0,0.35); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: 'Consolas','Monaco',monospace; font-size: 0.9em; }

.api-bg {
  background: linear-gradient(rgba(41, 128, 185, 0.8), rgba(41, 128, 185, 0.8)),
              url('/images/oficina/work-4166471_1920.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.api-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem; }
.api-item { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); }
.api-item h3 { color: #e74c3c; margin-bottom: 1rem; font-size: 1.3rem; }

.footer { background: #2c3e50; color: white; text-align: center; padding: 2rem; -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 5%, #000 100%); mask-image: linear-gradient(to bottom, transparent 0%, #000 5%, #000 100%); }
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
