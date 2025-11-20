import Image from "next/image";

export default function AboutSection() {
    return (
        <section id="about" className="py-16">
            <div className="lg:mx-auto lg:max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                    <h3 className="text-3xl font-bold mb-4">About Me</h3>
                    <p className="text-gray-700 mb-4">Hello, I'm Tom1022. An enthusiastic newbie network engineer and full-stack developer. Skilled in designing network and implementing cloud, home servers, and web applications.</p>
                </div>
                <div className="flex justify-center md:justify-end">
                    <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Image src="/img/profile.webp" alt="Profile" height={160} width={160} className="rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
