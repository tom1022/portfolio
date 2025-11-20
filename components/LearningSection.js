export default function LearningSection() {
    const learnings = [
        { title: 'Golang', description: 'Learning the Go programming language for efficient and scalable software development.' },
        { title: 'Next.js', description: 'Learning the modern web application deployment framework. This page is running on Next.js.' },
        { title: 'Ansible', description: 'Automating configuration management and application deployment.' },
    ];

    return (
        <section id="learning" className="py-16">
            <div className="lg:mx-auto lg:max-w-5xl px-4">
                <h3 className="text-3xl font-bold mb-6">Currently Learning</h3>
                <div className="space-y-4">
                    {learnings.map((item) => (
                        <div key={item.title} className="p-4 border rounded bg-white shadow-sm">
                            <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
                            <p className="text-gray-700">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
