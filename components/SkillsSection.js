import Image from "next/image";

export default function SkillsSection() {
    const skills = [
        { name: 'Proxmox', img: '/img/icons/proxmox.webp' },
        { name: 'Docker', img: '/img/icons/docker.webp' },
        { name: 'OPNSense', img: '/img/icons/opnsense.webp' },
        { name: 'HAProxy', img: '/img/icons/haproxy.webp' },
        { name: 'Nginx', img: '/img/icons/nginx.webp' },
        { name: 'MariaDB', img: '/img/icons/mariadb.webp' },
        { name: 'Git', img: '/img/icons/git.webp' },
        { name: 'GitHub', img: '/img/icons/github.webp' },
        { name: 'Python', img: '/img/icons/python.webp' },
        { name: 'VLAN', img: 'noimage' },
    ];

    return (
        <section id="skills" className="py-16">
            <div className="lg:mx-auto lg:max-w-5xl px-4">
                <h3 className="text-3xl font-bold mb-6">Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {skills.map((i) => (
                        <div key={i.name} className="p-4 border rounded bg-white shadow-sm flex items-center">
                            {i.img && i.img !== 'noimage' ? (
                                <Image
                                    src={i.img}
                                    alt={i.name}
                                    height={50}
                                    width={50}
                                    className="mb-2"
                                />
                            ) : (
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
                                    <span className="text-gray-700 material-icons">
                                        image
                                    </span>
                                </div>
                            )}
                            <h4 className="font-semibold ml-4">{i.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
