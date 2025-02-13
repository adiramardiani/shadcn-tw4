'use client';

import { toast } from 'sonner';

import { PageForm } from '../../../components/partial/form';
import { identity } from '../../../identity';
import type { Model } from '../../../model/schema';

export default function Content({ model }: { model: Model }) {
  const handleSubmit = async () => {
    console.log('Updated data:', model);
    toast.success(identity.update.success);
  };
  return <PageForm initialData={model} onSubmit={handleSubmit} />;
}
