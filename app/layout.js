import '../styles/globals.css';
import { Noto_Sans_JP, Fira_Code } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
    weight: ['400', '700'],
    subsets: ['latin' ],
    display: 'swap',
    variable: '--font-noto-sans-jp',
});

const firaCode = Fira_Code({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-fira-code',
});

export const metadata = {
    title: 'Fickledev - tom1022 Portfolio',
    description: 'A portfolio website with Home Lab Server',
};

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Fickledev - tom1022 Portfolio</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </head>
            <body className={`${notoSansJP.variable} ${firaCode.variable}`}>
                <Header />
                <div className="bg-gray-50 px-4 lg:mx-auto lg:max-w-5xl">
                {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
