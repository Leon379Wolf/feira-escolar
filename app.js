// Configuração do Firebase (modo compatível)
const firebaseConfig = {
  apiKey: "AIzaSyCvAQtMC6oRYHLhOsNeWx05KppQmziSpiA",
  authDomain: "feira-escolar-2025.firebaseapp.com",
  projectId: "feira-escolar-2025",
  storageBucket: "feira-escolar-2025.firebasestorage.app",
  messagingSenderId: "686535065959",
  appId: "1:686535065959:web:da71f4d3ff02bb4ba4efc2",
  measurementId: "G-9Q4Z7ZW0JK"
};

// Inicializa o Firebase no modo compatível
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Firestore
const db = firebase.firestore();
window.db = db;

// Carrega produtos em tempo real
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
          <h3>${p.nome || 'Sem nome'}</h3>
          <div class="preco">R$ ${typeof p.preco === 'number' ? p.preco.toFixed(2) : p.preco}</div>
          <p><em>Vendedor: ${p.vendedor || 'Anônimo'}</em></p>
          ${p.descricao ? `<p>${p.descricao}</p>` : ''}
          <button onclick="simularCompra()">Comprar (simulado)</button>
        `;
        container.appendChild(div);
      });
    });
}

window.simularCompra = function() {
  alert('🎉 Compra simulada com sucesso!\n\nNenhum pagamento real foi feito.\nObrigado por participar da feira!');
};

if (document.getElementById('produtos')) {
  carregarProdutos();
}