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

export interface AuditLogEntry {
  id: number;
  entidade: string;
  entidade_id: string;
  acao: 'INSERT' | 'UPDATE' | 'DELETE' | 'DISPARO' | 'APROVACAO' | 'REPROVACAO';
  detalhes: string;
  usuario_responsavel: string;
  executado_em: string;
}

export interface ColumnSchemaInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export interface ForeignKeyInfo {
  id: number;
  table: string;
  from: string;
  to: string;
  on_update: string;
  on_delete: string;
}

export interface TableSchemaInfo {
  name: string;
  rowCount: number;
  columns: ColumnSchemaInfo[];
  foreignKeys: ForeignKeyInfo[];
}

export interface SqlExecutionResult {
  ok: boolean;
  kind: 'QUERY' | 'MUTATION';
  statementType: string;
  columns: string[];
  rows: Record<string, unknown>[];
  changes: number;
  lastInsertRowid: number | string | null;
  durationMs: number;
  error?: string;
}

export interface GitCommitInfo {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  subject: string;
  refs: string;
  type: string;
}

export interface GitInfoResponse {
  available: boolean;
  currentBranch: string;
  branches: string[];
  totalCommits: number;
  commits: GitCommitInfo[];
  statusLines: string[];
  remoteUrl: string;
}

