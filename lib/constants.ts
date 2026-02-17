export type UF = {
  sigla: string
  nome: string
  regiao: string
}

export const UFS: UF[] = [
  // Norte
  { sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
  { sigla: 'AP', nome: 'Amapa', regiao: 'Norte' },
  { sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
  { sigla: 'PA', nome: 'Para', regiao: 'Norte' },
  { sigla: 'RO', nome: 'Rondonia', regiao: 'Norte' },
  { sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
  { sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
  // Nordeste
  { sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
  { sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
  { sigla: 'CE', nome: 'Ceara', regiao: 'Nordeste' },
  { sigla: 'MA', nome: 'Maranhao', regiao: 'Nordeste' },
  { sigla: 'PB', nome: 'Paraiba', regiao: 'Nordeste' },
  { sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
  { sigla: 'PI', nome: 'Piaui', regiao: 'Nordeste' },
  { sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
  // Centro-Oeste
  { sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  { sigla: 'GO', nome: 'Goias', regiao: 'Centro-Oeste' },
  { sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  // Sudeste
  { sigla: 'ES', nome: 'Espirito Santo', regiao: 'Sudeste' },
  { sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
  { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  { sigla: 'SP', nome: 'Sao Paulo', regiao: 'Sudeste' },
  // Sul
  { sigla: 'PR', nome: 'Parana', regiao: 'Sul' },
  { sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
  { sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
]

export const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const

export const PAGE_SIZE = 20
