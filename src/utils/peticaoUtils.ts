
/**
 * @deprecated This file is kept for backward compatibility
 * Import utilities from the new modular structure instead:
 * import { gerarHTMLCalculos, printDocument, handlePrint } from '@/utils/peticao';
 */

import { gerarHTMLCalculos as gerarHTMLCalculosNew } from './peticao/calculosUtils';
import { printDocument as printDocumentNew } from './peticao/documentUtils';
import { handlePrint as handlePrintNew } from './peticao/printUtils';

// Re-export all functions for backward compatibility
export const gerarHTMLCalculos = gerarHTMLCalculosNew;
export const printDocument = printDocumentNew;
export const handlePrint = handlePrintNew;
