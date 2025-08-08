// Variáveis globais do jogo
let xp = 0;
let xpNecessario = 100;
let cargoIndex = 0;
const cargos = [
    { nome: "Estagiário", salario: 800, xpPromocao: 100 },
    { nome: "Júnior", salario: 2500, xpPromocao: 250 },
    { nome: "Pleno", salario: 5000, xpPromocao: 500 },
    { nome: "Sênior", salario: 7500, xpPromocao: 1000 },
    { nome: "Coordenador", salario: 10000, xpPromocao: 2000 },
    { nome: "Gerente", salario: 15000, xpPromocao: 5000 },
    { nome: "Diretor", salario: 25000, xpPromocao: Infinity }
];

let perguntasAtivas = [];

// Variáveis globais para o quiz de conhecimentos gerais
let vidas = 3;
let perguntasFeitas = [];
let pontuacaoQuizGeral = 0; // Nova variável para a pontuação do quiz

// Array para armazenar as pontuações do placar
let placarGeral = JSON.parse(localStorage.getItem('placarGeral')) || [];

/**
 * Exibe uma mensagem personalizada na tela.
 * @param {string} mensagem - O texto a ser exibido na mensagem.
 * @param {function} [callback] - Uma função a ser executada após o fechamento da mensagem.
 */
function mostrarMensagem(mensagem, callback) {
    const modal = document.getElementById('message-modal');
    const texto = document.getElementById('message-text');
    const btn = modal.querySelector('button');

    texto.textContent = mensagem;
    modal.style.display = 'flex';

    btn.onclick = () => {
        fecharMensagem();
        if (callback) {
            callback();
        }
    };
}

/**
 * Fecha a janela de mensagem personalizada.
 */
function fecharMensagem() {
    document.getElementById('message-modal').style.display = 'none';
}

/**
 * Atualiza o status do jogador na interface.
 */
function atualizarStatus() {
    document.getElementById('cargo-nome').textContent = cargos[cargoIndex].nome;
    document.getElementById('salario-valor').textContent = cargos[cargoIndex].salario;
    document.getElementById('xp-atual').textContent = xp;
    document.getElementById('xp-necessario').textContent = cargos[cargoIndex].xpPromocao;
    xpNecessario = cargos[cargoIndex].xpPromocao;

    if (xp >= xpNecessario && cargoIndex < cargos.length - 1) {
        promover();
    }
}

/**
 * Promove o jogador para o próximo cargo.
 */
function promover() {
    cargoIndex++;
    xp = 0;
    mostrarMensagem(`Parabéns! Você foi promovido para ${cargos[cargoIndex].nome}!`, atualizarStatus);
}

/**
 * Inicia o minijogo selecionado.
 * @param {string} tipo - O tipo de minijogo a ser iniciado ('email', 'codigo', 'apresentacao', 'reuniao').
 */
function iniciarMinijogo(tipo) {
    const minigameContainer = document.getElementById('minigame-container');
    document.getElementById('game-content').style.display = 'none';
    document.getElementById('placar-container').style.display = 'none'; // Esconde o placar se estiver visível
    minigameContainer.innerHTML = '';

    switch(tipo) {
        case 'email':
            quizEmails(minigameContainer);
            break;
        case 'codigo':
            quizCodigo(minigameContainer);
            break;
        case 'apresentacao':
            quizApresentacao(minigameContainer);
            break;
        case 'reuniao':
            quizReuniao(minigameContainer);
            break;
        case 'tudo':
            quizTudo(minigameContainer);
            break;
    }
}

/**
 * Retorna à tela principal do escritório virtual.
 */
function voltarAoPC() {
    document.getElementById('game-content').style.display = 'block';
    document.getElementById('minigame-container').innerHTML = '';
    document.getElementById('placar-container').style.display = 'none';
    atualizarStatus();
}

/**
 * Adiciona ou remove XP do jogador.
 * @param {number} quantidade - A quantidade de XP a ser adicionada (pode ser negativa).
 */
function adicionarXp(quantidade) {
    xp += quantidade;
    if (quantidade > 0) {
        mostrarMensagem(`Você ganhou ${quantidade} XP!`);
    } else {
        mostrarMensagem(`Oops, resposta incorreta! Você perdeu ${Math.abs(quantidade)} XP!`);
    }
    setTimeout(voltarAoPC, 1500); // Adiciona um pequeno delay para a mensagem ser lida
}

/**
 * Retorna o array de perguntas do quiz ativo.
 * @returns {Array} O array de perguntas.
 */
function getQuizPerguntas() {
    return perguntasAtivas;
}

/**
 * Renderiza a interface do quiz na tela.
 * @param {HTMLElement} container - O elemento HTML onde o quiz será renderizado.
 * @param {Array} perguntas - O array de perguntas para o quiz.
 * @param {number} xpAcerto - A quantidade de XP a ser ganha em caso de acerto.
 * @param {number} xpErro - A quantidade de XP a ser perdida em caso de erro.
 */
function renderizarQuiz(container, perguntas, xpAcerto, xpErro) {
    perguntasAtivas = perguntas;
    // Escolhe uma pergunta aleatória do array
    const perguntaIndex = Math.floor(Math.random() * perguntas.length);
    const pergunta = perguntas[perguntaIndex];

    container.innerHTML = `
        <h3 class="text-xl font-bold mb-4">Quiz da Tarefa</h3>
        <p class="text-lg mb-6">${pergunta.pergunta}</p>
        <div id="opcoes-quiz" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${pergunta.opcoes.map((opcao, index) =>
                `<button onclick="verificarResposta(${perguntaIndex}, ${index}, ${xpAcerto}, ${xpErro})" class="btn-task">${opcao.texto}</button>`
            ).join('')}
        </div>
    `;
}

// O escopo global da função verificarResposta é necessário para que o onclick funcione.
window.verificarResposta = function(perguntaIndex, indiceOpcao, xpAcerto, xpErro) {
    const quizPerguntas = getQuizPerguntas();
    const respostaCorreta = quizPerguntas[perguntaIndex].opcoes[indiceOpcao].correto;

    if (respostaCorreta) {
        mostrarMensagem("Parabéns! Resposta correta!");
        adicionarXp(xpAcerto);
    } else {
        adicionarXp(xpErro);
    }
};

// --- Funções dos Minijogos (Quizzes) ---

function quizEmails(container) {
    const perguntas = quizEmails_perguntas();
    renderizarQuiz(container, perguntas, 40, -15);
}

function quizCodigo(container) {
    const perguntas = quizCodigo_perguntas();
    renderizarQuiz(container, perguntas, 50, -20);
}

function quizApresentacao(container) {
    const perguntas = quizApresentacao_perguntas();
    renderizarQuiz(container, perguntas, 35, -10);
}

function quizReuniao(container) {
    const perguntas = quizReuniao_perguntas();
    renderizarQuiz(container, perguntas, 45, -20);
}

// Novo minijogo que usa todas as perguntas com sistema de vidas
function quizTudo(container) {
    // Reseta as vidas e as perguntas feitas sempre que o quiz é iniciado
    vidas = 3;
    perguntasFeitas = [];
    pontuacaoQuizGeral = 0; // Zera a pontuação no início do jogo

    const todasPerguntas = [
        ...quizEmails_perguntas(),
        ...quizCodigo_perguntas(),
        ...quizApresentacao_perguntas(),
        ...quizReuniao_perguntas()
    ];

    renderizarQuizComVidas(container, todasPerguntas);
}

