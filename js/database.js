// Configuração do Supabase
const SUPABASE_URL = 'https://kltluvkloeqetotaopum.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdGx1dmtsb2VxZXRvdGFvcHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjA5NTUsImV4cCI6MjA2NjAzNjk1NX0.PljGd5VCFIvkdPUArJ62wmkmZZ0VImHJ_BsDF1qoJXU';

// Inicializar cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estrutura da tabela no Supabase:
/*
CREATE TABLE qi_results (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  qi_score INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

// Funções para interagir com o banco de dados
class DatabaseManager {
    // Salvar resultado do teste
    static async saveResult(playerName, score, qiScore, timeSeconds) {
        try {
            const { data, error } = await supabaseClient
                .from('qi_results')
                .insert([
                    {
                        player_name: playerName,
                        score: score,
                        qi_score: qiScore,
                        time_seconds: timeSeconds
                    }
                ]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao salvar resultado:', error);
            return { success: false, error };
        }
    }

    // Buscar ranking (ordenado por QI, depois por tempo)
    static async getRanking() {
        try {
            const { data, error } = await supabaseClient
                .from('qi_results')
                .select('*')
                .order('qi_score', { ascending: false })
                .order('time_seconds', { ascending: true });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar ranking:', error);
            return { success: false, error };
        }
    }

    // Limpar ranking (zerar todos os registros)
    static async clearRanking() {
        try {
            const { error } = await supabaseClient
                .from('qi_results')
                .delete()
                .neq('id', 0); // Deleta todos os registros

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erro ao limpar ranking:', error);
            return { success: false, error };
        }
    }

    // Buscar detalhes de um jogador específico
    static async getPlayerDetails(playerId) {
        try {
            const { data, error } = await supabaseClient
                .from('qi_results')
                .select('*')
                .eq('id', playerId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao buscar detalhes do jogador:', error);
            return { success: false, error };
        }
    }
}

