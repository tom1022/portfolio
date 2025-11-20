import Image from "next/image";

export default function WorksSection() {
    const projects = [
        {
            title: 'Home Network Restructure',
            desc: 'Using OPNSense to virtually separate public servers and private networks, enhancing security and manageability.',
            link: 'https://www.wantedly.com/id/tom1022/items/9e3836bf-18bb-4a87-bdc7-d88eee198bb6',
            img: '/img/works/network.webp',
            tech: ['OPNSense', 'VLAN', 'LAGG']
        },
        {
            title: 'Tenjine',
            desc: 'The institutional repository software for high school',
            link: 'https://github.com/tom1022/Tenjine',
            img: 'noimage',
            tech: ['Python', 'Flask', 'MariaDB']
        },
        // {
        //     title: 'Static Blog',
        //     desc: 'シンプルな静的ブログ。Markdown ベースで高速に動作します。',
        //     link: 'https://github.com/tom1022/static-blog',
        //     tech: ['Gatsby', 'MDX']
        // }
    ];

    return (
        <section id="works" className="py-16">
            <div className="lg:mx-auto lg:max-w-5xl px-4">
                <h3 className="text-3xl font-bold mb-6">Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div key={p.title} className="border rounded-lg bg-white shadow-sm">
                            <div className="relative h-40">
                                {p.img && p.img !== 'noimage' ? (
                                    <Image
                                        src={p.img}
                                        alt={p.title}
                                        fill={true}
                                        className="mb-2 object-cover rounded-t-lg"
                                    />
                                ) : (
                                    <div className="mb-2 flex items-center justify-center h-40 bg-gray-100 rounded-t-lg text-gray-500">
                                        <span className="material-icons text-3xl">image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold mb-2">{p.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{p.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {p.tech.map((t) => (
                                        <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
                                    ))}
                                </div>
                                <a href={p.link} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm">View the source →</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
