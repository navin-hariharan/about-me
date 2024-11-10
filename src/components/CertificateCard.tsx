import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  verificationUrl?: string;
}

interface Props {
  certificate: Certificate;
  isDark: boolean;
}

export default function CertificateCard({ certificate, isDark }: Props) {
  return (
    <div
      className={`group overflow-hidden rounded-xl transition-all duration-300 ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow-lg hover:shadow-xl`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={certificate.image}
          alt={certificate.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{certificate.title}</h3>
        <p className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {certificate.issuer}
        </p>
        <p
          className={`text-sm mb-4 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          {certificate.date}
        </p>
        {certificate.verificationUrl && (
          <a
            href={certificate.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400"
          >
            <ExternalLink size={18} />
            <span>Verify Certificate</span>
          </a>
        )}
      </div>
    </div>
  );
}
