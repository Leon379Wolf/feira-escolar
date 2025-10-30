// editor.js - Editor visual avançado para Feira Escolar 2025
(function() {
  let painelAtivo = false;
  let modoDesign = false;

  // Atalho: Ctrl+Shift+L (Windows/Linux) ou Cmd+Shift+L (Mac)
  document.addEventListener('keydown', function(e) {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    if (ctrlOrCmd && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      togglePainel();
    }
  });

  function togglePainel() {
    if (painelAtivo) {
      document.getElementById('editor-layout')?.remove();
      painelAtivo = false;
      if (modoDesign) sairModoDesign();
    } else {
      criarPainel();
      painelAtivo = true;
    }
  }

  function criarPainel() {
    const painel = document.createElement('div');
    painel.id = 'editor-layout';
    painel.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        border-left: 2px solid #ddd;
        padding: 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        z-index: 10000;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        font-size: 14px;
      ">
        <h3 style="margin-top: 0; color: var(--cor-principal);">🎨 Editor Avançado</h3>
        <p><em>Pressione Ctrl+Shift+L para fechar</em></p>
        
        <!-- Botão Modo Design -->
        <button onclick="window.editor.toggleModoDesign()" 
                id="btn-modo-design"
                style="background:#006633; color:white; border:none; padding:8px; width:100%; margin:10px 0; cursor:pointer;">
          🎨 Modo Design (Arrastar/Redimensionar)
        </button>

        <!-- Abas -->
        <div style="display:flex; flex-wrap:wrap; gap:4px; margin:10px 0; border-bottom:1px solid #eee; padding-bottom:8px;">
          <button onclick="window.editor.mudarAba('cores')" style="padding:4px 8px; font-size:12px;" id="aba-cores">Cores</button>
          <button onclick="window.editor.mudarAba('textos')" style="padding:4px 8px; font-size:12px;" id="aba-textos">Textos</button>
          <button onclick="window.editor.mudarAba('layout')" style="padding:4px 8px; font-size:12px;" id="aba-layout">Layout</button>
          <button onclick="window.editor.mudarAba('design')" style="padding:4px 8px; font-size:12px;" id="aba-design">Design</button>
          <button onclick="window.editor.mudarAba('temas')" style="padding:4px 8px; font-size:12px;" id="aba-temas">Temas</button>
        </div>

        <!-- Aba Cores -->
        <div id="conteudo-cores" class="aba-conteudo">
          <h4>Cor Principal</h4>
          <input type="color" id="cor-principal" value="#006633" style="width:100%; margin:8px 0;">
          <h4>Cor Secundária</h4>
          <input type="color" id="cor-secundaria" value="#004d26" style="width:100%; margin:8px 0;">
          <h4>Cor de Fundo</h4>
          <input type="color" id="cor-fundo" value="#f9f9f9" style="width:100%; margin:8px 0;">
          <h4>Cor do Cabeçalho</h4>
          <input type="color" id="cor-amarelo" value="#FFD700" style="width:100%; margin:8px 0;">
          <h4>Cor do Texto</h4>
          <input type="color" id="cor-texto" value="#333333" style="width:100%; margin:8px 0;">
          <h4>Cor dos Cards</h4>
          <input type="color" id="cor-card" value="#ffffff" style="width:100%; margin:8px 0;">
          <h4>Cor do Badge (Carrinho)</h4>
          <input type="color" id="cor-badge" value="#e74c3c" style="width:100%; margin:8px 0;">
        </div>

        <!-- Aba Textos -->
        <div id="conteudo-textos" class="aba-conteudo" style="display:none;">
          <h4>Título da Página</h4>
          <input type="text" id="titulo-pagina" value="Feira Escolar 2025" style="width:100%; margin:8px 0; padding:6px;">
          <h4>Placeholder da Busca</h4>
          <input type="text" id="placeholder-busca" value="Buscar produtos..." style="width:100%; margin:8px 0; padding:6px;">
          <h4>Texto do Login</h4>
          <input type="text" id="texto-login" value="Convidado" style="width:100%; margin:8px 0; padding:6px;">
          <h4>Rótulo: Vendedor</h4>
          <input type="text" id="rotulo-vendedor" value="Vendedor" style="width:100%; margin:8px 0; padding:6px;">
          <h4>Mensagem: Disponível</h4>
          <input type="text" id="msg-disponivel" value="📦 Disponível:" style="width:100%; margin:8px 0; padding:6px;">
          <h4>Mensagem: Esgotado</h4>
          <input type="text" id="msg-esgotado" value="❌ Esgotado" style="width:100%; margin:8px 0; padding:6px;">
        </div>

        <!-- Aba Layout -->
        <div id="conteudo-layout" class="aba-conteudo" style="display:none;">
          <h4>Mostrar Elementos</h4>
          <label><input type="checkbox" id="mostrar-busca" checked> Busca</label><br>
          <label><input type="checkbox" id="mostrar-filtro" checked> Filtro</label><br>
          <label><input type="checkbox" id="mostrar-categorias" checked> Categorias</label><br>
          <label><input type="checkbox" id="mostrar-contato" checked> Contato</label><br>
          <label><input type="checkbox" id="mostrar-carrinho" checked> Carrinho</label><br>
          <label><input type="checkbox" id="mostrar-usuario" checked> Usuário</label><br>
          
          <h4>Colunas na Grade</h4>
          <input type="range" id="colunas" min="1" max="6" value="3" style="width:100%; margin:8px 0;">
          <span id="colunas-valor">3 colunas</span>
          
          <h4>Tamanho da Fonte</h4>
          <input type="range" id="font-size" min="12" max="20" value="16" style="width:100%; margin:8px 0;">
          <span id="font-size-valor">16px</span>
          
          <h4>Espaçamento dos Cards</h4>
          <input type="range" id="espacamento" min="10" max="40" value="20" style="width:100%; margin:8px 0;">
          <span id="espacamento-valor">20px</span>
          
          <h4>Altura da Imagem</h4>
          <input type="range" id="altura-imagem" min="100" max="250" value="160" style="width:100%; margin:8px 0;">
          <span id="altura-imagem-valor">160px</span>
          
          <h4>Raio das Bordas</h4>
          <input type="range" id="raio-borda" min="0" max="20" value="12" style="width:100%; margin:8px 0;">
          <span id="raio-borda-valor">12px</span>
        </div>

        <!-- Aba Design Interativo -->
        <div id="conteudo-design" class="aba-conteudo" style="display:none;">
          <h4>Elementos Editáveis</h4>
          <select id="elemento-alvo" style="width:100%; margin:8px 0;">
            <option value="header">Cabeçalho</option>
            <option value="main">Conteúdo Principal</option>
            <option value="busca">Campo de Busca</option>
            <option value="produtos">Grade de Produtos</option>
          </select>
          
          <h4>Posição e Tamanho</h4>
          <label>Top (px): <input type="number" id="pos-top" min="0" style="width:80px;"></label><br>
          <label>Left (px): <input type="number" id="pos-left" min="0" style="width:80px;"></label><br>
          <label>Largura (%): <input type="number" id="largura" min="10" max="100" style="width:80px;"></label><br>
          <label>Altura (px): <input type="number" id="altura" min="100" style="width:80px;"></label><br>
          
          <h4>Margens</h4>
          <label>Margin Top: <input type="number" id="margin-top" min="0" style="width:80px;"></label><br>
          <label>Margin Bottom: <input type="number" id="margin-bottom" min="0" style="width:80px;"></label><br>
        </div>

        <!-- Aba Temas -->
        <div id="conteudo-temas" class="aba-conteudo" style="display:none;">
          <h4>Aplicar Tema Pré-definido</h4>
          <button onclick="window.editor.aplicarTema('supermercado')" style="width:100%; margin:4px 0; padding:6px; background:#006633; color:white; border:none;">Supermercado (Verde/Amarelo)</button>
          <button onclick="window.editor.aplicarTema('minimalista')" style="width:100%; margin:4px 0; padding:6px; background:#6c757d; color:white; border:none;">Minimalista (Cinza)</button>
          <button onclick="window.editor.aplicarTema('festa')" style="width:100%; margin:4px 0; padding:6px; background:#e74c3c; color:white; border:none;">Festa (Colorido)</button>
          <button onclick="window.editor.aplicarTema('escuro')" style="width:100%; margin:4px 0; padding:6px; background:#343a40; color:white; border:none;">Modo Escuro</button>
        </div>

        <!-- Botão Aplicar Alterações -->
        <button onclick="window.editor.aplicarAlteracoes()" 
                style="background:#28a745; color:white; border:none; padding:12px; width:100%; margin:20px 0; font-weight:bold; cursor:pointer;">
          ✅ Aplicar Todas as Alterações
        </button>

        <button onclick="togglePainel()" style="background:#e74c3c; color:white; border:none; padding:8px; width:100%; cursor:pointer;">
          Fechar Editor
        </button>
      </div>
    `;
    document.body.appendChild(painel);
    carregarConfiguracao();
    window.editor.mudarAba('cores');
  }

  function carregarConfiguracao() {
    const cfg = JSON.parse(localStorage.getItem('config-editor') || '{}');
    
    // Cores
    const mapeamentoCores = {
      corPrincipal: 'cor-principal',
      corSecundaria: 'cor-secundaria',
      corFundo: 'cor-fundo',
      corAmarelo: 'cor-amarelo',
      corTexto: 'cor-texto',
      corCard: 'cor-card',
      corBadge: 'cor-badge'
    };

    Object.entries(mapeamentoCores).forEach(([chaveCfg, id]) => {
      const el = document.getElementById(id);
      if (el && cfg[chaveCfg] !== undefined) {
        el.value = cfg[chaveCfg];
      }
    });
    
    // Textos
    const camposTexto = ['tituloPagina', 'placeholderBusca', 'textoLogin', 'rotuloVendedor', 'msgDisponivel', 'msgEsgotado'];
    camposTexto.forEach(campo => {
      const el = document.getElementById(campo.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (el && cfg[campo] !== undefined) {
        el.value = cfg[campo];
      }
    });
    
    // Layout
    const checkboxes = ['mostrarBusca', 'mostrarFiltro', 'mostrarCategorias', 'mostrarContato', 'mostrarCarrinho', 'mostrarUsuario'];
    checkboxes.forEach(id => {
      const el = document.getElementById(id);
      if (el && cfg[id] !== undefined) {
        el.checked = cfg[id];
      }
    });

    // Sliders
    const sliders = ['colunas', 'fontSize', 'espacamento', 'alturaImagem', 'raioBorda'];
    sliders.forEach(id => {
      const el = document.getElementById(id);
      if (el && cfg[id] !== undefined) {
        el.value = cfg[id];
        const valorEl = document.getElementById(`${id}-valor`);
        if (valorEl) {
          valorEl.textContent = id === 'colunas' 
            ? `${cfg[id]} coluna${cfg[id] > 1 ? 's' : ''}`
            : `${cfg[id]}px`;
        }
      }
    });
  }

  function sairModoDesign() {
    modoDesign = false;
    document.querySelectorAll('[style*="dashed"]').forEach(el => {
      el.style.border = '';
      el.style.boxShadow = '';
      el.style.position = '';
    });
    document.querySelectorAll('.alca-redimensionar').forEach(el => el.remove());
  }

  window.editor = {
    mudarAba(aba) {
      document.querySelectorAll('.aba-conteudo').forEach(el => el.style.display = 'none');
      document.getElementById(`conteudo-${aba}`).style.display = 'block';
      document.querySelectorAll('button[id^="aba-"]').forEach(btn => {
        btn.style.fontWeight = btn.id === `aba-${aba}` ? 'bold' : 'normal';
        btn.style.background = btn.id === `aba-${aba}` ? '#f0f0f0' : 'none';
      });
    },

    toggleModoDesign() {
      modoDesign = !modoDesign;
      const btn = document.getElementById('btn-modo-design');
      if (modoDesign) {
        btn.textContent = '🎨 Sair do Modo Design';
        btn.style.background = '#e74c3c';
        this.ativarModoDesign();
      } else {
        btn.textContent = '🎨 Modo Design (Arrastar/Redimensionar)';
        btn.style.background = '#006633';
        sairModoDesign();
      }
    },

    ativarModoDesign() {
      const elementos = {
        header: document.querySelector('header'),
        main: document.querySelector('main'),
        busca: document.querySelector('#busca-produtos')?.parentElement,
        produtos: document.getElementById('produtos')
      };

      Object.values(elementos).forEach(el => {
        if (el) {
          el.style.position = 'relative';
          el.style.border = '2px dashed #006633';
          el.style.boxShadow = '0 0 0 2px rgba(0,102,51,0.3)';
        }
      });

      // Adiciona alças de redimensionamento
      Object.values(elementos).forEach(el => {
        if (!el || el.querySelector('.alca-redimensionar')) return;
        const alca = document.createElement('div');
        alca.className = 'alca-redimensionar';
        alca.style.cssText = `
          position: absolute; 
          bottom: -10px; 
          right: -10px; 
          width: 20px; 
          height: 20px; 
          background: #006633; 
          border-radius: 50%; 
          cursor: nwse-resize;
          z-index: 10001;
        `;
        el.appendChild(alca);

        let isResizing = false;
        alca.addEventListener('mousedown', (e) => {
          isResizing = true;
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = parseInt(getComputedStyle(el).width) || 300;
          const startHeight = parseInt(getComputedStyle(el).height) || 200;

          const doDrag = (e) => {
            if (!isResizing) return;
            const newWidth = Math.max(100, startWidth + (e.clientX - startX));
            const newHeight = Math.max(100, startHeight + (e.clientY - startY));
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
          };

          const stopDrag = () => {
            isResizing = false;
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
          };

          document.addEventListener('mousemove', doDrag);
          document.addEventListener('mouseup', stopDrag);
        });
      });
    },

    aplicarAlteracoes() {
      // Aplica alterações do modo design
      const elemento = document.getElementById('elemento-alvo')?.value;
      const alvos = {
        header: document.querySelector('header'),
        main: document.querySelector('main'),
        busca: document.querySelector('#busca-produtos')?.parentElement,
        produtos: document.getElementById('produtos')
      };
      
      const el = alvos[elemento];
      if (el) {
        const top = document.getElementById('pos-top')?.value;
        const left = document.getElementById('pos-left')?.value;
        const largura = document.getElementById('largura')?.value;
        const altura = document.getElementById('altura')?.value;
        const marginTop = document.getElementById('margin-top')?.value;
        const marginBottom = document.getElementById('margin-bottom')?.value;

        if (top !== undefined && top !== '') el.style.top = top + 'px';
        if (left !== undefined && left !== '') el.style.left = left + 'px';
        if (largura !== undefined && largura !== '') el.style.width = largura + '%';
        if (altura !== undefined && altura !== '') el.style.height = altura + 'px';
        if (marginTop !== undefined && marginTop !== '') el.style.marginTop = marginTop + 'px';
        if (marginBottom !== undefined && marginBottom !== '') el.style.marginBottom = marginBottom + 'px';
      }

      // Aplica cores
      const root = document.documentElement;
      const cores = {
        '--cor-principal': document.getElementById('cor-principal')?.value || '#006633',
        '--cor-secundaria': document.getElementById('cor-secundaria')?.value || '#004d26',
        '--cor-fundo': document.getElementById('cor-fundo')?.value || '#f9f9f9',
        '--cor-amarelo': document.getElementById('cor-amarelo')?.value || '#FFD700',
        '--cor-texto': document.getElementById('cor-texto')?.value || '#333333',
        '--cor-card': document.getElementById('cor-card')?.value || '#ffffff',
        '--espacamento': (document.getElementById('espacamento')?.value || 20) + 'px',
        '--raio-card': (document.getElementById('raio-borda')?.value || 12) + 'px',
        'font-size': (document.getElementById('font-size')?.value || 16) + 'px'
      };
      Object.entries(cores).forEach(([prop, valor]) => root.style.setProperty(prop, valor));

      // Aplica textos
      const textos = {
        'titulo-pagina': document.getElementById('titulo-pagina')?.value || 'Feira Escolar 2025',
        'placeholder-busca': document.getElementById('placeholder-busca')?.value || 'Buscar produtos...',
        'texto-login': document.getElementById('texto-login')?.value || 'Convidado'
      };
      if (textos['titulo-pagina']) document.getElementById('titulo-pagina').textContent = textos['titulo-pagina'];
      if (textos['placeholder-busca']) document.getElementById('busca-produtos').placeholder = textos['placeholder-busca'];
      if (textos['texto-login'] && !sessionStorage.getItem('aluno_logado')) {
        document.getElementById('nome-usuario').textContent = textos['texto-login'];
      }

      // Salva configuração
      const cfg = {
        corPrincipal: cores['--cor-principal'],
        corSecundaria: cores['--cor-secundaria'],
        corFundo: cores['--cor-fundo'],
        corAmarelo: cores['--cor-amarelo'],
        corTexto: cores['--cor-texto'],
        corCard: cores['--cor-card'],
        corBadge: document.getElementById('cor-badge')?.value || '#e74c3c',
        tituloPagina: textos['titulo-pagina'],
        placeholderBusca: textos['placeholder-busca'],
        textoLogin: textos['texto-login'],
        rotuloVendedor: document.getElementById('rotulo-vendedor')?.value || 'Vendedor',
        msgDisponivel: document.getElementById('msg-disponivel')?.value || '📦 Disponível:',
        msgEsgotado: document.getElementById('msg-esgotado')?.value || '❌ Esgotado',
        mostrarBusca: document.getElementById('mostrar-busca')?.checked ?? true,
        mostrarFiltro: document.getElementById('mostrar-filtro')?.checked ?? true,
        mostrarCategorias: document.getElementById('mostrar-categorias')?.checked ?? true,
        mostrarContato: document.getElementById('mostrar-contato')?.checked ?? true,
        mostrarCarrinho: document.getElementById('mostrar-carrinho')?.checked ?? true,
        mostrarUsuario: document.getElementById('mostrar-usuario')?.checked ?? true,
        colunas: document.getElementById('colunas')?.value || 3,
        fontSize: document.getElementById('font-size')?.value || 16,
        espacamento: document.getElementById('espacamento')?.value || 20,
        alturaImagem: document.getElementById('altura-imagem')?.value || 160,
        raioBorda: document.getElementById('raio-borda')?.value || 12,
        urlLogo: document.getElementById('url-logo')?.value || ''
      };
      localStorage.setItem('config-editor', JSON.stringify(cfg));

      // Aplica estilo dinâmico
      const style = document.getElementById('estilo-dinamico') || document.createElement('style');
      style.id = 'estilo-dinamico';
      style.innerHTML = `
        #produtos { grid-template-columns: repeat(${cfg.colunas}, 1fr); }
        .produto img { height: ${cfg.alturaImagem}px !important; }
        .produto button, form button, #botoes button { border-radius: ${cfg.raioBorda}px; }
        .produto { border-radius: ${cfg.raioBorda}px; }
        #qtd-carrinho { background: ${cfg.corBadge} !important; }
      `;
      if (!document.getElementById('estilo-dinamico')) document.head.appendChild(style);

      alert('✅ Todas as alterações foram aplicadas com sucesso!');
    },

    aplicarTema(tipo) {
      let cfg = {};
      switch(tipo) {
        case 'supermercado':
          cfg = { corPrincipal: '#006633', corSecundaria: '#004d26', corAmarelo: '#FFD700', corFundo: '#f9f9f9' };
          break;
        case 'minimalista':
          cfg = { corPrincipal: '#6c757d', corSecundaria: '#5a6268', corAmarelo: '#e9ecef', corFundo: '#ffffff' };
          break;
        case 'festa':
          cfg = { corPrincipal: '#e74c3c', corSecundaria: '#c0392b', corAmarelo: '#f1c40f', corFundo: '#fefefe' };
          break;
        case 'escuro':
          cfg = { corPrincipal: '#3498db', corSecundaria: '#2980b9', corAmarelo: '#343a40', corFundo: '#212529', corTexto: '#f8f9fa', corCard: '#343a40' };
          break;
      }
      Object.keys(cfg).forEach(chave => {
        const id = chave.replace(/([A-Z])/g, '-$1').toLowerCase();
        const el = document.getElementById(id);
        if (el) el.value = cfg[chave];
      });
      alert(`Tema "${tipo}" carregado! Clique em "Aplicar Alterações" para confirmar.`);
    }
  };
})();