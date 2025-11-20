export default function HeroSection() {
    return (
        <section id="hero" className="py-20">
            <div className="lg:mx-auto lg:max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-mono mb-4">Tom1022</h2>
                    <p className="text-lg text-gray-700 mb-6">An enthusiastic newbie network engineer and full-stack developer. Skilled in designing network and implementing cloud, home servers, and web applications.</p>
                    <div className="flex gap-4">
                        <a href="#works" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">View Works</a>
                        <a href="#contact" className="inline-block border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">Contact</a>
                    </div>
                </div>
                <div className="flex justify-center md:justify-end">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 shadow-lg flex items-center justify-center text-white text-xl font-bold">Tom<br/>1022</div>
                </div>
            </div>
        </section>
    );
}
