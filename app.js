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
        const imagemHtml = p.imagem 
          ? `<img src="${p.imagem}" alt="${p.nome || 'Produto'}" style="max-width:100%; height:auto; border-radius:6px; margin:8px 0;">`
          : '';
        div.innerHTML = `
          <h3>${p.nome || 'Sem nome'}</h3>
          ${imagemHtml}
          <div class="preco">R$ ${typeof p.preco === 'number' ? p.preco.toFixed(2) : p.preco}</div>
          <p><em>Vendedor: ${p.vendedor || 'Anônimo'}</em></p>
          ${p.descricao ? `<p>${p.descricao}</p>` : ''}
          <button onclick="simularCompra()">Comprar (simulado)</button>
        `;
        container.appendChild(div);
      });
    });
}
