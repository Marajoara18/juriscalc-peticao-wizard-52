
/**
 * Get description for custom calculations
 */
export const getCustomCalculoDescription = (calculos: any): string => {
  if (calculos.calculosCustom && calculos.calculosCustom.length > 0) {
    // If multiple custom calculations, join their names
    if (calculos.calculosCustom.length > 1) {
      return "Cálculos Personalizados";
    } else {
      // Return the description of the single custom calculation
      return calculos.calculosCustom[0].descricao || "Cálculo Personalizado";
    }
  }
  // Fallback to old system or if no description is available
  return calculos.descricaoCustom || "Cálculo Personalizado";
};
