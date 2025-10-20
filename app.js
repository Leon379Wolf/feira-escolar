// 🔴 Cole AQUI o seu firebaseConfig do console do Firebase!
const firebaseConfig = {
  apiKey: "AIzaSyCvAQtMC6oRYHLhOsNeWx05KppQmziSpiA",
  authDomain: "feira-escolar-2025.firebaseapp.com",
  projectId: "feira-escolar-2025",
  storageBucket: "feira-escolar-2025.firebasestorage.app",
  messagingSenderId: "686535065959",
  appId: "1:686535065959:web:da71f4d3ff02bb4ba4efc2",
  measurementId: "G-9Q4Z7ZW0JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Função para carregar produtos (usada na index.html)
function carregarProdutos() {
  const container = document.getElementById('produtos');
  if (!container) return;

  container.innerHTML = '<p>Carregando produtos...</p>';

  db.collection('produtos')
    .orderBy('data', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
        return;
      }

      container.innerHTML = '';
      snapshot.forEach(doc => {
        const p = doc.data();
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
          <h3>${p.nome}</h3>
          <div class="preco">R$ ${p.preco.toFixed(2)}</div>
          <p><em>Vendedor: ${p.vendedor}</em></p>
          ${p.descricao ? `<p>${p.descricao}</p>` : ''}
          <button onclick="simularCompra()">Comprar (simulado)</button>
        `;
        container.appendChild(div);
      });
    });
}

// Simular compra
window.simularCompra = function() {
  alert('🎉 Compra simulada com sucesso!\n\nNenhum pagamento real foi feito.\nObrigado por participar da feira!');
};

// Carregar produtos automaticamente se estiver na página principal
if (document.getElementById('produtos')) {
  carregarProdutos();
}