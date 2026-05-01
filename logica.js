// --- 1. VARIÁVEIS GLOBAIS (O estado do jogo) ---
let minhaVida = 10;
let vidaInimigo = 10;
let meuClock = 5;
let meuCampo = [null, null, null, null, null]; 
let campoInimigo = [null, null, null, null, null]; 
let minhaMao = [];
let maoInimigo = [];
let meuBaralho = [];

// --- 2. MOTOR DO BARALHO ---
function prepararBaralho() {
    console.log("Embaralhando deck de 30 cartas...");
    meuBaralho = []; // Limpa o deck antes de gerar
    for (let i = 0; i < 30; i++) {
        if (typeof bancoDeCartas !== 'undefined' && bancoDeCartas.length > 0) {
            let cartaAleatoria = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
            // Cria uma cópia real da carta para não afetar o banco original
            meuBaralho.push({ ...cartaAleatoria });
        } else {
            console.error("ERRO: bancoDeCartas não encontrado! Verifique o cartas.js");
            break;
        }
    }
}

// --- 3. CÁLCULOS E COMBATE ---
function calcularAtaqueReal(carta) {
    let bonus = 0;
    // Verifica se terrenoAtual existe (vem do terrenos.js)
    if (typeof terrenoAtual === 'undefined') return carta.ataque;

    // Bônus de Facção
    if (terrenoAtual.buff === carta.faccao || (Array.isArray(terrenoAtual.buff) && terrenoAtual.buff.includes(carta.faccao))) {
        bonus += 2;
    }
    if (terrenoAtual.nerf === carta.faccao) {
        bonus -= 2;
    }
    
    // Bônus de Nível
    if (terrenoAtual.buffNivel === carta.nivel) bonus += 1;
    if (terrenoAtual.nerfNivel && terrenoAtual.nerfNivel.includes(carta.nivel)) bonus -= 1;
    
    return Math.max(0, carta.ataque + bonus);
}

function atacarComSlot(indexSlot) {
    let minhaCarta = meuCampo[indexSlot];
    if (!minhaCarta) return;

    // NOVIDADE: Custo para atacar (ex: 1 de Clock por ataque)
    const CUSTO_ATAQUE = 1; 

    if (meuClock < CUSTO_ATAQUE) {
        alert("Sem Clock suficiente para realizar o ataque!");
        return;
    }

    let dano = calcularAtaqueReal(minhaCarta);
    let indexAlvoInimigo = campoInimigo.findIndex(s => s !== null);

    // Deduz o custo do ataque
    meuClock -= CUSTO_ATAQUE;

    if (indexAlvoInimigo !== -1) {
        campoInimigo[indexAlvoInimigo].vida -= dano;
        alert(`${minhaCarta.nome} gastou ${CUSTO_ATAQUE} de Clock e causou ${dano} de dano em ${campoInimigo[indexAlvoInimigo].nome}!`);
        if (campoInimigo[indexAlvoInimigo].vida <= 0) {
            campoInimigo[indexAlvoInimigo] = null;
        }
    } else {
        vidaInimigo -= dano;
        alert(`${minhaCarta.nome} atacou o oponente diretamente!`);
    }

    atualizarInterface();
    checarFimDeJogo();
}

// --- 4. AÇÕES DO JOGADOR ---
function tentarJogarNoCampo(indexMao) {
    let carta = minhaMao[indexMao];
    if (meuClock < carta.custo) return alert("Clock (Mana) insuficiente!");

    let slotDestino = -1;
    if (carta.nivel === "BASE") {
        slotDestino = meuCampo.indexOf(null);
    } else {
        // Evolução: Procura no campo alguém que tenha esta carta na trilha
        slotDestino = meuCampo.findIndex(s => s && s.trilha && s.trilha.includes(carta.nome));
    }

    if (slotDestino !== -1) {
        meuClock -= carta.custo;
        meuCampo[slotDestino] = carta; // Substitui se for evolução, ocupa se for base
        minhaMao.splice(indexMao, 1);
        atualizarInterface();
    } else {
        alert("Jogada inválida! Verifique se há espaço ou se a carta anterior está no campo.");
    }
}

function comprarCartas(qtd) {
    for (let i = 0; i < qtd; i++) {
        if (minhaMao.length < 10 && meuBaralho.length > 0) {
            minhaMao.push(meuBaralho.shift());
        }
    }
    // A função atualizarInterface deve estar no interface.js
    if (typeof atualizarInterface === 'function') atualizarInterface();
}

function comprarCartasInimigo(qtd) {
    for (let i = 0; i < qtd; i++) {
        if (maoInimigo.length < 10) {
            // O inimigo puxa cartas do mesmo banco de dados ou de um deck próprio
            let cartaAleatoria = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
            maoInimigo.push({ ...cartaAleatoria });
        }
    }
}

function passarTurno() {
    const btn = document.getElementById("btnPassar");
    btn.disabled = true; // Evita cliques duplos durante o turno da IA

    alert("Turno do Oponente...");
    
    // 1. Inimigo compra cartas
    comprarCartasInimigo(1); 

    // 2. IA joga UMA carta da mão se houver espaço (estratégico)
    let slotVazioIA = campoInimigo.indexOf(null);
    if (slotVazioIA !== -1 && maoInimigo.length > 0) {
        let cartaParaJogar = maoInimigo.shift();
        alert(`Oponente jogou uma carta!`);
        campoInimigo[slotVazioIA] = cartaParaJogar;
    }

    // 3. IA Ataca com todos os personagens que tem no campo
    campoInimigo.forEach(cartaIA => {
        if (cartaIA) {
            let meuSlotAlvo = meuCampo.findIndex(s => s !== null);
            if (meuSlotAlvo !== -1) {
                meuCampo[meuSlotAlvo].vida -= cartaIA.ataque;
                if (meuCampo[meuSlotAlvo].vida <= 0) meuCampo[meuSlotAlvo] = null;
            } else {
                minhaVida -= cartaIA.ataque;
            }
        }
    });

    // 4. Início do seu turno
    setTimeout(() => {
        meuClock += 1;
        comprarCartas(2);
        btn.disabled = false;
        alert("Seu turno! +1 Clock e +2 Cartas.");
        atualizarInterface();
        checarFimDeJogo();
    }, 1000); // Delay de 1s para o jogador ver o que aconteceu
}

function checarFimDeJogo() {
    if (vidaInimigo <= 0) { alert("VITÓRIA! O Campus é seu."); location.reload(); }
    if (minhaVida <= 0) { alert("JUBILADO! Você perdeu."); location.reload(); }
}


// --- 5. INICIALIZAÇÃO ÚNICA ---
function iniciarJogo() {
    console.log("Motor FATEC carregado.");
    prepararBaralho();
    comprarCartas(5);
    if (typeof atualizarInterface === 'function') {
        atualizarInterface();
    } else {
        console.error("ERRO: interface.js não foi carregado corretamente!");
    }
}

window.onload = iniciarJogo;