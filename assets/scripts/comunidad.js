/* comunidad.js
   - Muro tipo "red social"
   - Reputación por niveles
   - Visibilidad: publico / equipo
   - Persistencia en localStorage
*/

/* ---------- Config inicial y util ---------- */

const STORAGE_KEY = "ux_comunidad_v1";

// Simulación de usuarios y sesión actual
const users = [
  { id: 1, name: "María Gonzales" },
  { id: 2, name: "Pedro Quispe" },
  { id: 3, name: "Ana Flores" },
];

// Usuario logueado en esta demo
const currentUser = { id: 999, name: "Tú" };

// Reputación: puntos y niveles
// Puntos: publicar +5, recibir like +1 por like, recibir comentario +2 por comentario
function pointsFor(action) {
  switch(action) {
    case "post": return 5;
    case "like": return 1;
    case "comment": return 2;
    default: return 0;
  }
}
function levelFromPoints(points) {
  if (points >= 80) return "Experto";
  if (points >= 40) return "Cosecha";
  if (points >= 15) return "Planta";
  return "Semilla";
}

// Cargar / guardar datos
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // estructura inicial
    return {
      posts: [],
      reputation: { } // map userName -> points
    };
  }
  try {
    return JSON.parse(raw);
  } catch(e) {
    return { posts: [], reputation: {} };
  }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// Inicializa reputación si no existe
function ensureReputationFor(name) {
  if (!state.reputation[name]) state.reputation[name] = 0;
}

/* ---------- DOM references ---------- */
const feed = document.getElementById("feed");
const btnPublicar = document.getElementById("btnPublicar");
const inputPost = document.getElementById("inputPost");
const inputImagen = document.getElementById("inputImagen");
const postVisibility = document.getElementById("postVisibility");
const postCategoria = document.getElementById("postCategoria");
const currentUserNameEl = document.getElementById("currentUserName");
const authorLevelEl = document.getElementById("authorLevel");
const filtros = document.querySelectorAll(".filtro");
const feedSearch = document.getElementById("feedSearch");

/* ---------- Inicialización UI ---------- */
currentUserNameEl.textContent = currentUser.name;
ensureReputationFor(currentUser.name);
authorLevelEl.textContent = levelFromPoints(state.reputation[currentUser.name] || 0);

/* ---------- Render ---------- */
function renderFeed(filter = "todos", q="") {
  feed.innerHTML = "";

  // ordenar por fecha desc
  const posts = state.posts.slice().sort((a,b) => b.createdAt - a.createdAt);

  posts.forEach((post, idx) => {
    if (filter === "publico" && post.visibility !== "publico") return;
    if (filter === "equipo" && post.visibility !== "equipo") return;

    // buscador simple
    const text = (post.text + " " + post.author + " " + post.category).toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return;

    const card = document.createElement("div");
    card.className = "post";

    const authorBadge = `<div class="post-meta">
      <div class="user-badge">
        <strong>${post.author}</strong>
        <span style="opacity:0.8;">• ${ levelFromPoints(state.reputation[post.author] || 0) }</span>
      </div>
      <div class="post-categoria">${post.category}</div>
    </div>`;

    card.innerHTML = `
      <div class="post-header">
        ${authorBadge}
        <div style="text-align:right">
          <div class="post-visibility">${ post.visibility === "publico" ? "Público" : "Equipo" }</div>
          <div style="font-size:12px; color:#6a8a6a;">${ new Date(post.createdAt).toLocaleString() }</div>
        </div>
      </div>

      <div class="post-content">
        <p>${escapeHtml(post.text)}</p>
        ${ post.image ? `<img src="${post.image}" alt="imagen publicado">` : "" }
      </div>

      <div class="post-actions">
        <button class="btn-like" data-id="${post.id}">👍 ${post.likes}</button>
        <button class="btn-comment" data-id="${post.id}">💬 ${post.comments.length}</button>
        ${ post.author === currentUser.name ? `<button class="btn-delete" data-id="${post.id}">Eliminar</button>` : "" }
      </div>

      <div class="comentarios" data-id="${post.id}">
        ${ post.comments.map(c => `<div class="comentario"><b>${escapeHtml(c.author)}</b>: ${escapeHtml(c.text)}</div>`).join("") }
      </div>

      <div class="comentar-box">
        <input data-id="${post.id}" placeholder="Escribe un comentario...">
        <button class="btn-primary comentar-btn" data-id="${post.id}">Comentar</button>
      </div>
    `;

    feed.appendChild(card);
  });
}

