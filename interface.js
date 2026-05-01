function atualizarInterface() {
    console.log("Atualizando interface...");
    
    // Atualiza os valores de texto (HP e Clock)
    const vInimigo = document.getElementById("vidaInimigo");
    const mVida = document.getElementById("minhaVida");
    const mClock = document.getElementById("meuClock");

    if(vInimigo) vInimigo.innerText = vidaInimigo;
    if(mVida) mVida.innerText = minhaVida;
    if(mClock) mClock.innerText = meuClock;
    
    // Atualiza o Terreno
    if (terrenoAtual) {
        const nTerreno = document.getElementById("nomeTerreno");
        const eTerreno = document.getElementById("efeitoTerreno");
        if(nTerreno) nTerreno.innerText = terrenoAtual.nome;
        if(eTerreno) eTerreno.innerText = terrenoAtual.desc;
    }

    // Chama todas as funções de desenho
    renderizarMao();
    renderizarMaoInimigo();
    renderizarCampo();
}

function renderizarMao() {
    const divMao = document.getElementById("minha-mao");
    if(!divMao) return;
    divMao.innerHTML = ""; 

    minhaMao.forEach((carta, index) => {
        let btn = document.createElement("button");
        btn.className = "carta-mao";
        // Mostra nome e custo para o jogador saber o que tem
        btn.innerHTML = `<b>${carta.nome}</b><br>Custo: ${carta.custo}`;
        btn.onclick = () => tentarJogarNoCampo(index);
        divMao.appendChild(btn);
    });
}

function renderizarMaoInimigo() {
    const divMaoInimigo = document.getElementById("mao-inimigo");
    if(!divMaoInimigo) return;
    divMaoInimigo.innerHTML = "";

    // Para cada carta na mão do inimigo, desenha apenas o verso
    maoInimigo.forEach(() => {
        let div = document.createElement("div");
        div.className = "carta-mao carta-verso"; 
        divMaoInimigo.appendChild(div);
    });
}

function renderizarCampo() {
    const divCampoInimigo = document.getElementById("campo-inimigo");
    const divCampoMeu = document.getElementById("campo-batalha");

    // 1. Desenha Campo do Inimigo
    if(divCampoInimigo) {
        divCampoInimigo.innerHTML = "";
        campoInimigo.forEach(slot => {
            let div = document.createElement("div");
            div.className = "slot-campo inimigo";
            if (slot) {
                div.innerHTML = `<b>${slot.nome}</b><br>ATK: ${slot.ataque}<br>HP: ${slot.vida}`;
            } else {
                div.innerText = "Vazio";
            }
            divCampoInimigo.appendChild(div);
        });
    }

    // 2. Desenha o Teu Campo (O que estava a faltar!)
    if(divCampoMeu) {
        divCampoMeu.innerHTML = "";
        meuCampo.forEach((slot, index) => {
            let divSlot = document.createElement("div");
            divSlot.className = "slot-campo";
            if (slot) {
                // Calcula o ataque com base no terreno
                let atkReal = (typeof calcularAtaqueReal === 'function') ? calcularAtaqueReal(slot) : slot.ataque;
                divSlot.innerHTML = `<b>${slot.nome}</b><br>ATK: ${atkReal}<br>HP: ${slot.vida}`;
                divSlot.onclick = () => atacarComSlot(index);
            } else {
                divSlot.innerText = "Vazio";
            }
            divCampoMeu.appendChild(divSlot);
        });
    }
}