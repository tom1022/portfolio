"use client";

import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const menu = [
        { name: 'About Me', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Works', href: '#works' },
        { name: 'Contact', href: '#contact' },
    ];
    const [isOpen, setIsOpen] = useState(false);
    const firstLinkRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (firstLinkRef.current) firstLinkRef.current.focus();
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const toggleMenu = () => setIsOpen((v) => !v);

    return (
        <header className="sticky top-0 bg-indigo-800 shadow-md h-16 z-10 flex items-center">
            <div className="w-full px-4 lg:mx-auto lg:max-w-5xl text-white">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold font-mono">Fickledev</h1>
                    <nav className="hidden md:block space-x-8 text-lg">
                        {menu.map((item) => (
                            <a key={item.name} href={item.href} className="hover:underline">
                                {item.name}
                            </a>
                        ))}
                    </nav>
                    <button
                        className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={toggleMenu}
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen ? (
                            <span className="material-icons text-white">close</span>
                        ) : (
                            <span className="material-icons text-white">menu</span>
                        )}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-40">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                    <aside
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        className={`fixed top-0 right-0 h-full w-64 bg-indigo-800 text-white transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="p-6 flex flex-col space-y-4">
                            {menu.map((item, i) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    ref={i === 0 ? firstLinkRef : null}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg hover:underline focus:outline-none"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}
