const listaTerrenos = [
    { nome: "AMAZON FATEC", desc: "Exército +2 ATK / Resistência -2 ATK", buff: "Exército", nerf: "Resistência" },
    { nome: "OFICINA", desc: "Neutros e Resistência +2 ATK", buff: ["Neutros", "Resistência"] },
    { nome: "CAMPUS CENTRAL", desc: "Calouros +1 ATK / Veteranos e Jubilados -1 ATK", buffNivel: "BASE", nerfNivel: ["ESTAGIO 1", "JUBILADOS"] },
    { nome: "PORTÕES", desc: "Veteranos +1 ATK / Calouros e Jubilados -1 ATK", buffNivel: "ESTAGIO 1", nerfNivel: ["BASE", "JUBILADOS"] }
];

// Sorteia o terreno assim que o arquivo é lido
let terrenoAtual = listaTerrenos[Math.floor(Math.random() * listaTerrenos.length)];
console.log("Terreno sorteado:", terrenoAtual.nome);