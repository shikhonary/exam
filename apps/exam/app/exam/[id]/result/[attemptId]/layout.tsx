import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string; attemptId: string }> 
}): Promise<Metadata> {
  // Ideally, you'd fetch the exam and attempt details here to dynamically generate the OG tags
  // For now, we will provide a generic but effective fallback
  return {
    title: 'পরীক্ষার ফলাফল',
    description: 'আমার চমৎকার পরীক্ষার ফলাফল দেখুন!',
    openGraph: {
      title: 'পরীক্ষার ফলাফল',
      description: 'আমার চমৎকার পরীক্ষার ফলাফল দেখুন!',
      type: 'article',
      url: `/exam/${(await params).id}/result/${(await params).attemptId}`,
      // images: ['https://your-app.com/images/generated-template-123.jpg'], // Add dynamic image if needed
    },
  };
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
