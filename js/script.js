// Estado global da aplicação
let gameState = {
    currentScreen: 'login',
    playerName: '',
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    startTime: null,
    endTime: null,
    selectedAnswer: null,
    score: 0,
    qiScore: 0,
    timerInterval: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar tela inicial
    showScreen('login');
}

function setupEventListeners() {
    // Botões da tela de login
    document.getElementById('start-btn').addEventListener('click', handleStartButton);
    document.getElementById('view-ranking-btn').addEventListener('click', () => showRanking());
    
    // Botões da tela de instruções
    document.getElementById('back-to-login-btn').addEventListener('click', () => showScreen('login'));
    document.getElementById('start-test-btn').addEventListener('click', startTest);
    
    // Botões da tela de teste
    document.getElementById('confirm-answer-btn').addEventListener('click', confirmAnswer);
    
    // Opções de resposta
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
    
    // Botões da tela de resultados
    document.getElementById('view-ranking-from-results-btn').addEventListener('click', () => showRanking());
    document.getElementById('new-test-btn').addEventListener('click', resetTest);
    
    // Botões da tela de ranking
    document.getElementById('refresh-ranking-btn').addEventListener('click', loadRanking);
    document.getElementById('clear-ranking-btn').addEventListener('click', clearRanking);
    document.getElementById('back-from-ranking-btn').addEventListener('click', () => showScreen('login'));
    
    // Modal de detalhes
    document.querySelector('.close-modal').addEventListener('click', closePlayerDetailsModal);
    document.getElementById('player-details-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePlayerDetailsModal();
        }
    });
    
    // Enter no campo de nome
    document.getElementById('player-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleStartButton();
        }
    });
}

function handleStartButton() {
    const playerName = document.getElementById('player-name').value.trim();
    
    if (!playerName) {
        alert('Por favor, digite seu nome para continuar.');
        return;
    }
    
    if (playerName.length < 2) {
        alert('O nome deve ter pelo menos 2 caracteres.');
        return;
    }
    
    gameState.playerName = playerName;
    showScreen('instructions');
}

function showScreen(screenName) {
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar tela selecionada
    document.getElementById(screenName + '-screen').classList.add('active');
    gameState.currentScreen = screenName;
}

function startTest() {
    // Preparar perguntas
    gameState.questions = getTestQuestions();
    gameState.currentQuestionIndex = 0;
    gameState.answers = [];
    gameState.selectedAnswer = null;
    gameState.score = 0;
    
    // Iniciar cronômetro
    gameState.startTime = new Date();
    startTimer();
    
    // Mostrar tela do teste
    showScreen('test');
    
    // Exibir nome do jogador
    document.getElementById('player-display').textContent = gameState.playerName;
    
    // Carregar primeira pergunta
    loadCurrentQuestion();
}

function startTimer() {
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!gameState.startTime) return;
    
    const now = new Date();
    const elapsed = Math.floor((now - gameState.startTime) / 1000);
    
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = timeString;
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.endTime = new Date();
}

function loadCurrentQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Atualizar contador de perguntas
    document.getElementById('question-counter').textContent = 
        `Pergunta ${gameState.currentQuestionIndex + 1} de ${gameState.questions.length}`;
    
    // Atualizar texto da pergunta
    document.getElementById('question-text').textContent = question.question;
    
    // Atualizar opções
    question.options.forEach((option, index) => {
        document.getElementById(`option-${index}`).textContent = option;
    });
    
    // Limpar seleção anterior
    clearSelection();
}

function selectOption(event) {
    const optionElement = event.currentTarget;
    const optionIndex = parseInt(optionElement.dataset.option);
    
    // Limpar seleção anterior
    clearSelection();
    
    // Marcar opção selecionada
    optionElement.classList.add('selected');
    gameState.selectedAnswer = optionIndex;
    
    // Habilitar botão de confirmar
    document.getElementById('confirm-answer-btn').disabled = false;
}

function clearSelection() {
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    gameState.selectedAnswer = null;
    document.getElementById('confirm-answer-btn').disabled = true;
}

