import { Activity, FileText, Target } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: <Activity className="h-10 w-10 text-primary" />,
      title: 'Comprehensive Financial Assessment',
      description: 'Get a clear picture of your financial health with our detailed assessment tools.',
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: 'AI-Generated Reports',
      description: 'Receive personalized, easy-to-understand financial reports and recommendations from our AI.',
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: 'Personalized Goal Tracking',
      description: 'Set and track your financial goals, from saving for a home to planning for retirement.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-20 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI-Powered Personal Financial Guide
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Gain clarity and confidence in your financial future. Acash.ai provides personalized insights and actionable advice to help you achieve financial freedom.
          </p>
          <Button size="lg">Start Assessment</Button>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
              <p className="mt-2 text-muted-foreground">Everything you need to take control of your finances.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <CardHeader>
                    {feature.icon}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle>{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Acash.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
