/**
 * ================================
 * Helpers de formatação geral
 * ================================
 * Este módulo contém funções puras
 * e reutilizáveis para formatação
 * de valores monetários, datas, textos, etc.
 */

/**
 * Formata um número para o formato de moeda brasileira (R$)
 * 
 * @param {number|string} value - Valor a ser formatado
 * 
 * @returns {string} - Valor formatado (ex: "R$ 1,234.56")
 */
export function formatCurrency(value) {
  const number = Number(value)
  if (isNaN(number)) return 'R$ 0.00'

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'BRL'
  })
}

/**
 * Formata uma data do tipo string ISO-8601 para o padrão de data/hora pt-BR (DMY-h:m)
 * 
 * @param {string} value - Valor a ser formatado
 * 
 * @returns {string} - Valor formatado (ex: "30/12/2025, 12:30")
 */
export function formatDateTime(value) {
  if (!value) return ''
  
  const date = new Date(value)
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) return value

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
