// Banco de perguntas do teste de QI
const QI_QUESTIONS = [
    {
        id: 1,
        question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?",
        options: ["24", "32", "30", "28"],
        correct: 1 // índice da resposta correta (32)
    },
    {
        id: 2,
        question: "Se todos os gatos são animais e alguns animais são selvagens, então:",
        options: ["Todos os gatos são selvagens", "Alguns gatos podem ser selvagens", "Nenhum gato é selvagem", "Todos os animais são gatos"],
        correct: 1
    },
    {
        id: 3,
        question: "Qual palavra não pertence ao grupo: Casa, Apartamento, Prédio, Carro",
        options: ["Casa", "Apartamento", "Prédio", "Carro"],
        correct: 3
    },
    {
        id: 4,
        question: "Se 5 máquinas fazem 5 produtos em 5 minutos, quantas máquinas são necessárias para fazer 100 produtos em 100 minutos?",
        options: ["5", "20", "25", "100"],
        correct: 0
    },
    {
        id: 5,
        question: "Qual é o próximo número na sequência: 1, 1, 2, 3, 5, 8, ?",
        options: ["11", "13", "15", "16"],
        correct: 1
    },
    {
        id: 6,
        question: "LIVRO está para LEITURA assim como PIANO está para:",
        options: ["Música", "Teclas", "Som", "Instrumento"],
        correct: 0
    },
    {
        id: 7,
        question: "Se você reorganizar as letras 'CIFÍPAOC', você obtém o nome de:",
        options: ["Um país", "Um animal", "Uma cidade", "Um oceano"],
        correct: 3
    },
    {
        id: 8,
        question: "Qual número está faltando: 3, 7, 15, 31, ?",
        options: ["47", "63", "55", "71"],
        correct: 1
    },
    {
        id: 9,
        question: "Se A = 1, B = 2, C = 3... qual é o valor de CASA?",
        options: ["20", "22", "24", "26"],
        correct: 0
    },
    {
        id: 10,
        question: "Qual forma geométrica tem exatamente 5 lados?",
        options: ["Hexágono", "Pentágono", "Octógono", "Heptágono"],
        correct: 1
    },
    {
        id: 11,
        question: "Se hoje é terça-feira, que dia será daqui a 100 dias?",
        options: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira"],
        correct: 0
    },
    {
        id: 12,
        question: "Qual é o menor número primo maior que 10?",
        options: ["11", "12", "13", "15"],
        correct: 0
    },
    {
        id: 13,
        question: "ÁGUA está para SEDE assim como COMIDA está para:",
        options: ["Fome", "Sabor", "Nutrição", "Digestão"],
        correct: 0
    },
    {
        id: 14,
        question: "Se você tem 12 bolas e 3 são defeituosas, qual a probabilidade de pegar uma bola boa?",
        options: ["25%", "50%", "75%", "90%"],
        correct: 2
    },
    {
        id: 15,
        question: "Qual número vem a seguir: 100, 50, 25, 12.5, ?",
        options: ["6.25", "6", "5", "7.5"],
        correct: 0
    },
    {
        id: 16,
        question: "Se CÓDIGO é escrito como DPEJHP, como TESTE seria escrito?",
        options: ["UFTUF", "SDRSD", "UFTUF", "TFSTF"],
        correct: 0
    },
    {
        id: 17,
        question: "Quantos triângulos você pode formar com 6 pontos, onde nenhum conjunto de 3 pontos é colinear?",
        options: ["15", "18", "20", "24"],
        correct: 2
    },
    {
        id: 18,
        question: "Se um relógio marca 3:15, qual é o ângulo entre os ponteiros?",
        options: ["0°", "7.5°", "15°", "22.5°"],
        correct: 1
    },
    {
        id: 19,
        question: "Qual palavra pode ser formada usando todas as letras de AMOR apenas uma vez?",
        options: ["ROMA", "RAMO", "MORA", "Todas as anteriores"],
        correct: 3
    },
    {
        id: 20,
        question: "Se 2 elevado a x é igual a 64, qual é o valor de x?",
        options: ["4", "5", "6", "7"],
        correct: 2
    },
    {
        id: 21,
        question: "Qual é o próximo termo: Z, Y, X, W, ?",
        options: ["V", "U", "T", "S"],
        correct: 0
    },
    {
        id: 22,
        question: "Se um quadrado tem área 36, qual é seu perímetro?",
        options: ["12", "18", "24", "36"],
        correct: 2
    },
    {
        id: 23,
        question: "MÉDICO está para HOSPITAL assim como PROFESSOR está para:",
        options: ["Livro", "Escola", "Aluno", "Conhecimento"],
        correct: 1
    },
    {
        id: 24,
        question: "Qual número não pertence à série: 2, 3, 6, 7, 8, 14, 15, 30?",
        options: ["8", "7", "6", "3"],
        correct: 0
    },
    {
        id: 25,
        question: "Se você dobrar uma folha de papel 7 vezes, quantas camadas terá?",
        options: ["64", "128", "256", "14"],
        correct: 1
    },
    {
        id: 26,
        question: "Qual é a raiz quadrada de 144?",
        options: ["11", "12", "13", "14"],
        correct: 1
    },
    {
        id: 27,
        question: "Se VERDE = 52 e AZUL = 40, quanto vale ROSA?",
        options: ["45", "48", "52", "56"],
        correct: 1
    },
    {
        id: 28,
        question: "Quantos cubos pequenos cabem em um cubo grande que tem lado 3 vezes maior?",
        options: ["9", "18", "27", "81"],
        correct: 2
    },
    {
        id: 29,
        question: "Se você tem 5 caixas e cada caixa tem 5 gavetas, e cada gaveta tem 5 objetos, quantos objetos há no total?",
        options: ["75", "100", "125", "150"],
        correct: 2
    },
    {
        id: 30,
        question: "Qual é o próximo número na sequência: 1, 4, 9, 16, 25, ?",
        options: ["30", "35", "36", "49"],
        correct: 2
    }
];

// Função para embaralhar as perguntas
function shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Função para obter perguntas do teste
function getTestQuestions() {
    return shuffleQuestions(QI_QUESTIONS);
}

