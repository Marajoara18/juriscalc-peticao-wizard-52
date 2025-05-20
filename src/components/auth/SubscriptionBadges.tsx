
import React from 'react';
import { Share2, Mail, FileText, FileSpreadsheet } from 'lucide-react';

const SubscriptionBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
        <Share2 className="mr-1 h-3 w-3" />
        WhatsApp
      </span>
      <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
        <Mail className="mr-1 h-3 w-3" />
        E-mail
      </span>
      <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
        <FileText className="mr-1 h-3 w-3" />
        PDF
      </span>
      <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
        <FileSpreadsheet className="mr-1 h-3 w-3" />
        Excel
      </span>
    </div>
  );
};

export default SubscriptionBadges;