function confirmAnswer() {
    if (gameState.selectedAnswer === null) return;
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    
    // Registrar resposta
    gameState.answers.push({
        questionId: currentQuestion.id,
        selectedAnswer: gameState.selectedAnswer,
        correctAnswer: currentQuestion.correct,
        isCorrect: gameState.selectedAnswer === currentQuestion.correct
    });
    
    // Atualizar pontuação
    if (gameState.selectedAnswer === currentQuestion.correct) {
        gameState.score++;
    }
    
    // Próxima pergunta ou finalizar teste
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < gameState.questions.length) {
        loadCurrentQuestion();
    } else {
        finishTest();
    }
}

function finishTest() {
    // Parar cronômetro
    stopTimer();
    
    // Calcular QI
    calculateQI();
    
    // Salvar resultado no banco
    saveTestResult();
    
    // Mostrar resultados
    showResults();
}

function calculateQI() {
    const correctAnswers = gameState.score;
    const totalQuestions = gameState.questions.length;
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    
    // Fórmula de QI baseada em acertos e tempo
    // Base: 100 pontos
    // Acertos: até 40 pontos (30 perguntas = 40 pontos máximo)
    // Tempo: bônus/penalidade baseado no tempo (10 minutos = referência)
    
    const baseScore = 100;
    const accuracyScore = (correctAnswers / totalQuestions) * 40;
    
    // Tempo de referência: 10 minutos (600 segundos)
    const referenceTime = 600;
    let timeBonus = 0;
    
    if (timeInSeconds < referenceTime) {
        // Bônus por ser mais rápido (até 20 pontos)
        timeBonus = Math.min(20, (referenceTime - timeInSeconds) / 30);
    } else {
        // Penalidade por ser mais lento (até -20 pontos)
        timeBonus = Math.max(-20, (referenceTime - timeInSeconds) / 60);
    }
    
    gameState.qiScore = Math.round(baseScore + accuracyScore + timeBonus);
    
    // Garantir que o QI esteja em uma faixa razoável
    gameState.qiScore = Math.max(50, Math.min(200, gameState.qiScore));
}

function getQIClassification(qiScore) {
    if (qiScore >= 140) return "Gênio";
    if (qiScore >= 120) return "Muito Superior";
    if (qiScore >= 110) return "Superior";
    if (qiScore >= 90) return "Médio (Normal)";
    if (qiScore >= 80) return "Abaixo da Média";
    if (qiScore >= 70) return "Pontuação Baixa";
    return "Precisa de Mais Prática";
}

async function saveTestResult() {
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    
    try {
        const result = await DatabaseManager.saveResult(
            gameState.playerName,
            gameState.score,
            gameState.qiScore,
            timeInSeconds
        );
        
        if (!result.success) {
            console.error('Erro ao salvar resultado:', result.error);
        }
    } catch (error) {
        console.error('Erro ao salvar resultado:', error);
    }
}

function showResults() {
    // Atualizar elementos da tela de resultados
    document.getElementById('qi-result').textContent = gameState.qiScore;
    document.getElementById('qi-classification').textContent = getQIClassification(gameState.qiScore);
    document.getElementById('score-result').textContent = `${gameState.score}/${gameState.questions.length}`;
    
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    document.getElementById('time-result').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Mostrar tela de resultados
    showScreen('results');
}

function resetTest() {
    // Limpar estado do jogo
    gameState.currentQuestionIndex = 0;
    gameState.questions = [];
    gameState.answers = [];
    gameState.selectedAnswer = null;
    gameState.score = 0;
    gameState.qiScore = 0;
    gameState.startTime = null;
    gameState.endTime = null;
    
    // Parar cronômetro se estiver rodando
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Limpar campo de nome e voltar para login
    document.getElementById('player-name').value = '';
    showScreen('login');
}

// Funções de formatação de tempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}



// Funções adicionais para cálculo e exibição de resultados

