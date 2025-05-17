
import React from 'react';

const AuthLogo: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <img 
        src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
        alt="Logo"
        className="h-36 w-auto mb-3"
        style={{ minWidth: 200 }}
      />
      <p className="mt-1 text-gray-600">Sua plataforma de cálculos trabalhistas</p>
    </div>
  );
};

export default AuthLogo;
