// ── SISTEMA DE NOTIFICAÇÃO (substitui alert()) ──
let _notifTimer = null;
function notificar(msg, duracao) {
    duracao = duracao || 2800;
    const el = document.getElementById("notificacao");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("visivel");
    clearTimeout(_notifTimer);
    _notifTimer = setTimeout(() => el.classList.remove("visivel"), duracao);
}

function addLog(msg) {
    const log = document.getElementById("log-combate");
    if (!log) return;
    const linha = document.createElement("div");
    linha.textContent = "› " + msg;
    log.prepend(linha);
    while (log.children.length > 6) log.removeChild(log.lastChild);
}

function atualizarInterface() {
    const vInimigo = document.getElementById("vidaInimigo");
    const mVida    = document.getElementById("minhaVida");
    const mClock   = document.getElementById("meuClock");
    if (vInimigo) vInimigo.innerText = vidaInimigo;
    if (mVida)    mVida.innerText    = minhaVida;
    if (mClock)   mClock.innerText   = meuClock;
    if (terrenoAtual) {
        const nTerreno = document.getElementById("nomeTerreno");
        const eTerreno = document.getElementById("efeitoTerreno");
        if (nTerreno) nTerreno.innerText = terrenoAtual.nome;
        if (eTerreno) eTerreno.innerText = terrenoAtual.desc;
    }
    renderizarMao();
    renderizarMaoInimigo();
    renderizarCampo();
}

function renderizarMao() {
    const divMao = document.getElementById("minha-mao");
    if (!divMao) return;
    divMao.innerHTML = "";
    minhaMao.forEach((carta, index) => {
        let btn = document.createElement("button");
        btn.className = "carta-mao";
        const podePagar = meuClock >= carta.custo;
        if (!podePagar) btn.style.opacity = "0.45";
        btn.innerHTML =
            '<div>' +
                '<div class="carta-nome">' + carta.nome + '</div>' +
                '<div class="carta-faccao">' + carta.faccao + ' · ' + carta.nivel + '</div>' +
            '</div>' +
            '<div class="carta-custo">' + carta.custo + '</div>' +
            '<div class="carta-footer">' +
                '<span class="c-atk">⚔ ' + carta.ataque + '</span>' +
                '<span class="c-hp">♥ ' + carta.vida + '</span>' +
            '</div>';
        btn.title = 'Custo: ' + carta.custo + ' | ATK: ' + carta.ataque + ' | HP: ' + carta.vida;
        btn.onclick = (function(i){ return function(){ tentarJogarNoCampo(i); }; })(index);
        divMao.appendChild(btn);
    });
}

function renderizarMaoInimigo() {
    const divMaoInimigo = document.getElementById("mao-inimigo");
    if (!divMaoInimigo) return;
    divMaoInimigo.innerHTML = "";
    maoInimigo.forEach(() => {
        let div = document.createElement("div");
        div.className = "carta-mao carta-verso";
        divMaoInimigo.appendChild(div);
    });
}

function renderizarCampo() {
    const divCampoInimigo = document.getElementById("campo-inimigo");
    const divCampoMeu     = document.getElementById("campo-batalha");

    if (divCampoInimigo) {
        divCampoInimigo.innerHTML = '<span class="label-area">CARTAS NO CAMPO — INIMIGO</span>';
        campoInimigo.forEach(function(slot) {
            let div = document.createElement("div");
            div.className = slot ? "slot-campo ocupado" : "slot-campo";
            if (slot) {
                div.innerHTML =
                    '<div class="slot-nome">' + slot.nome + '</div>' +
                    '<div class="slot-nivel">' + slot.nivel + '</div>' +
                    '<div class="slot-stats">' +
                        '<span class="slot-atk">⚔' + slot.ataque + '</span>' +
                        '<span class="slot-hp">♥' + slot.vida + '</span>' +
                    '</div>';
            } else {
                div.innerHTML = '<span style="font-size:18px;opacity:0.15">⬡</span>';
            }
            divCampoInimigo.appendChild(div);
        });
    }

    if (divCampoMeu) {
        divCampoMeu.innerHTML = '<span class="label-area">SEU CAMPO</span>';
        meuCampo.forEach(function(slot, index) {
            let divSlot = document.createElement("div");
            divSlot.className = slot ? "slot-campo ocupado" : "slot-campo";
            if (slot) {
                let atkReal = (typeof calcularAtaqueReal === 'function') ? calcularAtaqueReal(slot) : slot.ataque;
                let atkModificado = atkReal !== slot.ataque;
                divSlot.innerHTML =
                    '<div class="slot-nome">' + slot.nome + '</div>' +
                    '<div class="slot-nivel">' + slot.nivel + '</div>' +
                    '<div class="slot-stats">' +
                        '<span class="slot-atk" style="' + (atkModificado ? 'color:#ffd060' : '') + '">⚔' + atkReal + '</span>' +
                        '<span class="slot-hp">♥' + slot.vida + '</span>' +
                    '</div>';
                divSlot.title = "Clique para atacar";
                divSlot.onclick = (function(i){ return function(){ atacarComSlot(i); }; })(index);
            } else {
                divSlot.innerHTML = '<span style="font-size:18px;opacity:0.15">⬡</span>';
            }
            divCampoMeu.appendChild(divSlot);
        });
    }
}