function getDetailedQIAnalysis(qiScore, correctAnswers, totalQuestions, timeInSeconds) {
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const timeInMinutes = timeInSeconds / 60;
    
    let analysis = {
        qiScore: qiScore,
        classification: getQIClassification(qiScore),
        accuracy: accuracy.toFixed(1),
        timeFormatted: formatTime(timeInSeconds),
        strengths: [],
        suggestions: []
    };
    
    // Análise de pontos fortes
    if (accuracy >= 90) {
        analysis.strengths.push("Excelente precisão nas respostas");
    } else if (accuracy >= 70) {
        analysis.strengths.push("Boa precisão nas respostas");
    }
    
    if (timeInMinutes <= 8) {
        analysis.strengths.push("Velocidade de raciocínio acima da média");
    } else if (timeInMinutes <= 12) {
        analysis.strengths.push("Velocidade de raciocínio adequada");
    }
    
    // Sugestões de melhoria
    if (accuracy < 70) {
        analysis.suggestions.push("Pratique mais exercícios de lógica e matemática");
    }
    
    if (timeInMinutes > 15) {
        analysis.suggestions.push("Tente resolver problemas similares para melhorar a velocidade");
    }
    
    if (qiScore < 100) {
        analysis.suggestions.push("Continue praticando testes de QI para desenvolver suas habilidades");
    }
    
    return analysis;
}

function animateQIScore(targetScore) {
    const qiElement = document.getElementById('qi-result');
    const duration = 2000; // 2 segundos
    const startTime = Date.now();
    const startScore = 0;
    
    function updateScore() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para animação suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentScore = Math.round(startScore + (targetScore - startScore) * easeOutQuart);
        
        qiElement.textContent = currentScore;
        
        if (progress < 1) {
            requestAnimationFrame(updateScore);
        }
    }
    
    updateScore();
}

function showDetailedResults() {
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const analysis = getDetailedQIAnalysis(
        gameState.qiScore, 
        gameState.score, 
        gameState.questions.length, 
        timeInSeconds
    );
    
    // Animar pontuação de QI
    setTimeout(() => {
        animateQIScore(gameState.qiScore);
    }, 500);
    
    // Adicionar análise detalhada (se houver espaço na interface)
    console.log('Análise detalhada:', analysis);
}

// Função melhorada para calcular QI com mais precisão
function calculateAdvancedQI() {
    const correctAnswers = gameState.score;
    const totalQuestions = gameState.questions.length;
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    
    // Percentual de acertos
    const accuracyRate = correctAnswers / totalQuestions;
    
    // Pontuação base baseada na curva normal de QI
    let baseQI = 100;
    
    // Ajuste baseado na precisão (distribuição normal)
    if (accuracyRate >= 0.95) baseQI = 140; // 95%+ = Gênio
    else if (accuracyRate >= 0.85) baseQI = 125; // 85-94% = Muito Superior
    else if (accuracyRate >= 0.75) baseQI = 115; // 75-84% = Superior
    else if (accuracyRate >= 0.60) baseQI = 105; // 60-74% = Acima da Média
    else if (accuracyRate >= 0.45) baseQI = 95;  // 45-59% = Médio
    else if (accuracyRate >= 0.30) baseQI = 85;  // 30-44% = Abaixo da Média
    else if (accuracyRate >= 0.20) baseQI = 75;  // 20-29% = Limítrofe
    else baseQI = 65; // <20% = Precisa de Prática
    
    // Ajuste baseado no tempo (bônus/penalidade de até ±15 pontos)
    const referenceTime = 600; // 10 minutos
    let timeAdjustment = 0;
    
    if (timeInSeconds < referenceTime * 0.5) {
        // Muito rápido: bônus máximo
        timeAdjustment = 15;
    } else if (timeInSeconds < referenceTime * 0.75) {
        // Rápido: bônus moderado
        timeAdjustment = 10;
    } else if (timeInSeconds < referenceTime) {
        // Normal-rápido: bônus pequeno
        timeAdjustment = 5;
    } else if (timeInSeconds < referenceTime * 1.5) {
        // Normal-lento: sem ajuste
        timeAdjustment = 0;
    } else if (timeInSeconds < referenceTime * 2) {
        // Lento: penalidade pequena
        timeAdjustment = -5;
    } else {
        // Muito lento: penalidade maior
        timeAdjustment = -10;
    }
    
    // Calcular QI final
    gameState.qiScore = Math.round(baseQI + timeAdjustment);
    
    // Garantir limites razoáveis
    gameState.qiScore = Math.max(50, Math.min(200, gameState.qiScore));
}

// Substituir a função calculateQI original
function calculateQI() {
    calculateAdvancedQI();
}