/**
 * Renderiza a interface do quiz de conhecimentos gerais com sistema de vidas.
 * @param {HTMLElement} container - O elemento HTML onde o quiz será renderizado.
 * @param {Array} perguntas - O array de perguntas para o quiz.
 */
function renderizarQuizComVidas(container, perguntas) {
    if (vidas <= 0) {
        mostrarMensagem(`Você perdeu todas as suas vidas! Sua pontuação foi de ${pontuacaoQuizGeral} pontos.`);
        // Perdeu, então salva a pontuação se for maior que zero e mostra o placar
        if (pontuacaoQuizGeral > 0) {
            solicitarNomeEsalvarPontuacao();
        } else {
            // Se a pontuação for zero, apenas exibe o placar sem adicionar um novo registro
            setTimeout(exibirPlacar, 2000);
        }
        return;
    }

    let perguntaDisponivel = null;
    let perguntasNaoFeitas = perguntas.filter(p => !perguntasFeitas.includes(p));

    if (perguntasNaoFeitas.length === 0) {
        mostrarMensagem(`Parabéns! Você respondeu a todas as perguntas! Sua pontuação final foi de ${pontuacaoQuizGeral} pontos.`);
        xp += 200; // Recompensa extra por completar o quiz
        solicitarNomeEsalvarPontuacao();
        return;
    }
    
    const perguntaIndex = Math.floor(Math.random() * perguntasNaoFeitas.length);
    perguntaDisponivel = perguntasNaoFeitas[perguntaIndex];
    perguntasAtivas = [perguntaDisponivel]; // Usa a variável global para a verificação de resposta

    container.innerHTML = `
        <h3 class="text-xl font-bold mb-4">Conhecimentos Gerais</h3>
        <p class="text-lg mb-2">Pontuação: <span id="pontuacao-quiz" class="font-bold">${pontuacaoQuizGeral}</span> | Vidas restantes: <span id="vidas-restantes" class="font-bold">${vidas}</span></p>
        <p class="text-lg mb-6">${perguntaDisponivel.pergunta}</p>
        <div id="opcoes-quiz" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${perguntaDisponivel.opcoes.map((opcao, index) =>
                `<button onclick="verificarRespostaComVidas(0, ${index})" class="btn-task">${opcao.texto}</button>`
            ).join('')}
        </div>
    `;
}

// O escopo global da função verificarRespostaComVidas é necessário para que o onclick funcione.
window.verificarRespostaComVidas = function(perguntaIndex, indiceOpcao) {
    const quizPerguntas = perguntasAtivas;
    const respostaCorreta = quizPerguntas[perguntaIndex].opcoes[indiceOpcao].correto;

    if (respostaCorreta) {
        mostrarMensagem("Parabéns! Resposta correta! Você ganhou 50 pontos!");
        pontuacaoQuizGeral += 50;
        perguntasFeitas.push(quizPerguntas[perguntaIndex]); // Adiciona a pergunta ao histórico
        xp += 50;
    } else {
        vidas--;
        pontuacaoQuizGeral = Math.max(0, pontuacaoQuizGeral - 25); // Pontuação não pode ser negativa
        mostrarMensagem(`Oops, resposta incorreta! Você perdeu 1 vida e 25 pontos. Vidas restantes: ${vidas}`);
        xp += -25; // Perde um pouco de XP ao errar
    }

    // Espera a mensagem ser lida e renderiza a próxima pergunta
    setTimeout(() => {
        const container = document.getElementById('minigame-container');
        const todasPerguntas = [
            ...quizEmails_perguntas(),
            ...quizCodigo_perguntas(),
            ...quizApresentacao_perguntas(),
            ...quizReuniao_perguntas()
        ];
        renderizarQuizComVidas(container, todasPerguntas);
        atualizarStatus();
    }, 2000);
};

/**
 * Nova função para solicitar o nome do jogador antes de salvar a pontuação.
 */
function solicitarNomeEsalvarPontuacao() {
    setTimeout(() => {
        const nome = prompt("Parabéns! Qual é o seu nome para o ranking?");
        if (nome) {
            salvarPontuacao(pontuacaoQuizGeral, nome);
        }
        exibirPlacar();
    }, 2000);
}

/**
 * Salva a pontuação e o nome no localStorage e no array do placar.
 * @param {number} pontuacao - A pontuação a ser salva.
 * @param {string} nome - O nome do jogador.
 */
function salvarPontuacao(pontuacao, nome) {
    if (pontuacao > 0) {
        const data = new Date().toLocaleDateString('pt-BR');
        placarGeral.push({ nome: nome, pontuacao: pontuacao, data: data });
        placarGeral.sort((a, b) => b.pontuacao - a.pontuacao); // Ordena do maior para o menor
        placarGeral = placarGeral.slice(0, 10); // Mantém apenas os 10 melhores
        localStorage.setItem('placarGeral', JSON.stringify(placarGeral));
    }
}

/**
 * Exibe a tabela de placar na tela.
 */
function exibirPlacar() {
    document.getElementById('minigame-container').innerHTML = '';
    document.getElementById('game-content').style.display = 'none';
    const placarContainer = document.getElementById('placar-container');
    const placarTbody = placarContainer.querySelector('tbody');
    placarTbody.innerHTML = '';

    if (placarGeral.length === 0) {
        placarTbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma pontuação registrada ainda.</td></tr>';
    } else {
        placarGeral.forEach((item, index) => {
            const row = `<tr>
                            <td class="px-4 py-2">${index + 1}</td>
                            <td class="px-4 py-2">${item.nome}</td>
                            <td class="px-4 py-2">${item.pontuacao}</td>
                            <td class="px-4 py-2">${item.data}</td>
                         </tr>`;
            placarTbody.innerHTML += row;
        });
    }
    
    placarContainer.style.display = 'block';
}


