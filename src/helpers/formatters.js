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
