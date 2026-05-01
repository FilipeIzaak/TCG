// --- CONFIGURAÇÕES INICIAIS ---
let minhaVida = 10;
let vidaInimigo = 10;
let meuClock = 5;
const LIMITE_MAO = 10;

// O Campo agora é um array de 5 espaços (como na sua imagem)
let meuCampo = [null, null, null, null, null]; 

// --- BANCO DE DADOS (EXEMPLOS) ---
const bancoDeCartas = [
    { nome: "Calouro Base", ataque: 2, vida: 3, custo: 1, faccao: "Neutros", nivel: "BASE" },
    { nome: "Veterano Redes", ataque: 4, vida: 5, custo: 3, faccao: "Resistência", nivel: "ESTAGIO 1", evoluiDe: "Calouro Base" },
    { nome: "Ascendente de ADS", ataque: 6, vida: 7, custo: 4, faccao: "Resistência", nivel: "ASCENDENTE", evoluiDe: "Veterano Redes" },
    { nome: "Herói Jubilado", ataque: 12, vida: 2, custo: 6, faccao: "Neutros", nivel: "HEROI", evoluiDe: "Ascendente de ADS" }
];

// Deck com 30 cartas (embaralhado aleatoriamente)
let meuBaralho = [];
for(let i=0; i<30; i++) {
    meuBaralho.push({...bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)]});
}

let minhaMao = [];

// --- FUNÇÕES DE INTERFACE ---

function atualizarInterface() {
    document.getElementById("vidaInimigo").innerText = vidaInimigo;
    document.getElementById("minhaVida").innerText = minhaVida;
    document.getElementById("meuClock").innerText = meuClock;
    renderizarMao();
    renderizarCampo();
}

function renderizarMao() {
    const divMao = document.getElementById("minha-mao");
    divMao.innerHTML = ""; 

    minhaMao.forEach((carta, index) => {
        let btn = document.createElement("button");
        btn.className = "carta-mao";
        btn.innerHTML = `<b>${carta.nome}</b><br>ATK: ${carta.ataque} | Custo: ${carta.custo}`;
        btn.onclick = () => tentarJogarNoCampo(index);
        divMao.appendChild(btn);
    });
}

function renderizarCampo() {
    const divCampo = document.getElementById("campo-batalha");
    divCampo.innerHTML = ""; 

    meuCampo.forEach((slot, index) => {
        let divSlot = document.createElement("div");
        divSlot.className = "slot-campo";
        divSlot.style = "border: 1px solid #555; width: 100px; height: 130px; display: inline-block; margin: 5px; vertical-align: top; padding: 5px; font-size: 12px; background: #222; color: white;";
        
        if (slot) {
            divSlot.innerHTML = `<b>${slot.nome}</b><br>ATK: ${slot.ataque}<br>HP: ${slot.vida}`;
            divSlot.onclick = () => atacarComSlot(index);
        } else {
            divSlot.innerText = "Vazio";
        }
        divCampo.appendChild(divSlot);
    });
}

// --- LÓGICA DE JOGO ---

function comprarCartas(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        if (minhaMao.length < LIMITE_MAO && meuBaralho.length > 0) {
            minhaMao.push(meuBaralho.shift());
        }
    }
    atualizarInterface();
}

function tentarJogarNoCampo(indexMao) {
    let cartaParaJogar = minhaMao[indexMao];
    console.log("Tentando jogar:", cartaParaJogar.nome); // Debug no console

    // 1. Verifica se é BASE
    if (cartaParaJogar.nivel === "BASE") {
        let slotLivre = meuCampo.indexOf(null); // Procura slot vazio (null)

        if (slotLivre !== -1) {
            if (meuClock >= cartaParaJogar.custo) {
                executarJogada(indexMao, slotLivre);
            } else {
                alert("Clock insuficiente para este calouro!");
            }
        } else {
            alert("Não há espaço no campo!");
        }
    } 
    // 2. Verifica se é EVOLUÇÃO
    else {
        // Procura se a carta que ela precisa "evoluir de" está no campo
        let slotParaEvoluir = meuCampo.findIndex(slot => slot && slot.nome === cartaParaJogar.evoluiDe);

        if (slotParaEvoluir !== -1) {
            if (meuClock >= cartaParaJogar.custo) {
                executarJogada(indexMao, slotParaEvoluir);
            } else {
                alert("Clock insuficiente para evoluir!");
            }
        } else {
            alert(`Para evoluir, você precisa de um ${cartaParaJogar.evoluiDe} no campo!`);
        }
    }
}

// Essa função faz a troca real dos dados
function executarJogada(indexMao, indexSlot) {
    meuClock -= minhaMao[indexMao].custo;
    meuCampo[indexSlot] = minhaMao[indexMao]; // Coloca no slot
    minhaMao.splice(indexMao, 1); // Tira da mão
    
    console.log("Jogada executada com sucesso!");
    atualizarInterface(); // Isso vai chamar o renderizarCampo e renderizarMao
}

function atacarComSlot(indexSlot) {
    let carta = meuCampo[indexSlot];
    if (!carta) return;

    // Lógica simples: Dano direto no inimigo (por enquanto)
    vidaInimigo -= carta.ataque;
    alert(`${carta.nome} atacou o oponente!`);
    
    atualizarInterface();
    checarFimDeJogo();
}

function passarTurno() {
    document.getElementById("btnPassar").disabled = true;
    
    // Simulação do turno inimigo
    setTimeout(() => {
        alert("Turno do Inimigo!");
        // Inimigo causa 1 de dano direto para testar
        minhaVida -= 1;
        
        // Início do seu novo turno
        meuClock += 1;
        comprarCartas(2); // Regra FATEC: +2 cartas
        
        document.getElementById("btnPassar").disabled = false;
        atualizarInterface();
        checarFimDeJogo();
    }, 1000);
}

function checarFimDeJogo() {
    if (vidaInimigo <= 0) { alert("VITÓRIA! O campus é seu."); location.reload(); }
    if (minhaVida <= 0) { alert("JUBILADO! Você perdeu."); location.reload(); }
}

// --- START DO JOGO ---
comprarCartas(5); // Começa com 5 cartas como no Guia Rápido