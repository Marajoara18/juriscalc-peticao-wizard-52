
import React from 'react';
import HelpSection from '@/components/peticoes/HelpSection';

interface HelpSectionContainerProps {
  calculosDisponiveis: boolean;
}

const HelpSectionContainer: React.FC<HelpSectionContainerProps> = ({ calculosDisponiveis }) => {
  return <HelpSection calculosDisponiveis={calculosDisponiveis} />;
};

export default HelpSectionContainer;
