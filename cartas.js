const bancoDeCartas = [
    // --- RESISTÊNCIA ---
    { nome: "Calouro de Resistência", ataque: 2, vida: 3, custo: 1, faccao: "Resistência", nivel: "BASE", trilha: ["Satoru Cassiano", "Célio", "Gilberto", "Eduardo"] },
    { nome: "Satoru Cassiano", ataque: 4, vida: 5, custo: 3, faccao: "Resistência", nivel: "ESTAGIO 1", evoluiDe: "Calouro de Resistência", trilha: ["Mestre Divino"] },
    { nome: "Mestre Divino", ataque: 10, vida: 4, custo: 6, faccao: "Resistência", nivel: "HEROI", evoluiDe: "Satoru Cassiano" },

    // --- EXÉRCITO ---
    { nome: "Calouro de Exército", ataque: 2, vida: 3, custo: 1, faccao: "Exército", nivel: "BASE", trilha: ["Everson", "Raton", "Mahowillian"] },
    { nome: "General Tomé", ataque: 7, vida: 8, custo: 5, faccao: "Exército", nivel: "ASCENDENTE", evoluiDe: "Mahowillian" },

    // --- NEUTROS ---
    { nome: "Calouro Neutro", ataque: 2, vida: 3, custo: 1, faccao: "Neutros", nivel: "BASE", trilha: ["Valdenir", "Mr Fields", "Daniela", "Argemiro"] },
    { nome: "Argemito", ataque: 5, vida: 5, custo: 4, faccao: "Neutros", nivel: "ASCENDENTE", evoluiDe: "Argemiro" },

    // --- JUBILADOS ---
    { nome: "Julius Caesar", ataque: 9, vida: 1, custo: 5, faccao: "Neutros", nivel: "JUBILADOS" }
];