/**
 * Convierte **texto** a <strong>texto</strong> para mostrar negrilla en HTML.
 */
export function parseBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