// Funções para retornar os arrays de perguntas (para serem usados em quizTudo)
function quizEmails_perguntas() {
    return [
        { pergunta: "Qual é a unidade básica da vida?", opcoes: [{ texto: "Átomo", correto: false }, { texto: "Célula", correto: true }, { texto: "Molécula", correto: false }] },
        { pergunta: "O processo pelo qual as plantas produzem seu próprio alimento é chamado de:", opcoes: [{ texto: "Respiração", correto: false }, { texto: "Fotossíntese", correto: true }, { texto: "Transpiração", correto: false }] },
        { pergunta: "Qual é o maior órgão do corpo humano?", opcoes: [{ texto: "Cérebro", correto: false }, { texto: "Coração", correto: false }, { texto: "Pele", correto: true }] },
        { pergunta: "Qual é o principal componente dos ossos?", opcoes: [{ texto: "Cálcio", correto: true }, { texto: "Ferro", correto: false }, { texto: "Sódio", correto: false }] },
        { pergunta: "O DNA carrega a informação genética. Qual o seu formato?", opcoes: [{ texto: "Hélice dupla", correto: true }, { texto: "Círculo", correto: false }, { texto: "Linha reta", correto: false }] },
        { pergunta: "O que é um vertebrado?", opcoes: [{ texto: "Um animal sem coluna vertebral", correto: false }, { texto: "Um animal com coluna vertebral", correto: true }, { texto: "Um animal que voa", correto: false }] },
        { pergunta: "Qual é a função do sistema respiratório?", opcoes: [{ texto: "Bombear sangue", correto: false }, { texto: "Obter oxigênio e eliminar dióxido de carbono", correto: true }, { texto: "Digerir alimentos", correto: false }] },
        { pergunta: "Em qual reino se encontram os fungos?", opcoes: [{ texto: "Reino Animalia", correto: false }, { texto: "Reino Fungi", correto: true }, { texto: "Reino Plantae", correto: false }] },
        { pergunta: "Qual é o nome do processo de divisão celular em que uma célula se divide em duas idênticas?", opcoes: [{ texto: "Meiose", correto: false }, { texto: "Mitose", correto: true }, { texto: "Citocinese", correto: false }] },
        { pergunta: "Qual é a principal fonte de energia para a maioria dos ecossistemas na Terra?", opcoes: [{ texto: "Vulcões", correto: false }, { texto: "Energia nuclear", correto: false }, { texto: "O Sol", correto: true }] },
        { pergunta: "Qual é a unidade de medida de força no Sistema Internacional?", opcoes: [{ texto: "Watt", correto: false }, { texto: "Newton", correto: true }, { texto: "Joule", correto: false }] },
        { pergunta: "A lei da gravitação universal foi proposta por qual cientista?", opcoes: [{ texto: "Albert Einstein", correto: false }, { texto: "Isaac Newton", correto: true }, { texto: "Galileu Galilei", correto: false }] },
        { pergunta: "Qual é a velocidade da luz no vácuo?", opcoes: [{ texto: "300.000 km/s", correto: true }, { texto: "343 m/s", correto: false }, { texto: "1.000.000 km/s", correto: false }] },
        { pergunta: "A energia não pode ser criada nem destruída, apenas transformada. Qual é o nome dessa lei?", opcoes: [{ texto: "Lei de Lavoisier", correto: false }, { texto: "Lei da Conservação da Energia", correto: true }, { texto: "Princípio de Arquimedes", correto: false }] },
        { pergunta: "Qual é a unidade de medida de temperatura no SI?", opcoes: [{ texto: "Fahrenheit", correto: false }, { texto: "Celsius", correto: false }, { texto: "Kelvin", correto: true }] },
        { pergunta: "Qual tipo de lente corrige a miopia?", opcoes: [{ texto: "Convexa", correto: false }, { texto: "Côncava", correto: true }, { texto: "Plana", correto: false }] },
        { pergunta: "Qual das seguintes ondas eletromagnéticas possui o menor comprimento de onda?", opcoes: [{ texto: "Ondas de rádio", correto: false }, { texto: "Raios-X", correto: true }, { texto: "Luz visível", correto: false }] },
        { pergunta: "Qual é o elemento químico mais abundante na crosta terrestre?", opcoes: [{ texto: "Hidrogênio", correto: false }, { texto: "Oxigênio", correto: true }, { texto: "Ferro", correto: false }] },
        { pergunta: "A fórmula química da água é...", opcoes: [{ texto: "CO2", correto: false }, { texto: "H2O", correto: true }, { texto: "NaCl", correto: false }] },
        { pergunta: "Qual o pH de uma substância ácida?", opcoes: [{ texto: "Acima de 7", correto: false }, { texto: "Abaixo de 7", correto: true }, { texto: "Exatamente 7", correto: false }] },
        { pergunta: "Qual é o planeta mais próximo do Sol?", opcoes: [{ texto: "Vênus", correto: false }, { texto: "Mercúrio", correto: true }, { texto: "Marte", correto: false }] },
        { pergunta: "Qual é a estrela mais próxima da Terra (além do Sol)?", opcoes: [{ texto: "Sirius", correto: false }, { texto: "Proxima Centauri", correto: true }, { texto: "Alpha Centauri A", correto: false }] },
        { pergunta: "O que é um buraco negro?", opcoes: [{ texto: "Uma região do espaço onde a gravidade é tão forte que nem a luz pode escapar", correto: true }, { texto: "Uma estrela muito brilhante", correto: false }, { texto: "Um planeta com alta gravidade", correto: false }] },
        { pergunta: "Qual a teoria que explica a origem do universo?", opcoes: [{ texto: "Teoria da Evolução", correto: false }, { texto: "Teoria do Big Bang", correto: true }, { texto: "Teoria da Relatividade", correto: false }] },
        { pergunta: "Qual o nome da nossa galáxia?", opcoes: [{ texto: "Andrômeda", correto: false }, { texto: "Via Láctea", correto: true }, { texto: "Galáxia de Bode", correto: false }] },
        { pergunta: "O que é um asteroide?", opcoes: [{ texto: "Uma estrela cadente", correto: false }, { texto: "Um corpo rochoso que orbita o Sol", correto: true }, { texto: "Um cometa", correto: false }] },
        { pergunta: "Qual é o maior planeta do nosso sistema solar?", opcoes: [{ texto: "Saturno", correto: false }, { texto: "Júpiter", correto: true }, { texto: "Urano", correto: false }] },
        { pergunta: "O que é uma supernova?", opcoes: [{ texto: "O nascimento de uma estrela", correto: false }, { texto: "A explosão de uma estrela massiva", correto: true }, { texto: "A colisão de dois planetas", correto: false }] },
        { pergunta: "O que são placas tectônicas?", opcoes: [{ texto: "Grandes rios subterrâneos", correto: false }, { texto: "Grandes blocos da crosta terrestre que se movem", correto: true }, { texto: "Montanhas submersas", correto: false }] },
        { pergunta: "O que é o ciclo da água?", opcoes: [{ texto: "A rotação da Terra", correto: false }, { texto: "O movimento contínuo da água na Terra", correto: true }, { texto: "O derretimento do gelo", correto: false }] },
        { pergunta: "Qual o nome do satélite natural da Terra?", opcoes: [{ texto: "Fobos", correto: false }, { texto: "Lua", correto: true }, { texto: "Titã", correto: false }] },
        { pergunta: "Qual planeta é conhecido como 'o planeta vermelho'?", opcoes: [{ texto: "Júpiter", correto: false }, { texto: "Marte", correto: true }, { texto: "Saturno", correto: false }] },
        { pergunta: "O que significa a sigla 'URL'?", opcoes: [{ texto: "Universal Resource Language", correto: false }, { texto: "Uniform Resource Locator", correto: true }, { texto: "User Registered Login", correto: false }] },
        { pergunta: "O que é 'machine learning'?", opcoes: [{ texto: "Um tipo de jogo de videogame", correto: false }, { texto: "A capacidade de um computador aprender com dados sem ser explicitamente programado", correto: true }, { texto: "Um novo sistema operacional", correto: false }] },
        { pergunta: "Qual é a linguagem de programação mais utilizada para desenvolvimento web, além de HTML e CSS?", opcoes: [{ texto: "Python", correto: false }, { texto: "Java", correto: false }, { texto: "JavaScript", correto: true }] },
        { pergunta: "O que é um 'algoritmo'?", opcoes: [{ texto: "Um erro em um programa de computador", correto: false }, { texto: "Uma sequência de instruções para resolver um problema", correto: true }, { texto: "Um tipo de hardware", correto: false }] },
        { pergunta: "Qual é a função de um firewall em uma rede de computadores?", opcoes: [{ texto: "Aumentar a velocidade da internet", correto: false }, { texto: "Atuar como barreira de segurança, monitorando o tráfego de dados", correto: true }, { texto: "Acelerar o processamento de dados", correto: false }] },
        { pergunta: "O que é 'Realidade Virtual' (VR)?", opcoes: [{ texto: "Uma representação da realidade em 3D", correto: false }, { texto: "Uma simulação de um ambiente gerado por computador", correto: true }, { texto: "Uma nova tecnologia de TV", correto: false }] },
        { pergunta: "Qual a diferença entre um vírus e um malware?", opcoes: [{ texto: "Malware é um termo geral para software malicioso, enquanto vírus é um tipo específico de malware que se auto-replica.", correto: true }, { texto: "Não há diferença", correto: false }, { texto: "Vírus é um termo geral para software malicioso", correto: false }] },
        { pergunta: "O que é 'Big Data'?", opcoes: [{ texto: "Uma grande quantidade de informação que não pode ser processada por softwares tradicionais", correto: true }, { texto: "Um tipo de banco de dados", correto: false }, { texto: "Um sistema operacional antigo", correto: false }] },
        // Novas perguntas de Ciências e TI
        { pergunta: "Qual é a fórmula química do metano?", opcoes: [{ texto: "CH4", correto: true }, { texto: "H2O", correto: false }, { texto: "CO2", correto: false }] },
        { pergunta: "O que é um eclipse solar?", opcoes: [{ texto: "A Terra entre o Sol e a Lua", correto: false }, { texto: "A Lua entre o Sol e a Terra", correto: true }, { texto: "O Sol entre a Terra e a Lua", correto: false }] },
        { pergunta: "Qual é o nome da principal proteína do cabelo e das unhas?", opcoes: [{ texto: "Colágeno", correto: false }, { texto: "Queratina", correto: true }, { texto: "Elastina", correto: false }] },
        { pergunta: "A teoria da evolução das espécies foi proposta por:", opcoes: [{ texto: "Albert Einstein", correto: false }, { texto: "Charles Darwin", correto: true }, { texto: "Isaac Newton", correto: false }] },
        { pergunta: "Qual o nome da camada de gás que nos protege de raios ultravioleta?", opcoes: [{ texto: "Hidrosfera", correto: false }, { texto: "Camada de ozônio", correto: true }, { texto: "Atmosfera", correto: false }] },
        { pergunta: "Qual gás é responsável pela cor amarelada do Sol?", opcoes: [{ texto: "Nitrogênio", correto: false }, { texto: "Oxigênio", correto: false }, { texto: "Hélio", correto: true }] },
        { pergunta: "Qual metal é líquido à temperatura ambiente?", opcoes: [{ texto: "Ferro", correto: false }, { texto: "Alumínio", correto: false }, { texto: "Mercúrio", correto: true }] },
        { pergunta: "Qual a principal função do fígado no corpo humano?", opcoes: [{ texto: "Bombear sangue", correto: false }, { texto: "Filtrar toxinas do sangue", correto: true }, { texto: "Produzir insulina", correto: false }] },
        { pergunta: "O que é um cometa?", opcoes: [{ texto: "Um planeta gasoso", correto: false }, { texto: "Um corpo celeste feito de gelo, poeira e rocha", correto: true }, { texto: "Uma estrela cadente", correto: false }] },
        { pergunta: "Em qual parte da célula a fotossíntese ocorre?", opcoes: [{ texto: "Mitocôndria", correto: false }, { texto: "Núcleo", correto: false }, { texto: "Cloroplasto", correto: true }] },
        { pergunta: "O que é a 'lei da inércia'?", opcoes: [{ texto: "Um corpo em movimento tende a permanecer em movimento", correto: true }, { texto: "A força é igual à massa vezes a aceleração", correto: false }, { texto: "Toda ação tem uma reação oposta e de mesma intensidade", correto: false }] },
        { pergunta: "Qual é a massa atômica aproximada do hidrogênio?", opcoes: [{ texto: "1 u", correto: true }, { texto: "2 u", correto: false }, { texto: "12 u", correto: false }] },
        { pergunta: "Qual é o nome do cientista que descobriu a penicilina?", opcoes: [{ texto: "Louis Pasteur", correto: false }, { texto: "Alexander Fleming", correto: true }, { texto: "Marie Curie", correto: false }] },
        { pergunta: "Qual é a unidade de medida de resistência elétrica?", opcoes: [{ texto: "Volt", correto: false }, { texto: "Ohm", correto: true }, { texto: "Ampere", correto: false }] },
        { pergunta: "O que é um tsunami?", opcoes: [{ texto: "Um tipo de furacão", correto: false }, { texto: "Uma onda gigante causada por terremotos submarinos", correto: true }, { texto: "Uma erupção vulcânica", correto: false }] },
        { pergunta: "Qual a diferença entre clima e tempo?", opcoes: [{ texto: "Não há diferença", correto: false }, { texto: "Clima é um estado atmosférico momentâneo, e tempo é um padrão de longo prazo", correto: false }, { texto: "Clima é um padrão de longo prazo, e tempo é um estado atmosférico momentâneo", correto: true }] },
    ];
    // Duplicando as perguntas para ter mais variedade
    return perguntas.concat(perguntas);
}

