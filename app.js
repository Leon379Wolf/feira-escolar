// app.js - Configuração e Funções Essenciais

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

// Variável global para armazenar todos os produtos (cache)
let todosOsProdutos = [];
let filtroDepartamentoAtual = 'todos';

// =============== UTILITÁRIO DE ADMIN ===============
function ehAdmin() {
  return sessionStorage.getItem('aluno_logado') === 'admin';
}
window.ehAdmin = ehAdmin;

// =============== EXCLUSÃO DE PRODUTO ===============
window.excluirProduto = async function(produtoId) {
  if (!confirm('⚠️ Tem certeza que deseja excluir este produto?')) return;
  try {
    // Tenta excluir no Firestore
    await db.collection('produtos').doc(produtoId).delete();
    
    // Se o produto.html estiver aberto, redireciona para a loja
    if (window.location.pathname.includes('produto.html')) {
      alert('✅ Produto excluído com sucesso! Redirecionando para a loja.');
      window.location.href = 'index.html';
    } else {
        // Se estiver na index.html, recarrega a lista
        alert('✅ Produto excluído com sucesso!');
        // Remove do cache local e atualiza o grid sem recarregar toda a página
        todosOsProdutos = todosOsProdutos.filter(p => p.id !== produtoId);
        aplicarFiltros(filtroDepartamentoAtual, document.getElementById('busca-produtos')?.value || '');
    }
  } catch (err) {
    alert('❌ Erro ao excluir: ' + err.message);
  }
};

// =============== FUNÇÕES DO CARRINHO ===============
window.adicionarAoCarrinho = function(id, nome, preco, estoque, quantidade = 1) {
  if (estoque <= 0) {
    alert('❌ Produto esgotado!');
    return;
  }
  
  let carrinho = JSON.parse(localStorage.getItem('carrinho-feira')) || [];
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    if (itemExistente.quantidade + quantidade > estoque) {
        alert(`⚠️ Você já tem ${itemExistente.quantidade} unidades. O limite de estoque é ${estoque}.`);
        return;
    }
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({ id, nome, preco, quantidade, estoque });
  }

  localStorage.setItem('carrinho-feira', JSON.stringify(carrinho));
  alert(`✅ ${nome} adicionado ao carrinho!`);

  // Se a função existir na página (index, produto, carrinho), atualiza o ícone
  if (typeof atualizarQtdCarrinho === 'function') atualizarQtdCarrinho();
};


// =============== LISTAGEM E FILTRAGEM DE PRODUTOS (INDEX.HTML) ===============

// 1. Função principal para renderizar o grid de produtos
function renderizarProdutos(produtosParaExibir, termoBusca = '') {
  const container = document.getElementById('lista-produtos');
  
  if (!container) return; // Só executa se estiver na index.html

  // Se não houver produtos, exibe uma mensagem
  if (!produtosParaExibir || produtosParaExibir.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding: 50px;">Nenhum produto encontrado ${termoBusca ? `para "${termoBusca}"` : ''} nesta seção.</p>`;
    return;
  }

  container.innerHTML = ''; // Limpa o conteúdo
  
  produtosParaExibir.forEach(p => {
    const estaEsgotado = p.estoque <= 0;
    
    const imagemUrl = p.imagem || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f0f0f0"/></svg>';

    const estoqueMsg = estaEsgotado
      ? `<p style="color:red; font-weight:600;">❌ Esgotado</p>`
      : `<p>📦 ${p.estoque} unid.</p>`;

    // Botões de Admin (Excluir)
    const adminBotoes = ehAdmin() ? 
        `<div class="admin-botoes">
            <button class="btn-excluir" onclick="excluirProduto('${p.id}')">X</button>
        </div>` : '';

    const botaoCarrinho = estaEsgotado 
        ? `<button disabled style="background-color: #ccc; cursor: not-allowed;">Esgotado</button>`
        : `<button onclick="adicionarAoCarrinho('${p.id}', '${p.nome}', ${p.preco}, ${p.estoque})">🛒 Adicionar</button>`;

    const card = document.createElement('div');
    card.className = 'produto';
    
    if (estaEsgotado) {
        card.classList.add('esgotado');
    }

    card.innerHTML = `
      <a href="produto.html?id=${p.id}" style="text-decoration:none; color:inherit; display:block;">
        ${adminBotoes}
        <img src="${imagemUrl}" alt="${p.nome}" loading="lazy">
        <h3>${p.nome || 'Sem nome'}</h3>
        <p style="font-size:0.9rem; color:#666;">${p.departamento}</p>
        <div class="preco">R$ ${typeof p.preco === 'number' ? p.preco.toFixed(2) : '0.00'}</div>
        ${estoqueMsg}
      </a>
      ${botaoCarrinho}
    `;
    container.appendChild(card);
  });
}

