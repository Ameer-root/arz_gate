import DefeatDangerGame from '@/components/memes/DefeatDangerGame';

import type { Metadata } from 'next';

// إضافة Metadata لتحسين SEO وإعطاء الصفحة عنوانًا
export const metadata: Metadata = {
  title: 'اهزم دنجر',
  description: 'هل يمكنك هزيمة البوت الغشاش دنجر في لعبة بونج؟',
};

export default function DefeatDangerPage() {
  return (

      <DefeatDangerGame />

  );
}