function quizCodigo_perguntas() {
    const perguntas = [
        // --- Perguntas sobre Língua Portuguesa ---
        { pergunta: "Qual a classe de palavras que nomeia seres, objetos e lugares?", opcoes: [{ texto: "Verbo", correto: false }, { texto: "Substantivo", correto: true }, { texto: "Adjetivo", correto: false }] },
        { pergunta: "Qual a função do adjetivo?", opcoes: [{ texto: "Indicar ação", correto: false }, { texto: "Modificar o verbo", correto: false }, { texto: "Caracterizar o substantivo", correto: true }] },
        { pergunta: "A palavra 'estranho' é um exemplo de:", opcoes: [{ texto: "Sinônimo de 'comum'", correto: false }, { texto: "Antônimo de 'familiar'", correto: true }, { texto: "Homônimo de 'famoso'", correto: false }] },
        { pergunta: "Qual a conjugação do verbo 'ser' na primeira pessoa do plural no presente do indicativo?", opcoes: [{ texto: "Eu sou", correto: false }, { texto: "Nós somos", correto: true }, { texto: "Eles são", correto: false }] },
        { pergunta: "Qual a figura de linguagem que consiste em uma comparação implícita, sem o uso de conectivos?", opcoes: [{ texto: "Símile", correto: false }, { texto: "Metáfora", correto: true }, { texto: "Hipérbole", correto: false }] },
        { pergunta: "Qual a grafia correta: 'de repente' ou 'derrepente'?", opcoes: [{ texto: "Derrepente", correto: false }, { texto: "De repente", correto: true }, { texto: "De Repente", correto: false }] },
        { pergunta: "Qual a função da vírgula?", opcoes: [{ texto: "Indicar o fim de uma frase", correto: false }, { texto: "Separar elementos de uma oração", correto: true }, { texto: "Enfatizar uma palavra", correto: false }] },
        { pergunta: "Na frase 'Ela é uma fera', qual a figura de linguagem utilizada?", opcoes: [{ texto: "Eufemismo", correto: false }, { texto: "Metáfora", correto: true }, { texto: "Pleonasmo", correto: false }] },
        { pergunta: "Qual a acentuação correta da palavra 'caráter'?", opcoes: [{ texto: "Carater", correto: false }, { texto: "Caratér", correto: false }, { texto: "Caráter", correto: true }] },
        { pergunta: "O que é um pronome?", opcoes: [{ texto: "Uma palavra que indica ação", correto: false }, { texto: "Uma palavra que substitui ou acompanha o substantivo", correto: true }, { texto: "Uma palavra que expressa emoção", correto: false }] },
        { pergunta: "Qual a concordância correta: 'Meio-dia e meia' ou 'Meio-dia e meio'?", opcoes: [{ texto: "Meio-dia e meio", correto: false }, { texto: "Meio-dia e meia", correto: true }, { texto: "Meio-dia e meioa", correto: false }] },
        { pergunta: "Qual o antônimo de 'efêmero'?", opcoes: [{ texto: "Passageiro", correto: false }, { texto: "Perene", correto: true }, { texto: "Volátil", correto: false }] },
        { pergunta: "Onde se usa 'porquê' com acento e junto?", opcoes: [{ texto: "Em perguntas", correto: false }, { texto: "Antes de um substantivo", correto: true }, { texto: "Como conjunção", correto: false }] },
        { pergunta: "Qual a principal função de um prefixo em uma palavra?", opcoes: [{ texto: "Indicar o futuro", correto: false }, { texto: "Alterar o sentido da palavra, vindo antes da raiz", correto: true }, { texto: "Nomear um objeto", correto: false }] },
        { pergunta: "Qual é a forma correta do plural de 'mão'?", opcoes: [{ texto: "Maos", correto: false }, { texto: "Mãos", correto: true }, { texto: "Maõs", correto: false }] },
        { pergunta: "Qual das palavras abaixo não é um verbo?", opcoes: [{ texto: "Correr", correto: false }, { texto: "Brincar", correto: false }, { texto: "Mesa", correto: true }] },
        { pergunta: "Qual a função do advérbio?", opcoes: [{ texto: "Qualificar o substantivo", correto: false }, { texto: "Modificar o verbo, adjetivo ou outro advérbio", correto: true }, { texto: "Substituir o substantivo", correto: false }] },
        { pergunta: "A frase 'Choveu hoje.' tem qual tipo de sujeito?", opcoes: [{ texto: "Sujeito simples", correto: false }, { texto: "Oração sem sujeito", correto: true }, { texto: "Sujeito oculto", correto: false }] },
        { pergunta: "Qual a crase correta: 'Fui à feira' ou 'Fui a feira'?", opcoes: [{ texto: "Fui a feira", correto: false }, { texto: "Fui à feira", correto: true }, { texto: "Fui a feirã", correto: false }] },
        { pergunta: "A palavra 'obrigado' deve concordar com o gênero de quem a diz. 'Ela disse...'?", opcoes: [{ texto: "Obrigado", correto: false }, { texto: "Obrigada", correto: true }, { texto: "Obrigados", correto: false }] },
        { pergunta: "O que é um pleonasmo?", opcoes: [{ texto: "Uma figura de linguagem que exagera uma ideia", correto: false }, { texto: "Uma redundância desnecessária", correto: true }, { texto: "Uma comparação sem conectivo", correto: false }] },
        { pergunta: "Qual a grafia correta da interjeição de surpresa?", opcoes: [{ texto: "Uau!", correto: true }, { texto: "Ual!", correto: false }, { texto: "Uaú!", correto: false }] },
        { pergunta: "Qual é a forma correta do plural de 'pão'?", opcoes: [{ texto: "Pãos", correto: false }, { texto: "Pães", correto: true }, { texto: "Pães", correto: false }] },
        { pergunta: "O que é um hiato?", opcoes: [{ texto: "Duas vogais na mesma sílaba", correto: false }, { texto: "Duas vogais em sílabas separadas", correto: true }, { texto: "Uma vogal e uma semivogal na mesma sílaba", correto: false }] },
        { pergunta: "Qual a regra de acentuação para paroxítonas terminadas em 'r'?", opcoes: [{ texto: "São acentuadas", correto: true }, { texto: "Não são acentuadas", correto: false }, { texto: "Só se acentuam se tiverem 3 sílabas", correto: false }] },
        { pergunta: "O que é um sinônimo?", opcoes: [{ texto: "Palavra com sentido contrário", correto: false }, { texto: "Palavra com sentido semelhante", correto: true }, { texto: "Palavra com a mesma escrita", correto: false }] },
        { pergunta: "Em que frase 'faz' indica tempo decorrido?", opcoes: [{ texto: "Ele faz bolo.", correto: false }, { texto: "Faz dois anos que moro aqui.", correto: true }, { texto: "Faz um favor para mim?", correto: false }] },
        { pergunta: "Qual é a acentuação correta da palavra 'rubrica'?", opcoes: [{ texto: "rúbrica", correto: false }, { texto: "rubrica", correto: true }, { texto: "rubricá", correto: false }] },
        { pergunta: "O que é um pronome possessivo?", opcoes: [{ texto: "Substitui o substantivo", correto: false }, { texto: "Indica posse", correto: true }, { texto: "Modifica o verbo", correto: false }] },
        { pergunta: "Qual o plural de 'cidadão'?", opcoes: [{ texto: "Cidadãos", correto: true }, { texto: "Cidadões", correto: false }, { texto: "Cidadãos", correto: false }] },
        { pergunta: "O que é um verbo transitivo direto?", opcoes: [{ texto: "Não precisa de complemento", correto: false }, { texto: "Precisa de complemento sem preposição", correto: true }, { texto: "Precisa de complemento com preposição", correto: false }] },
        { pergunta: "Qual a figura de linguagem em 'O meu amor é um camelo...'?", opcoes: [{ texto: "Comparação", correto: true }, { texto: "Hipérbole", correto: false }, { texto: "Eufemismo", correto: false }] },
        { pergunta: "Qual a acentuação correta da palavra 'gratuito'?", opcoes: [{ texto: "Gratuíto", correto: false }, { texto: "Gratuito", correto: true }, { texto: "Grátuíto", correto: false }] },
        { pergunta: "Qual o diminutivo de 'casa'?", opcoes: [{ texto: "Casinha", correto: true }, { texto: "Casarão", correto: false }, { texto: "Caseiro", correto: false }] },
        { pergunta: "O que é uma homofonia?", opcoes: [{ texto: "Palavras com a mesma escrita", correto: false }, { texto: "Palavras com o mesmo som, mas grafia e sentido diferentes", correto: true }, { texto: "Palavras com o mesmo sentido", correto: false }] },
        { pergunta: "Qual a correta concordância em 'Havia muitas pessoas'?", opcoes: [{ texto: "Haviam muitas pessoas", correto: false }, { texto: "Havia muitas pessoas", correto: true }, { texto: "Havia muitas pessoa", correto: false }] },
        // Novas perguntas de Português
        { pergunta: "Qual o plural de 'míssil'?", opcoes: [{ texto: "Mísseis", correto: true }, { texto: "Míssis", correto: false }, { texto: "Míssils", correto: false }] },
        { pergunta: "Qual a função do 'porquê' separado e com acento?", opcoes: [{ texto: "Em perguntas diretas ou indiretas, no final da frase", correto: true }, { texto: "No início da frase", correto: false }, { texto: "Substitui um substantivo", correto: false }] },
        { pergunta: "Qual figura de linguagem é 'O carro voava baixo'?", opcoes: [{ texto: "Metáfora", correto: false }, { texto: "Hipérbole", correto: true }, { texto: "Antítese", correto: false }] },
        { pergunta: "O que é um eufemismo?", opcoes: [{ texto: "Exagero intencional", correto: false }, { texto: "Suavização de uma ideia desagradável", correto: true }, { texto: "Uso de palavras com som similar", correto: false }] },
        { pergunta: "Qual o plural de 'guarda-chuva'?", opcoes: [{ texto: "Guarda-chuvas", correto: true }, { texto: "Guardas-chuva", correto: false }, { texto: "Guardas-chuvas", correto: false }] },
        { pergunta: "A frase 'Ele é um anjo' é um exemplo de:", opcoes: [{ texto: "Comparação", correto: false }, { texto: "Metáfora", correto: true }, { texto: "Personificação", correto: false }] },
        { pergunta: "Qual a forma correta do verbo 'pôr' na terceira pessoa do singular do futuro do presente?", opcoes: [{ texto: "Ele porá", correto: true }, { texto: "Ele por", correto: false }, { texto: "Ele poria", correto: false }] },
        { pergunta: "Qual o plural de 'país'?", opcoes: [{ texto: "Países", correto: true }, { texto: "País", correto: false }, { texto: "Paisez", correto: false }] },
        { pergunta: "Qual a diferença entre 'mau' e 'mal'?", opcoes: [{ texto: "Mau é adjetivo, mal é advérbio", correto: true }, { texto: "Mau é advérbio, mal é adjetivo", correto: false }, { texto: "Ambos são adjetivos", correto: false }] },
        { pergunta: "O que é uma oração coordenada assindética?", opcoes: [{ texto: "Unida por vírgulas, sem conjunção", correto: true }, { texto: "Unida por conjunção", correto: false }, { texto: "Depende da oração principal", correto: false }] },
        { pergunta: "A palavra 'mesmo' na frase 'Ele mesmo fez o bolo' é um:", opcoes: [{ texto: "Adjetivo", correto: false }, { texto: "Pronome demonstrativo", correto: true }, { texto: "Advérbio", correto: false }] },
        { pergunta: "Qual a acentuação correta da palavra 'heroico'?", opcoes: [{ texto: "Heróico", correto: false }, { texto: "Heroico", correto: true }, { texto: "Heroíco", correto: false }] },
        { pergunta: "Qual a figura de linguagem que usa a parte pelo todo?", opcoes: [{ texto: "Metonímia", correto: true }, { texto: "Catacrese", correto: false }, { texto: "Sinestesia", correto: false }] },
        { pergunta: "O que é um paradoxo?", opcoes: [{ texto: "Exagero de uma ideia", correto: false }, { texto: "Uso de ideias opostas para causar surpresa", correto: true }, { texto: "Repetição de uma ideia", correto: false }] },
    ];
    // Duplicando as perguntas para ter mais variedade
    return perguntas.concat(perguntas);
}

