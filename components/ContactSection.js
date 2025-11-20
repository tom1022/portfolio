'use client';

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
// server-side verification happens on form submit; don't verify token twice
import Image from 'next/image';

export default function ContactSection() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, 'cf-turnstile-response': turnstileToken }),
            });

            if (response.ok) {
                setStatus('Your message has been sent.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send your message.');
            }
        } catch (error) {
            console.error('Send error:', error);
            setStatus('An error occurred. Please try again later.');
        }
    };

    const handleTurnstileSuccess = (token) => {
        setError(null);
        setTurnstileToken(token);
        setIsAuthenticated(true);
    };
    return (
        <section id="contact" className="py-16">
            <div className="lg:mx-auto lg:max-w-5xl px-4">
                <h3 className="text-3xl font-bold mb-6">Contact</h3>

                {!isAuthenticated ? (
                    <div className="p-6 border rounded bg-white shadow-sm flex flex-col items-center">
                        <p className="mb-4 text-gray-700">Please pass the verification below to reveal the contact information:</p>
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                            options={{ theme: 'auto' }}
                            onSuccess={handleTurnstileSuccess}
                        />
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-4 border rounded bg-white shadow-sm">
                            <h4 className="font-semibold mb-2">Direct</h4>
                            <div className="m-2 bg-gray-100 rounded-lg h-12 flex items-center flex-gap-2 px-4">
                                <div className="mr-4">
                                    <span className="material-icons text-gray-600">email</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Email<br></br><a className="text-indigo-600" href="mailto:j2400114@gunma-u.ac.jp">j2400114@gunma-u.ac.jp</a></span>
                                </div>
                            </div>
                            <div className="m-2 bg-gray-100 rounded-lg h-12 flex items-center flex-gap-2 px-4">
                                <div className="mr-4">
                                    <Image
                                        src="/img/icons/github.webp"
                                        alt="GitHub"
                                        height={24}
                                        width={24}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">GitHub<br></br><a className="text-indigo-600" href="https://github.com/tom1022">@tom1022</a></span>
                                </div>
                            </div>
                            <div className="m-2 bg-gray-100 rounded-lg h-12 flex items-center flex-gap-2 px-4">
                                <div className="mr-4">
                                    <Image
                                        src="/img/icons/linkedin.webp"
                                        alt="LinkedIn"
                                        height={24}
                                        width={24}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">LinkedIn<br></br><a className="text-indigo-600" href="https://www.linkedin.com/in/musashi-tochimura-070367331/">Musashi Tochimura</a></span>
                                </div>
                            </div>
                            <div className="m-2 bg-gray-100 rounded-lg h-12 flex items-center flex-gap-2 px-4">
                                <div className="mr-4">
                                    <Image
                                        src="/img/icons/wantedly.webp"
                                        alt="Wantedly"
                                        height={24}
                                        width={24}
                                    />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Wantedly<br></br><a className="text-indigo-600" href="https://www.wantedly.com/id/tom1022/">tom1022</a></span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded bg-white shadow-sm">
                            <h4 className="font-semibold mb-2">Message Form</h4>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <label className="text-sm">Name<span className="text-red-600">*</span></label>
                                <input name="name" value={formData.name} onChange={handleChange} className="px-3 py-2 border rounded" required />
                                <label className="text-sm">Email<span className="text-red-600">*</span></label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className="px-3 py-2 border rounded" required />
                                <label className="text-sm">Message<span className="text-red-600">*</span></label>
                                <textarea name="message" value={formData.message} onChange={handleChange} className="px-3 py-2 border rounded h-28" />

                                <div className="flex items-center gap-3">
                                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Send</button>
                                    <span className="text-sm text-gray-600">{status}</span>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
