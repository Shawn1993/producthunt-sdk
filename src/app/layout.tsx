import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Hunt SDK',
  description: '探索 Product Hunt 精选内容',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full bg-background text-foreground flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold sm:inline-block">
                  Product Hunt SDK
                </span>
              </a>
            </div>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                href="/daily"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                每日精选
              </a>
              <a
                href="/collections"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                合集
              </a>
              <a
                href="/products"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                产品
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ using{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Next.js
              </a>
              {" "}and{" "}
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                shadcn/ui
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
} 