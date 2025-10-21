// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvAQtMC6oRYHLhOsNeWx05KppQmziSpiA",
  authDomain: "feira-escolar-2025.firebaseapp.com",
  projectId: "feira-escolar-2025",
  storageBucket: "feira-escolar-2025.firebasestorage.app",
  messagingSenderId: "686535065959",
  appId: "1:686535065959:web:da71f4d3ff02bb4ba4efc2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
window.db = db;

// =============== UTILITÁRIO DE ADMIN ===============
function ehAdmin() {
  return sessionStorage.getItem('aluno_logado') === 'admin';
}
window.ehAdmin = ehAdmin;

// =============== EXCLUSÃO DE PRODUTO ===============
window.excluirProduto = async function(produtoId) {
  if (!confirm('⚠️ Tem certeza que deseja excluir este produto?')) return;
  try {
    await db.collection('produtos').doc(produtoId).delete();
    alert('✅ Produto excluído com sucesso!');
    if (window.location.pathname.includes('produto.html')) {
      window.location.href = 'index.html';
    } else {
      location.reload();
    }
  } catch (err) {
    alert('❌ Erro ao excluir: ' + err.message);
  }
};

// =============== CARRINHO (sem variável global) ===============
function atualizarQtdCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho-feira')) || [];
  const qtd = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const el = document.getElementById('qtd-carrinho');
  if (el) el.textContent = qtd;
}

function adicionarAoCarrinho(docId, nome, preco, estoqueMax, quantidadeDesejada = 1) {
  if (estoqueMax <= 0) {
    alert('⚠️ Produto esgotado!');
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem('carrinho-feira')) || [];
  const qtd = Math.min(quantidadeDesejada, estoqueMax);
  const itemExistente = carrinho.find(item => item.id === docId);

  if (itemExistente) {
    const total = itemExistente.quantidade + qtd;
    if (total <= estoqueMax) {
      itemExistente.quantidade = total;
    } else {
      alert(`⚠️ Você só pode adicionar até ${estoqueMax - itemExistente.quantidade} unid.`);
      return;
    }
  } else {
    carrinho.push({ id: docId, nome, preco, quantidade: qtd });
  }

  localStorage.setItem('carrinho-feira', JSON.stringify(carrinho));
  atualizarQtdCarrinho();
  alert(`✅ ${qtd} unid. de "${nome}" adicionado(s) ao carrinho!`);
}

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.atualizarQtdCarrinho = atualizarQtdCarrinho;

// =============== FINALIZAR COMPRA ===============
window.finalizarCompraSimulada = function() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho-feira')) || [];
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  let sucesso = 0;
  const promises = carrinho.map(async (item) => {
    const produtoRef = db.collection('produtos').doc(item.id);
    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(produtoRef);
        if (!doc.exists) return;
        const estoqueAtual = doc.data().estoque || 0;
        const totalVendasAtual = doc.data().totalVendas || 0;
        if (estoqueAtual >= item.quantidade) {
          transaction.update(produtoRef, {
            estoque: estoqueAtual - item.quantidade,
            totalVendas: totalVendasAtual + item.quantidade
          });
          sucesso++;
        }
      });
    } catch (err) {
      console.error("Erro ao atualizar estoque ou vendas:", err);
    }
  });

  Promise.all(promises).then(() => {
    localStorage.removeItem('carrinho-feira');
    atualizarQtdCarrinho();
    if (typeof atualizarCarrinho === 'function') atualizarCarrinho();
    alert(`🎉 Compra simulada concluída!\n${sucesso} produto(s) atualizados.`);
  });
};

// =============== AVALIAÇÕES ===============
window.enviarAvaliacao = async function(produtoId, estrelas, comentario) {
  if (!estrelas || estrelas < 1 || estrelas > 5) {
    alert('Escolha de 1 a 5 estrelas.');
    return;
  }
  const avaliacao = {
    estrelas: parseInt(estrelas),
    comentario: comentario.trim() || 'Sem comentário',
    data: Date.now(),
    avaliador: 'Aluno da Feira'
  };
  try {
    await db.collection('produtos').doc(produtoId).update({
      avaliacoes: firebase.firestore.FieldValue.arrayUnion(avaliacao)
    });
    alert('✅ Obrigado pela avaliação!');
    window.location.reload();
  } catch (err) {
    alert('❌ Erro ao enviar avaliação: ' + err.message);
  }
};

// =============== FILTRO POR DEPARTAMENTO ===============
let todosProdutos = [];
function carregarProdutos() {
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = '<p>Carregando produtos...</p>';
  db.collection('produtos')
    .orderBy('criadoEm', 'desc')
    .onSnapshot(snapshot => {
      todosProdutos = [];
      snapshot.forEach(doc => {
        todosProdutos.push({ id: doc.id, ...doc.data() });
      });
      aplicarFiltro();
    });
}

function aplicarFiltro() {
  const container = document.getElementById('produtos');
  if (!container) return;
  const filtro = document.getElementById('filtro-departamento')?.value || '';
  const produtosFiltrados = filtro 
    ? todosProdutos.filter(p => p.departamento === filtro)
    : todosProdutos;
  if (produtosFiltrados.length === 0) {
    container.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }
  container.innerHTML = '';
  produtosFiltrados.forEach(p => {
    const imagemHtml = p.imagem 
      ? `<img src="${p.imagem}" alt="${p.nome}" style="width:100%; height:160px; object-fit:cover; border-radius:8px 8px 0 0;">`
      : '';
    const estoqueMsg = p.estoque > 0 
      ? `<p>📦 Disponível: ${p.estoque} unid.</p>`
      : `<p style="color:red;">❌ Esgotado</p>`;
    const botoesHtml = `
      <button onclick="event.stopPropagation(); adicionarAoCarrinho('${p.id}', '${p.nome.replace(/'/g, "\\'")}', ${p.preco}, ${p.estoque})" 
              ${p.estoque <= 0 ? 'disabled' : ''} style="margin-top:8px; margin-right: ${ehAdmin() ? '8px' : '0'};">
        Adicionar ao carrinho
      </button>
      ${ehAdmin() ? `<button onclick="event.stopPropagation(); excluirProduto('${p.id}')" 
                     style="margin-top:8px; background:#dc3545; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
        Excluir
      </button>` : ''}
    `;
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <a href="produto.html?id=${p.id}" style="text-decoration:none; color:inherit; display:block;">
        ${imagemHtml}
        <h3>${p.nome || 'Sem nome'}</h3>
        <div class="preco">R$ ${typeof p.preco === 'number' ? p.preco.toFixed(2) : p.preco}</div>
        <p><strong>Departamento:</strong> ${p.departamento || '—'}</p>
        <p><em>Vendedor: ${p.vendedor || 'Anônimo'}</em></p>
        ${estoqueMsg}
      </a>
      ${botoesHtml}
    `;
    card.style.cursor = 'pointer';
    container.appendChild(card);
  });
  atualizarQtdCarrinho();
}

function filtrarProdutos() {
  aplicarFiltro();
}

if (document.getElementById('produtos')) {
  carregarProdutos();
}