function quizApresentacao_perguntas() {
    const perguntas = [
        // --- Perguntas sobre a Bíblia ---
        { pergunta: "Quem foi o primeiro homem criado por Deus?", opcoes: [{ texto: "Moisés", correto: false }, { texto: "Abraão", correto: false }, { texto: "Adão", correto: true }] },
        { pergunta: "Qual livro da Bíblia conta a história da criação do mundo?", opcoes: [{ texto: "Gênesis", correto: true }, { texto: "Êxodo", correto: false }, { texto: "Salmos", correto: false }] },
        { pergunta: "Quantos dias e noites durou o dilúvio?", opcoes: [{ texto: "7 dias e 7 noites", correto: false }, { texto: "40 dias e 40 noites", correto: true }, { texto: "10 dias e 10 noites", correto: false }] },
        { pergunta: "Quem libertou o povo de Israel da escravidão no Egito?", opcoes: [{ texto: "Davi", correto: false }, { texto: "Moisés", correto: true }, { texto: "Josué", correto: false }] },
        { pergunta: "O que Deus usou para se comunicar com Moisés no monte Sinai?", opcoes: [{ texto: "Uma árvore falante", correto: false }, { texto: "Uma sarça ardente", correto: true }, { texto: "Um anjo", correto: false }] },
        { pergunta: "Quem foi o rei mais sábio de Israel?", opcoes: [{ texto: "Davi", correto: false }, { texto: "Saul", correto: false }, { texto: "Salomão", correto: true }] },
        { pergunta: "Em que cidade Jesus nasceu?", opcoes: [{ texto: "Nazaré", correto: false }, { texto: "Belém", correto: true }, { texto: "Jerusalém", correto: false }] },
        { pergunta: "Quem traiu Jesus por 30 moedas de prata?", opcoes: [{ texto: "Pedro", correto: false }, { texto: "Judas Iscariotes", correto: true }, { texto: "Tomé", correto: false }] },
        { pergunta: "Quantos discípulos Jesus tinha?", opcoes: [{ texto: "7", correto: false }, { texto: "10", correto: false }, { texto: "12", correto: true }] },
        { pergunta: "Qual é o último livro da Bíblia?", opcoes: [{ texto: "Apocalipse", correto: true }, { texto: "Judas", correto: false }, { texto: "João", correto: false }] },
        { pergunta: "Quem foi jogado na cova dos leões, mas não foi ferido?", opcoes: [{ texto: "José", correto: false }, { texto: "Daniel", correto: true }, { texto: "Sansão", correto: false }] },
        { pergunta: "Qual o nome do gigante que Davi derrotou com uma funda?", opcoes: [{ texto: "Golias", correto: true }, { texto: "Saul", correto: false }, { texto: "Sansão", correto: false }] },
        { pergunta: "Quem construiu a arca para salvar sua família e os animais do dilúvio?", opcoes: [{ texto: "Noé", correto: true }, { texto: "Abraão", correto: false }, { texto: "Moisés", correto: false }] },
        { pergunta: "Qual o nome da mãe de Jesus?", opcoes: [{ texto: "Marta", correto: false }, { texto: "Maria Madalena", correto: false }, { texto: "Maria", correto: true }] },
        { pergunta: "Em qual monte Jesus foi crucificado?", opcoes: [{ texto: "Monte Horebe", correto: false }, { texto: "Monte Calvário", correto: true }, { texto: "Monte Sinai", correto: false }] },
        { pergunta: "Qual o nome do irmão de Moisés que o ajudou a falar com o Faraó?", opcoes: [{ texto: "José", correto: false }, { texto: "Arão", correto: true }, { texto: "Josué", correto: false }] },
        { pergunta: "Quem foi o primeiro mártir cristão?", opcoes: [{ texto: "Paulo", correto: false }, { texto: "Estêvão", correto: true }, { texto: "Pedro", correto: false }] },
        { pergunta: "Qual dos evangelhos não é sinótico?", opcoes: [{ texto: "Marcos", correto: false }, { texto: "Mateus", correto: false }, { texto: "João", correto: true }] },
        { pergunta: "Quantas pragas Deus enviou ao Egito?", opcoes: [{ texto: "7", correto: false }, { texto: "10", correto: true }, { texto: "12", correto: false }] },
        { pergunta: "Qual o nome do anjo que anunciou o nascimento de Jesus?", opcoes: [{ texto: "Miguel", correto: false }, { texto: "Rafael", correto: false }, { texto: "Gabriel", correto: true }] },
        { pergunta: "O que Jesus transformou em vinho no casamento em Caná?", opcoes: [{ texto: "Suco de uva", correto: false }, { texto: "Água", correto: true }, { texto: "Leite", correto: false }] },
        { pergunta: "Onde os 10 mandamentos foram entregues a Moisés?", opcoes: [{ texto: "Monte Sinai", correto: true }, { texto: "Deserto do Saara", correto: false }, { texto: "Canaã", correto: false }] },
        { pergunta: "Quem foi o profeta que foi engolido por um grande peixe?", opcoes: [{ texto: "Elias", correto: false }, { texto: "Jonas", correto: true }, { texto: "Jeremias", correto: false }] },
        { pergunta: "Qual dos apóstolos era cobrador de impostos antes de seguir Jesus?", opcoes: [{ texto: "Pedro", correto: false }, { texto: "João", correto: false }, { texto: "Mateus", correto: true }] },
        { pergunta: "O que é o livro de Salmos?", opcoes: [{ texto: "Livro de profecias", correto: false }, { texto: "Livro de poemas e cânticos", correto: true }, { texto: "Livro de leis", correto: false }] },
        // Novas perguntas bíblicas
        { pergunta: "Qual o nome do Jardim onde Adão e Eva viviam?", opcoes: [{ texto: "Jardim das Oliveiras", correto: false }, { texto: "Jardim do Éden", correto: true }, { texto: "Jardim do Getsemani", correto: false }] },
        { pergunta: "Quem foi o homem mais velho da Bíblia?", opcoes: [{ texto: "Adão", correto: false }, { texto: "Matusalém", correto: true }, { texto: "Noé", correto: false }] },
        { pergunta: "Qual era o nome do irmão de Abel que o matou?", opcoes: [{ texto: "Sete", correto: false }, { texto: "Caim", correto: true }, { texto: "Enos", correto: false }] },
        { pergunta: "Quem foi o apóstolo que negou Jesus três vezes?", opcoes: [{ texto: "Judas", correto: false }, { texto: "Pedro", correto: true }, { texto: "Tomé", correto: false }] },
        { pergunta: "Em qual livro da Bíblia encontramos a história de Sansão?", opcoes: [{ texto: "Juízes", correto: true }, { texto: "Reis", correto: false }, { texto: "Gênesis", correto: false }] },
        { pergunta: "O que Jesus disse ser o 'pão da vida'?", opcoes: [{ texto: "O maná", correto: false }, { texto: "A si mesmo", correto: true }, { texto: "A palavra de Deus", correto: false }] },
        { pergunta: "Qual o nome do pai de Moisés?", opcoes: [{ texto: "Jacó", correto: false }, { texto: "Amram", correto: true }, { texto: "Jocabe", correto: false }] },
        { pergunta: "Qual o livro da Bíblia que narra a história de uma rainha judia que salvou seu povo?", opcoes: [{ texto: "Ester", correto: true }, { texto: "Rute", correto: false }, { texto: "Jó", correto: false }] },
        { pergunta: "Qual o primeiro livro do Novo Testamento?", opcoes: [{ texto: "Gênesis", correto: false }, { texto: "Atos dos Apóstolos", correto: false }, { texto: "Mateus", correto: true }] },
        { pergunta: "Qual apóstolo foi escolhido para substituir Judas Iscariotes?", opcoes: [{ texto: "Barnabé", correto: false }, { texto: "Matias", correto: true }, { texto: "Paulo", correto: false }] },
        { pergunta: "Quem foi o profeta que desafiou os profetas de Baal no Monte Carmelo?", opcoes: [{ texto: "Eliseu", correto: false }, { texto: "Isaías", correto: false }, { texto: "Elias", correto: true }] },
        { pergunta: "Qual é o primeiro mandamento?", opcoes: [{ texto: "Não roubarás", correto: false }, { texto: "Amarás o Senhor teu Deus de todo o teu coração", correto: true }, { texto: "Honra teu pai e tua mãe", correto: false }] },
        { pergunta: "Onde Jesus realizou seu primeiro milagre?", opcoes: [{ texto: "Na Galiléia", correto: false }, { texto: "Em Caná da Galiléia", correto: true }, { texto: "Em Jerusalém", correto: false }] },
        { pergunta: "Qual a última palavra de Jesus na cruz, de acordo com o Evangelho de João?", opcoes: [{ texto: "Meu Deus, por que me desamparaste?", correto: false }, { texto: "Está consumado!", correto: true }, { texto: "Pai, perdoa-lhes, pois não sabem o que fazem.", correto: false }] },
    ];
    // Duplicando as perguntas para ter mais variedade
    return perguntas.concat(perguntas);
}

