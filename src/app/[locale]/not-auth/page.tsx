'use client';

import {useRouter} from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function NotAuth() {
  const t = useTranslations("NotAuth");
  const router = useRouter()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{t(`not-auth-title`)}</h2>
        <p className="mb-4">{t(`not-auth-description`)}</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => router.back()}
        >
          {t(`not-auth-close`)}
        </button>
      </div>
    </div>
  );
}