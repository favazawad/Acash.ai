import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChart, Goal, Bot } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'تقييم مالي شامل',
      description: 'احصل على صورة واضحة لصحتك المالية من خلال أداة التقييم التفصيلية.',
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'تقارير مدعومة بالذكاء الاصطناعي',
      description: 'استلم تقارير مخصصة ورؤى قابلة للتنفيذ تم إنشاؤها بواسطة الذكاء الاصطناعي المتقدم.',
    },
    {
      icon: <Goal className="h-10 w-10 text-primary" />,
      title: 'تتبع الأهداف المالية',
      description: 'حدد وتتبع أهدافك المالية من خلال واجهتنا البديهية وسهلة الاستخدام.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'توصيات قابلة للتنفيذ',
      description: 'يقدم الذكاء الاصطناعي توصيات واضحة خطوة بخطوة لمساعدتك على تحقيق أهدافك المالية.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            مرشدك المالي الشخصي المدعوم بالذكاء الاصطناعي
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            احصل على الوضوح والثقة في إدارة أموالك وبناء مستقبل مالي آمن.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/assessment">ابدأ التقييم</Link>
          </Button>
        </section>

        <section id="features" className="w-full bg-muted py-20">
          <div className="container mx-auto">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                مميزات لمساعدتك على النجاح
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                كل ما تحتاجه لفهم وتحسين صحتك المالية.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <CardHeader>
                    {feature.icon}
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2 text-xl">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
