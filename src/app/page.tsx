import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI-Powered Personal Financial Guide
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            نقد.ai هو دليلك المالي الشخصي المدعوم بالذكاء الاصطناعي لتحقيق الحرية المالية.
            <br />
            Acash.ai is your AI-powered personal financial guide to achieving financial freedom.
          </p>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Acash.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
