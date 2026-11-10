export type UserRole = 'direcao' | 'pedagogico' | 'coordenacao' | 'professor' | 'secretaria';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  cargo: string;
  avatarUrl?: string;
  departamento: string;
}

export type MessageCategory = 
  | 'frequencia' 
  | 'reuniao' 
  | 'indisciplina' 
  | 'apresentacao' 
  | 'demanda_particular' 
  | 'administrativa';

export type UrgencyLevel = 'baixa' | 'normal' | 'alta' | 'urgente';

export type MessageStatus = 'rascunho' | 'pendente' | 'aprovada' | 'reprovada' | 'enviada';

export type DeliveryChannel = 'whatsapp' | 'sms' | 'hibrido';

export interface Student {
  id: string;
  registroEscolar: string; // Matrícula
  nome: string;
  turmaId: string;
  responsavelNome: string;
  responsavelGrau: 'Mãe' | 'Pai' | 'Avó' | 'Avô' | 'Tutor Legal';
  responsavelTelefone: string;
  responsavelEmail: string;
  consentimentoLGPD: boolean;
  dataMatricula: string;
  faltasInjustificadas: number;
}

export interface Classroom {
  id: string;
  codigo: string;
  nome: string; // Ex: 5º Ano A - Fundamental I
  sala: string;
  turno: 'Matutino' | 'Vespertino';
  numeroAlunos: number;
  professorRegenteId: string;
  professorRegenteNome: string;
  completa: boolean;
}

export interface SystemMessage {
  id: string;
  autorId: string;
  autorNome: string;
  autorPapel: UserRole;
  categoria: MessageCategory;
  urgencia: UrgencyLevel;
  canal: DeliveryChannel;
  alunoId?: string;
  alunoNome?: string;
  turmaId?: string;
  turmaNome?: string;
  destinatarioTipo: 'individual' | 'turma' | 'escola_toda';
  assunto: string;
  conteudoCorpo: string;
  cabecalhoFormatado: string;
  mensagemCompleta: string;
  status: MessageStatus;
  criadaEm: string;
  validadaPor?: string;
  validadaEm?: string;
  justificativaRejeicao?: string;
  destinatariosCount: number;
  entreguesCount: number;
  lidasCount: number;
}

export interface SystemMetrics {
  folhasEconomizadasMes: number;
  custoEconomizadoReais: number;
  tempoMedioEntregaSegundos: number;
  tempoAnteriorHoras: number;
  totalMensagensEnviadas: number;
  taxaAberturaEstimada: number;
  alunosAtendidos: number;
  mensagensAguardandoValidacao: number;
}
