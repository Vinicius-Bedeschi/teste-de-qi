# Teste de QI Online - Multiplayer

Um teste de QI interativo e multiplayer onde jogadores podem competir globalmente e ver seus resultados em tempo real.

## 🎯 Funcionalidades

- **Login Simples**: Apenas inserir nome, sem necessidade de cadastro
- **30 Perguntas**: Teste completo com questões de lógica, matemática e raciocínio
- **Cronômetro**: Registra o tempo gasto (sem limite de tempo)
- **Cálculo de QI**: Baseado em acertos e tempo de resposta
- **Ranking Global**: Competição em tempo real com outros jogadores
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🏆 Classificações de QI

- **Acima de 140**: Gênio
- **120-140**: Muito Superior
- **110-120**: Superior
- **90-110**: Médio (Normal)
- **80-90**: Abaixo da Média
- **70-80**: Limítrofe
- **Abaixo de 70**: Precisa de Mais Prática

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **Hospedagem**: Vercel
- **Design**: Responsivo com gradientes modernos

## 📱 Como Usar

1. Acesse o site
2. Digite seu nome
3. Leia as instruções
4. Responda as 30 perguntas
5. Veja seu QI calculado
6. Compare com outros jogadores no ranking

## 🔧 Configuração do Banco de Dados

Para configurar o banco de dados no Supabase, execute o seguinte SQL:

```sql
CREATE TABLE qi_results (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  qi_score INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_qi_results_qi_score ON qi_results(qi_score DESC);
CREATE INDEX idx_qi_results_created_at ON qi_results(created_at DESC);
```

## 🎮 Fórmula de Cálculo do QI

O QI é calculado usando uma fórmula que considera:

1. **Precisão**: Percentual de acertos (peso maior)
2. **Velocidade**: Tempo gasto comparado à referência de 10 minutos
3. **Distribuição Normal**: Baseada em curva de QI padrão

## 📊 Estrutura do Projeto

```
qi_test_game/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos responsivos
├── js/
│   ├── script.js       # Lógica principal
│   ├── database.js     # Integração Supabase
│   └── questions.js    # Banco de perguntas
└── vercel.json         # Configuração Vercel
```

## 🌟 Características Especiais

- **Multiplayer Real**: Jogadores de diferentes dispositivos competem
- **Tempo Real**: Ranking atualiza automaticamente
- **Design Profissional**: Interface similar a testes oficiais
- **Animações Suaves**: Transições e efeitos visuais
- **Acessibilidade**: Funciona em qualquer dispositivo

## 🔒 Segurança e Privacidade

- Não coleta dados pessoais além do nome
- Conexão segura com Supabase
- Dados armazenados de forma anônima

---

Desenvolvido com ❤️ para proporcionar uma experiência divertida e educativa de teste de QI online.

