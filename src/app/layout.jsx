import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Resume Automation Tool',
    description: 'Generate customized PDF resumes from job descriptions using AI.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col">
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                            <h1 className="text-xl font-bold text-primary">Resume Automation</h1>
                            <a
                                href="https://github.com/Datta-sai-vvn/My-Portfolio"
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                GitHub
                            </a>
                        </div>
                    </header>

                    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                        {children}
                    </main>

                    <footer className="bg-white border-t border-gray-200 py-6">
                        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                            Resume Automation Tool &copy; {new Date().getFullYear()}
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
