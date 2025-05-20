
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';

const ManualRapidoButton: React.FC = () => {
  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="border-juriscalc-navy text-juriscalc-navy hover:bg-gray-100 transition-colors duration-300"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Manual Rápido IusCalc
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ManualRapido />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualRapidoButton;
