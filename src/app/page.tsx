import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h1 className="text-2xl font-bold font-headline tracking-tight text-foreground sm:text-3xl">
              Acash.ai
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
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