function quizReuniao_perguntas() {
    const perguntas = [
        // --- Perguntas sobre Matemática ---
        { pergunta: "Qual é o resultado de 7 x 8?", opcoes: [{ texto: "54", correto: false }, { texto: "56", correto: true }, { texto: "64", correto: false }] },
        { pergunta: "Qual é a raiz quadrada de 81?", opcoes: [{ texto: "8", correto: false }, { texto: "9", correto: true }, { texto: "11", correto: false }] },
        { pergunta: "Quanto é 15% de 200?", opcoes: [{ texto: "25", correto: false }, { texto: "30", correto: true }, { texto: "35", correto: false }] },
        { pergunta: "Qual é o valor de π (pi) aproximado?", opcoes: [{ texto: "3,14", correto: true }, { texto: "3,41", correto: false }, { texto: "3,18", correto: false }] },
        { pergunta: "Qual é o resultado de 100 / 4 - 5?", opcoes: [{ texto: "20", correto: true }, { texto: "25", correto: false }, { texto: "15", correto: false }] },
        { pergunta: "Um triângulo que possui todos os lados de tamanhos diferentes é chamado de:", opcoes: [{ texto: "Equilátero", correto: false }, { texto: "Isósceles", correto: false }, { texto: "Escaleno", correto: true }] },
        { pergunta: "Qual é o valor de 5³?", opcoes: [{ texto: "15", correto: false }, { texto: "125", correto: true }, { texto: "25", correto: false }] },
        { pergunta: "Qual a soma dos ângulos internos de um triângulo?", opcoes: [{ texto: "90 graus", correto: false }, { texto: "180 graus", correto: true }, { texto: "360 graus", correto: false }] },
        { pergunta: "Em uma fração, qual o nome do número de cima?", opcoes: [{ texto: "Denominador", correto: false }, { texto: "Numerador", correto: true }, { texto: "Divisor", correto: false }] },
        { pergunta: "Qual é o sucessor do número 99?", opcoes: [{ texto: "98", correto: false }, { texto: "100", correto: true }, { texto: "101", correto: false }] },
        { pergunta: "Qual é o valor de 2 + 2 x 2?", opcoes: [{ texto: "8", correto: false }, { texto: "6", correto: true }, { texto: "4", correto: false }] },
        { pergunta: "Quantos centímetros tem 1 metro?", opcoes: [{ texto: "10", correto: false }, { texto: "100", correto: true }, { texto: "1000", correto: false }] },
        { pergunta: "Qual o resultado de 10 - 2 x 3?", opcoes: [{ texto: "24", correto: false }, { texto: "4", correto: true }, { texto: "20", correto: false }] },
        { pergunta: "A área de um quadrado com lado de 5 cm é:", opcoes: [{ texto: "10 cm²", correto: false }, { texto: "25 cm²", correto: true }, { texto: "20 cm²", correto: false }] },
        { pergunta: "Qual a metade de 250?", opcoes: [{ texto: "100", correto: false }, { texto: "125", correto: true }, { texto: "150", correto: false }] },
        { pergunta: "Quanto é 50% de 50?", opcoes: [{ texto: "100", correto: false }, { texto: "25", correto: true }, { texto: "5", correto: false }] },
        { pergunta: "O que é um número primo?", opcoes: [{ texto: "Número par", correto: false }, { texto: "Número divisível apenas por 1 e por si mesmo", correto: true }, { texto: "Número ímpar", correto: false }] },
        { pergunta: "Qual o valor de 3 elevado à potência de 4?", opcoes: [{ texto: "12", correto: false }, { texto: "81", correto: true }, { texto: "64", correto: false }] },
        { pergunta: "Qual é o dobro de 35?", opcoes: [{ texto: "60", correto: false }, { texto: "70", correto: true }, { texto: "65", correto: false }] },
        { pergunta: "Quantos mililitros tem 1 litro?", opcoes: [{ texto: "100", correto: false }, { texto: "1000", correto: true }, { texto: "10000", correto: false }] },
        { pergunta: "Qual é o resultado de 12 / 6 + 3?", opcoes: [{ texto: "5", correto: true }, { texto: "6", correto: false }, { texto: "9", correto: false }] },
        { pergunta: "Qual o perímetro de um quadrado com lado de 4 cm?", opcoes: [{ texto: "8 cm", correto: false }, { texto: "16 cm", correto: true }, { texto: "12 cm", correto: false }] },
        { pergunta: "Quanto é 1/4 de 80?", opcoes: [{ texto: "20", correto: true }, { texto: "40", correto: false }, { texto: "10", correto: false }] },
        { pergunta: "Qual o resultado de 20 - 5 x 2?", opcoes: [{ texto: "30", correto: false }, { texto: "10", correto: true }, { texto: "15", correto: false }] },
        { pergunta: "Qual o número que vem depois de 39?", opcoes: [{ texto: "40", correto: true }, { texto: "38", correto: false }, { texto: "41", correto: false }] },
        { pergunta: "Qual é o resultado de 10 x 10 + 10?", opcoes: [{ texto: "110", correto: true }, { texto: "100", correto: false }, { texto: "120", correto: false }] },
        { pergunta: "Qual o valor de 2,5 + 3,5?", opcoes: [{ texto: "5", correto: false }, { texto: "6", correto: true }, { texto: "5,5", correto: false }] },
        { pergunta: "Qual a porcentagem que representa a fração 1/2?", opcoes: [{ texto: "25%", correto: false }, { texto: "50%", correto: true }, { texto: "75%", correto: false }] },
        { pergunta: "Qual o valor de 20% de 50?", opcoes: [{ texto: "10", correto: true }, { texto: "5", correto: false }, { texto: "20", correto: false }] },
        { pergunta: "Qual o resultado de (3 + 5) x 2?", opcoes: [{ texto: "13", correto: false }, { texto: "16", correto: true }, { texto: "10", correto: false }] },
        { pergunta: "Qual é a raiz quadrada de 144?", opcoes: [{ texto: "10", correto: false }, { texto: "12", correto: true }, { texto: "14", correto: false }] },
        { pergunta: "Qual o valor de 5²?", opcoes: [{ texto: "10", correto: false }, { texto: "25", correto: true }, { texto: "5", correto: false }] },
        { pergunta: "Qual o resultado de 18 + 2 x 4?", opcoes: [{ texto: "26", correto: true }, { texto: "80", correto: false }, { texto: "24", correto: false }] },
        { pergunta: "Quantos gramas tem 1 quilo?", opcoes: [{ texto: "100", correto: false }, { texto: "1000", correto: true }, { texto: "10", correto: false }] },
        { pergunta: "Qual o resultado de 2 x 3 x 4?", opcoes: [{ texto: "12", correto: false }, { texto: "24", correto: true }, { texto: "18", correto: false }] },
        { pergunta: "Qual é o resultado de 30 / 2 + 10?", opcoes: [{ texto: "25", correto: true }, { texto: "20", correto: false }, { texto: "15", correto: false }] },
        { pergunta: "Qual é o triplo de 15?", opcoes: [{ texto: "30", correto: false }, { texto: "45", correto: true }, { texto: "50", correto: false }] },
        { pergunta: "Qual o valor de 100 / 10?", opcoes: [{ texto: "1", correto: false }, { texto: "10", correto: true }, { texto: "1000", correto: false }] },
        { pergunta: "Qual a soma dos números de 1 a 5?", opcoes: [{ texto: "10", correto: false }, { texto: "15", correto: true }, { texto: "12", correto: false }] },
        { pergunta: "Qual o valor de 20 - (5 x 3)?", opcoes: [{ texto: "5", correto: true }, { texto: "15", correto: false }, { texto: "10", correto: false }] },
        { pergunta: "Qual a área de um retângulo com 4 cm de largura e 6 cm de comprimento?", opcoes: [{ texto: "10 cm²", correto: false }, { texto: "24 cm²", correto: true }, { texto: "20 cm²", correto: false }] },
        { pergunta: "Qual é o resultado de 10²?", opcoes: [{ texto: "20", correto: false }, { texto: "100", correto: true }, { texto: "1000", correto: false }] },
        { pergunta: "Quanto é 75% de 100?", opcoes: [{ texto: "50", correto: false }, { texto: "75", correto: true }, { texto: "25", correto: false }] },
        { pergunta: "Qual o número que vem antes de 50?", opcoes: [{ texto: "51", correto: false }, { texto: "49", correto: true }, { texto: "48", correto: false }] },
        { pergunta: "Qual é o resultado de 10 / 5 + 8?", opcoes: [{ texto: "10", correto: true }, { texto: "2", correto: false }, { texto: "12", correto: false }] },
        { pergunta: "Qual o valor de 1/2 + 1/4?", opcoes: [{ texto: "3/4", correto: true }, { texto: "1/6", correto: false }, { texto: "2/4", correto: false }] },
        { pergunta: "Qual o resultado de 4 x (5 - 3)?", opcoes: [{ texto: "8", correto: true }, { texto: "20", correto: false }, { texto: "12", correto: false }] },
        { pergunta: "Qual a área de um círculo com raio 1?", opcoes: [{ texto: "π", correto: true }, { texto: "2π", correto: false }, { texto: "4", correto: false }] },
        { pergunta: "Qual o valor de 30 - 3 x 5?", opcoes: [{ texto: "15", correto: true }, { texto: "12", correto: false }, { texto: "45", correto: false }] },
        // Novas perguntas de Matemática
        { pergunta: "Qual é o valor de 2,3 x 10?", opcoes: [{ texto: "23", correto: true }, { texto: "2,30", correto: false }, { texto: "0,23", correto: false }] },
        { pergunta: "Quantos segundos tem uma hora?", opcoes: [{ texto: "60", correto: false }, { texto: "3600", correto: true }, { texto: "2400", correto: false }] },
        { pergunta: "Qual é o resultado de 10 - (20 / 5)?", opcoes: [{ texto: "6", correto: true }, { texto: "2", correto: false }, { texto: "10", correto: false }] },
        { pergunta: "Um círculo com diâmetro de 10 cm tem um raio de:", opcoes: [{ texto: "5 cm", correto: true }, { texto: "10 cm", correto: false }, { texto: "20 cm", correto: false }] },
        { pergunta: "Qual o resultado de 2³ + 3²?", opcoes: [{ texto: "17", correto: true }, { texto: "12", correto: false }, { texto: "15", correto: false }] },
        { pergunta: "Quanto é o valor de $1^0 + 0^1$?", opcoes: [{ texto: "0", correto: false }, { texto: "1", correto: true }, { texto: "2", correto: false }] },
        { pergunta: "Em geometria, qual o nome de um polígono com 8 lados?", opcoes: [{ texto: "Heptágono", correto: false }, { texto: "Octógono", correto: true }, { texto: "Eneágono", correto: false }] },
    ];
    // Duplicando as perguntas para ter mais variedade
    return perguntas.concat(perguntas);
}


// Inicia o jogo ao carregar a página
window.onload = atualizarStatus;