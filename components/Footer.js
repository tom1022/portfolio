export default function Footer() {
    return (
        <footer className="bg-gray-100 mt-12">
            <div className="lg:mx-auto lg:max-w-5xl px-4 py-6 text-sm text-gray-600">
                <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
                    <div>© {new Date().getFullYear()} Tom (Fickledev). All rights reserved.</div>
                    <div className="flex gap-4">
                        <a className="text-indigo-600" href="https://github.com/tom1022" target="_blank" rel="noreferrer">GitHub</a>
                        <a className="text-indigo-600" href="https://www.linkedin.com/in/musashi-tochimura-070367331/" target="_blank" rel="noreferrer">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
