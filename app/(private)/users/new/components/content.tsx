'use client';

import { PageForm } from '../../components/partial/form';

export default function Content() {
  const handleSubmit = async () => {
    console.log('Created data');
  };
  return <PageForm onSubmit={handleSubmit} />;
}