// Função para mostrar estatísticas detalhadas
function showTestStatistics() {
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const accuracy = (gameState.score / gameState.questions.length) * 100;
    
    console.log('=== ESTATÍSTICAS DO TESTE ===');
    console.log(`Jogador: ${gameState.playerName}`);
    console.log(`Acertos: ${gameState.score}/${gameState.questions.length} (${accuracy.toFixed(1)}%)`);
    console.log(`Tempo: ${formatTime(timeInSeconds)}`);
    console.log(`QI Calculado: ${gameState.qiScore}`);
    console.log(`Classificação: ${getQIClassification(gameState.qiScore)}`);
    console.log('============================');
}



// Funções do Ranking Global

async function showRanking() {
    showScreen('ranking');
    await loadRanking();
}

async function loadRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<div class="loading">Carregando ranking...</div>';
    
    try {
        const result = await DatabaseManager.getRanking();
        
        if (result.success && result.data) {
            displayRanking(result.data);
        } else {
            rankingList.innerHTML = '<div class="error">Erro ao carregar ranking. Tente novamente.</div>';
        }
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        rankingList.innerHTML = '<div class="error">Erro ao carregar ranking. Verifique sua conexão.</div>';
    }
}

function displayRanking(rankingData) {
    const rankingList = document.getElementById('ranking-list');
    
    if (!rankingData || rankingData.length === 0) {
        rankingList.innerHTML = '<div class="empty-ranking">Nenhum resultado encontrado. Seja o primeiro a fazer o teste!</div>';
        return;
    }
    
    let rankingHTML = '';
    
    rankingData.forEach((player, index) => {
        const position = index + 1;
        const timeFormatted = formatTime(player.time_seconds);
        const dateFormatted = formatDate(player.created_at);
        
        // Adicionar classes especiais para os primeiros colocados
        let positionClass = '';
        if (position === 1) positionClass = 'first-place';
        else if (position === 2) positionClass = 'second-place';
        else if (position === 3) positionClass = 'third-place';
        
        rankingHTML += `
            <div class="ranking-item ${positionClass}" data-player-id="${player.id}">
                <span class="position">${getPositionDisplay(position)}</span>
                <span class="player-name" title="Clique para ver detalhes">${escapeHtml(player.player_name)}</span>
                <span class="qi-score">${player.qi_score}</span>
                <span class="score">${player.score}/30</span>
                <span class="time">${timeFormatted}</span>
            </div>
        `;
    });
    
    rankingList.innerHTML = rankingHTML;
    
    // Adicionar event listeners para os itens do ranking
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.addEventListener('click', function() {
            const playerId = this.dataset.playerId;
            showPlayerDetails(playerId, rankingData);
        });
    });
}