/* ---------- Utilidades ---------- */
function escapeHtml(s) {
  if (!s) return "";
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

/* ---------- Crear post ---------- */
btnPublicar.addEventListener("click", () => {
  const text = inputPost.value.trim();
  if (!text) return alert("Escribe algo para publicar.");

  const file = inputImagen.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      createPost(text, reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    createPost(text, null);
  }
});

function createPost(text, image) {
  const post = {
    id: Date.now(),
    author: currentUser.name,
    text,
    image,
    visibility: postVisibility.value,
    category: postCategoria.value,
    likes: 0,
    comments: [],
    createdAt: Date.now()
  };

  // push to state
  state.posts.push(post);

  // sumar puntos por publicar
  ensureReputationFor(currentUser.name);
  state.reputation[currentUser.name] += pointsFor("post");

  saveState(state);

  // limpiar UI
  inputPost.value = "";
  inputImagen.value = "";
  authorLevelEl.textContent = levelFromPoints(state.reputation[currentUser.name]);

  // re-render
  renderFeed(getActiveFilter(), feedSearch.value);
}

/* ---------- Likes ---------- */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-like")) {
    const id = Number(e.target.dataset.id);
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    post.likes++;
    // dar punto al autor por recibir like
    ensureReputationFor(post.author);
    state.reputation[post.author] += pointsFor("like");

    saveState(state);
    renderFeed(getActiveFilter(), feedSearch.value);
  }
});

/* ---------- Comentar ---------- */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("comentar-btn")) {
    const id = Number(e.target.dataset.id);
    const input = document.querySelector(`input[data-id='${id}']`);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    post.comments.push({ author: currentUser.name, text, createdAt: Date.now() });

    // dar puntos al autor por recibir comentario
    ensureReputationFor(post.author);
    state.reputation[post.author] += pointsFor("comment");

    saveState(state);
    input.value = "";
    renderFeed(getActiveFilter(), feedSearch.value);
  }
});

/* ---------- Eliminar (solo autor) ---------- */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = Number(e.target.dataset.id);
    const idx = state.posts.findIndex(p => p.id === id);
    if (idx === -1) return;
    const post = state.posts[idx];
    if (post.author !== currentUser.name) {
      return alert("Solo puedes eliminar tus propias publicaciones.");
    }
    if (!confirm("¿Eliminar esta publicación?")) return;
    state.posts.splice(idx,1);
    saveState(state);
    renderFeed(getActiveFilter(), feedSearch.value);
  }
});

/* ---------- Filtros UI ---------- */
function getActiveFilter() {
  const btn = document.querySelector(".filtro.active");
  return btn ? btn.dataset.filter : "todos";
}

filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderFeed(getActiveFilter(), feedSearch.value);
  });
});

/* ---------- Buscador feed ---------- */
feedSearch.addEventListener("input", (e) => {
  renderFeed(getActiveFilter(), e.target.value);
});

/* ---------- Simular algunos posts iniciales (solo si no hay datos) ---------- */
function seedInitialData() {
  if (state.posts.length > 0) return;

  // usuarios example
  const now = Date.now();
  state.posts = [
    {
      id: now - 1000*60*60*24*2,
      author: "María Gonzales",
      text: "Hoy probé un control biológico contra gorgojos y los resultados se ven prometedores.",
      image: null,
      visibility: "publico",
      category: "plagas",
      likes: 4,
      comments: [{author:"Pedro Quispe", text:"Excelente, ¿qué usaste?"}],
      createdAt: now - 1000*60*60*24*2
    },
    {
      id: now - 1000*60*60*10,
      author: "Pedro Quispe",
      text: "Riego inteligente programado a las 6am, consumo optimizado.",
      image: null,
      visibility: "equipo",
      category: "riego",
      likes: 2,
      comments: [],
      createdAt: now - 1000*60*60*10
    }
  ];

  // reputación base
  ensureReputationFor("María Gonzales");
  ensureReputationFor("Pedro Quispe");
  ensureReputationFor(currentUser.name);

  state.reputation["María Gonzales"] += 12; // some starter points
  state.reputation["Pedro Quispe"] += 8;
  state.reputation[currentUser.name] += 3;

  saveState(state);
}

seedInitialData();

/* ---------- Render inicial ---------- */
renderFeed();

/* ---------- Exponer helper para debug (opcional) ---------- */
window.__comunidad_state = state;