// 2. Função para carregar todos os produtos e inicializar a listagem
async function carregarProdutosIniciais(filtroBusca = '') {
  const container = document.getElementById('lista-produtos');
  
  // Só carrega se estiver na index.html
  if (!container) return; 

  container.innerHTML = '<p class="carregando">Carregando produtos...</p>';
  
  try {
    const snapshot = await db.collection('produtos').orderBy('criadoEm', 'desc').get();
    
    // Mapeia os dados, armazenando o ID e o restante dos campos
    todosOsProdutos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Inicializa a listagem com o filtro de busca, se houver
    aplicarFiltros(filtroDepartamentoAtual, filtroBusca);

  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    container.innerHTML = '<p class="carregando" style="color: red;">❌ Erro ao carregar os produtos do Firebase.</p>';
  }
}

// 3. Função para carregar e montar o menu de categorias
async function carregarMenuCategorias() {
    const categorias = ['todos'];
    const categoriasSet = new Set();
    
    // Coleta as categorias de todos os produtos
    todosOsProdutos.forEach(p => {
        if (p.departamento) categoriasSet.add(p.departamento);
    });
    
    // Converte o Set para Array e ordena
    const categoriasOrdenadas = Array.from(categoriasSet).sort();
    categorias.push(...categoriasOrdenadas);

    const menu = document.getElementById('menu-categorias');
    const btn = document.getElementById('btn-categorias');
    
    if (!menu || !btn) return; // Sai se não estiver na index.html

    menu.innerHTML = '';
    
    categorias.forEach(cat => {
        const catNome = cat === 'todos' ? 'TODOS OS PRODUTOS' : cat;
        
        const div = document.createElement('div');
        div.textContent = catNome.toUpperCase();
        div.setAttribute('data-categoria', cat);
        div.onclick = () => {
            filtroDepartamentoAtual = cat;
            aplicarFiltros(cat);
            // Fecha o menu após o clique
            menu.style.display = 'none'; 
        };
        menu.appendChild(div);
    });

    // Torna o botão visível após o carregamento
    btn.style.display = 'block';
}

// 4. Função que aplica o filtro de departamento E a busca
function aplicarFiltros(departamento, termoBusca) {
  filtroDepartamentoAtual = departamento; 

  // Pega o valor do input, se não foi passado como argumento
  const buscaAtual = termoBusca !== undefined 
      ? termoBusca.toLowerCase() 
      : document.getElementById('busca-produtos')?.value.toLowerCase() || '';

  let produtosFiltrados = todosOsProdutos;

  // Filtro por Departamento
  if (departamento !== 'todos') {
    produtosFiltrados = produtosFiltrados.filter(p => 
      p.departamento && p.departamento.toLowerCase() === departamento.toLowerCase()
    );
  }

  // Filtro por Busca
  if (buscaAtual) {
    produtosFiltrados = produtosFiltrados.filter(p =>
      (p.nome && p.nome.toLowerCase().includes(buscaAtual)) ||
      (p.vendedor && p.vendedor.toLowerCase().includes(buscaAtual)) ||
      (p.departamento && p.departamento.toLowerCase().includes(buscaAtual))
    );
  }

  // Atualiza o título da seção
  const tituloEl = document.getElementById('titulo-secao');
  if (tituloEl) {
    const tituloSecao = departamento === 'todos' 
        ? (buscaAtual ? `Resultados para "${buscaAtual}"` : 'Produtos em Destaque') 
        : `Departamento: ${departamento}`;
        
    tituloEl.textContent = tituloSecao;
  }
  

  renderizarProdutos(produtosFiltrados, buscaAtual);
}

// 5. Adiciona listeners de busca e inicialização
window.addEventListener('load', () => {
    // Só carrega os dados e a lógica de filtro na página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        carregarProdutosIniciais().then(() => {
            carregarMenuCategorias();
        });

        const buscaInput = document.getElementById('busca-produtos');
        if (buscaInput) {
            // Habilita o campo de busca (que estava desabilitado no HTML inline)
            buscaInput.disabled = false;
            // Listener para o campo de busca
            buscaInput.addEventListener('input', (e) => {
                // Aplica o filtro de busca com um pequeno delay para performance
                // O filtro por departamento atual é mantido
                setTimeout(() => aplicarFiltros(filtroDepartamentoAtual, e.target.value), 300);
            });
        }
    }
});