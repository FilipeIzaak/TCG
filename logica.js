let minhaVida = 10;
let vidaInimigo = 10;
let meuClock = 5;
let meuCampo = [null, null, null, null, null];
let campoInimigo = [null, null, null, null, null];
let minhaMao = [];
let maoInimigo = [];
let meuBaralho = [];
let cartasJaAtacaram = [];

function prepararBaralho() {
    meuBaralho = [];
    for (let i = 0; i < 30; i++) {
        if (typeof bancoDeCartas !== 'undefined' && bancoDeCartas.length > 0) {
            let cartaAleatoria = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
            meuBaralho.push({ ...cartaAleatoria });
        }
    }
}

function calcularAtaqueReal(carta) {
    let bonus = 0;
    if (typeof terrenoAtual === 'undefined') return carta.ataque;
    if (terrenoAtual.buff === carta.faccao || (Array.isArray(terrenoAtual.buff) && terrenoAtual.buff.includes(carta.faccao))) bonus += 2;
    if (terrenoAtual.nerf === carta.faccao) bonus -= 2;
    if (terrenoAtual.buffNivel === carta.nivel) bonus += 1;
    if (terrenoAtual.nerfNivel && terrenoAtual.nerfNivel.includes(carta.nivel)) bonus -= 1;
    return Math.max(0, carta.ataque + bonus);
}

function atacarComSlot(indexSlot) {
    let minhaCarta = meuCampo[indexSlot];
    if (!minhaCarta) return;

    if (cartasJaAtacaram.includes(indexSlot)) {
        notificar(minhaCarta.nome + " já atacou neste turno!");
        return;
    }

    const CUSTO_ATAQUE = 1;
    if (meuClock < CUSTO_ATAQUE) {
        notificar("Sem Clock suficiente para atacar!");
        return;
    }

    let dano = calcularAtaqueReal(minhaCarta);
    let indexAlvoInimigo = campoInimigo.findIndex(function(s){ return s !== null; });

    meuClock -= CUSTO_ATAQUE;
    cartasJaAtacaram.push(indexSlot);

    if (indexAlvoInimigo !== -1) {
        let alvo = campoInimigo[indexAlvoInimigo];
        alvo.vida -= dano;
        addLog(minhaCarta.nome + " causou " + dano + " de dano em " + alvo.nome + "!");
        notificar("⚔ " + minhaCarta.nome + " causou " + dano + " de dano em " + alvo.nome + "!");
        if (alvo.vida <= 0) {
            addLog(alvo.nome + " foi destruído!");
            campoInimigo[indexAlvoInimigo] = null;
        }
    } else {
        vidaInimigo -= dano;
        addLog(minhaCarta.nome + " atacou o oponente diretamente por " + dano + "!");
        notificar("⚔ Ataque direto! " + dano + " de dano no oponente!");
    }

    atualizarInterface();
    checarFimDeJogo();
}

function tentarJogarNoCampo(indexMao) {
    let carta = minhaMao[indexMao];
    if (meuClock < carta.custo) {
        notificar("Clock insuficiente! Custo: " + carta.custo + " | Você tem: " + meuClock);
        return;
    }

    let slotDestino = -1;
    if (carta.nivel === "BASE") {
        slotDestino = meuCampo.indexOf(null);
    } else {
        slotDestino = meuCampo.findIndex(function(s){ return s && s.trilha && s.trilha.includes(carta.nome); });
    }

    if (slotDestino !== -1) {
        meuClock -= carta.custo;
        meuCampo[slotDestino] = carta;
        minhaMao.splice(indexMao, 1);
        addLog(carta.nome + " entrou no campo!");
        notificar("✦ " + carta.nome + " entrou no campo!");
        atualizarInterface();
    } else {
        notificar("Jogada inválida! Sem espaço ou carta anterior ausente no campo.");
    }
}

function comprarCartas(qtd) {
    for (let i = 0; i < qtd; i++) {
        if (minhaMao.length < 10 && meuBaralho.length > 0) {
            minhaMao.push(meuBaralho.shift());
        }
    }
    if (typeof atualizarInterface === 'function') atualizarInterface();
}

function comprarCartasInimigo(qtd) {
    for (let i = 0; i < qtd; i++) {
        if (maoInimigo.length < 10) {
            let cartaAleatoria = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
            maoInimigo.push({ ...cartaAleatoria });
        }
    }
}

function passarTurno() {
    const btn = document.getElementById("btnPassar");
    btn.disabled = true;

    notificar("Turno do Oponente...", 1200);

    setTimeout(function() {
        comprarCartasInimigo(1);

        // IA tenta jogar cartas BASE se houver espaço
        let slotVazioIA = campoInimigo.indexOf(null);
        if (slotVazioIA !== -1 && maoInimigo.length > 0) {
            let cartaBase = maoInimigo.findIndex(function(c){ return c.nivel === "BASE"; });
            let idx = cartaBase !== -1 ? cartaBase : 0;
            let cartaParaJogar = maoInimigo.splice(idx, 1)[0];
            campoInimigo[slotVazioIA] = cartaParaJogar;
            addLog("Oponente jogou " + cartaParaJogar.nome + "!");
        }

        // IA ataca
        campoInimigo.forEach(function(cartaIA) {
            if (cartaIA) {
                let meuSlotAlvo = meuCampo.findIndex(function(s){ return s !== null; });
                if (meuSlotAlvo !== -1) {
                    let alvo = meuCampo[meuSlotAlvo];
                    alvo.vida -= cartaIA.ataque;
                    addLog(cartaIA.nome + " atacou " + alvo.nome + " por " + cartaIA.ataque + "!");
                    if (alvo.vida <= 0) meuCampo[meuSlotAlvo] = null;
                } else {
                    minhaVida -= cartaIA.ataque;
                    addLog(cartaIA.nome + " atacou você diretamente por " + cartaIA.ataque + "!");
                }
            }
        });

        setTimeout(function() {
            meuClock += 1;
            cartasJaAtacaram = [];
            comprarCartas(2);
            btn.disabled = false;
            notificar("Seu turno! +1 Clock e +2 Cartas.", 2500);
            atualizarInterface();
            checarFimDeJogo();
        }, 800);
    }, 1200);
}

function checarFimDeJogo() {
    if (vidaInimigo <= 0) {
        notificar("✦ VITÓRIA! O Campus é seu! ✦", 5000);
        setTimeout(function(){ location.reload(); }, 5000);
    }
    if (minhaVida <= 0) {
        notificar("✝ JUBILADO! Você perdeu. ✝", 5000);
        setTimeout(function(){ location.reload(); }, 5000);
    }
}

function iniciarJogo() {
    prepararBaralho();
    comprarCartas(5);
    if (typeof atualizarInterface === 'function') {
        atualizarInterface();
    }
}

window.onload = iniciarJogo;