function getPositionDisplay(position) {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position + 'º';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function clearRanking() {
    const confirmed = confirm(
        'Tem certeza que deseja zerar o ranking?\n\n' +
        'Esta ação irá excluir todos os resultados permanentemente e não pode ser desfeita.'
    );
    
    if (!confirmed) return;
    
    // Confirmação adicional
    const doubleConfirmed = confirm(
        'ATENÇÃO: Esta é sua última chance!\n\n' +
        'Todos os resultados serão perdidos para sempre.\n\n' +
        'Deseja realmente continuar?'
    );
    
    if (!doubleConfirmed) return;
    
    try {
        const result = await DatabaseManager.clearRanking();
        
        if (result.success) {
            alert('Ranking zerado com sucesso!');
            await loadRanking(); // Recarregar ranking vazio
        } else {
            alert('Erro ao zerar ranking. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao zerar ranking:', error);
        alert('Erro ao zerar ranking. Verifique sua conexão.');
    }
}

function showPlayerDetails(playerId, rankingData) {
    const player = rankingData.find(p => p.id == playerId);
    
    if (!player) {
        alert('Jogador não encontrado.');
        return;
    }
    
    // Preencher modal com dados do jogador
    document.getElementById('detail-name').textContent = player.player_name;
    document.getElementById('detail-qi').textContent = player.qi_score;
    document.getElementById('detail-score').textContent = `${player.score}/30 (${((player.score/30)*100).toFixed(1)}%)`;
    document.getElementById('detail-time').textContent = formatTime(player.time_seconds);
    document.getElementById('detail-classification').textContent = getQIClassification(player.qi_score);
    document.getElementById('detail-date').textContent = formatDate(player.created_at);
    
    // Mostrar modal
    document.getElementById('player-details-modal').style.display = 'block';
}

function closePlayerDetailsModal() {
    document.getElementById('player-details-modal').style.display = 'none';
}

// Função para atualizar ranking automaticamente
function startRankingAutoUpdate() {
    if (gameState.currentScreen === 'ranking') {
        setInterval(async () => {
            if (gameState.currentScreen === 'ranking') {
                await loadRanking();
            }
        }, 30000); // Atualizar a cada 30 segundos
    }
}

// Função para buscar posição do jogador atual no ranking
async function getCurrentPlayerRanking() {
    try {
        const result = await DatabaseManager.getRanking();
        
        if (result.success && result.data) {
            const playerPosition = result.data.findIndex(player => 
                player.player_name === gameState.playerName && 
                player.qi_score === gameState.qiScore
            );
            
            if (playerPosition !== -1) {
                return {
                    position: playerPosition + 1,
                    total: result.data.length
                };
            }
        }
    } catch (error) {
        console.error('Erro ao buscar posição do jogador:', error);
    }
    
    return null;
}

// Função para mostrar estatísticas do ranking
async function showRankingStats() {
    try {
        const result = await DatabaseManager.getRanking();
        
        if (result.success && result.data && result.data.length > 0) {
            const data = result.data;
            
            const stats = {
                totalPlayers: data.length,
                averageQI: (data.reduce((sum, player) => sum + player.qi_score, 0) / data.length).toFixed(1),
                highestQI: Math.max(...data.map(p => p.qi_score)),
                lowestQI: Math.min(...data.map(p => p.qi_score)),
                averageScore: (data.reduce((sum, player) => sum + player.score, 0) / data.length).toFixed(1),
                averageTime: formatTime(Math.round(data.reduce((sum, player) => sum + player.time_seconds, 0) / data.length))
            };
            
            console.log('=== ESTATÍSTICAS DO RANKING ===');
            console.log(`Total de jogadores: ${stats.totalPlayers}`);
            console.log(`QI médio: ${stats.averageQI}`);
            console.log(`QI mais alto: ${stats.highestQI}`);
            console.log(`QI mais baixo: ${stats.lowestQI}`);
            console.log(`Pontuação média: ${stats.averageScore}/30`);
            console.log(`Tempo médio: ${stats.averageTime}`);
            console.log('==============================');
            
            return stats;
        }
    } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
    }
    
    return null;
}

// Melhorar a função showResults para incluir posição no ranking
async function showResults() {
    // Atualizar elementos da tela de resultados
    document.getElementById('qi-result').textContent = gameState.qiScore;
    document.getElementById('qi-classification').textContent = getQIClassification(gameState.qiScore);
    document.getElementById('score-result').textContent = `${gameState.score}/${gameState.questions.length}`;
    
    const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    document.getElementById('time-result').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Mostrar tela de resultados
    showScreen('results');
    
    // Animar pontuação após um pequeno delay
    setTimeout(() => {
        animateQIScore(gameState.qiScore);
    }, 500);
    
    // Mostrar estatísticas no console
    showTestStatistics();
    
    // Buscar posição no ranking (após salvar)
    setTimeout(async () => {
        const ranking = await getCurrentPlayerRanking();
        if (ranking) {
            console.log(`Sua posição no ranking: ${ranking.position}º de ${ranking.total} jogadores`);
        }
    }, 2000);
}

// Função para exportar dados do ranking (funcionalidade extra)
async function exportRankingData() {
    try {
        const result = await DatabaseManager.getRanking();
        
        if (result.success && result.data) {
            const csvData = convertToCSV(result.data);
            downloadCSV(csvData, 'ranking_qi_test.csv');
        }
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    }
}

function convertToCSV(data) {
    const headers = ['Posição', 'Nome', 'QI', 'Acertos', 'Tempo (segundos)', 'Data'];
    const rows = data.map((player, index) => [
        index + 1,
        player.player_name,
        player.qi_score,
        player.score,
        player.time_seconds,
        player.created_at
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

