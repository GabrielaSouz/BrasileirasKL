import { HeartIcon, HomeIcon, PlusCircleIcon } from "lucide-react"
import Link from "next/link"

export default function Header() {
    const scrollToServices = () => {
        const element = document.getElementById('services-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md w-full border-b border-slate-200 px-3 sm:px-4 md:px-8 py-3 sm:py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              
                    <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
                        <div className="flex justify-center items-center bg-emerald-600 p-1.5 sm:p-1.5 rounded-lg hover:bg-emerald-500 transition-colors">
                            <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white " />
                        </div>
                        <h1 className="text-sm sm:text-base md:text-xl font-serif text-slate-800 tracking-tight">Brasileiras<span className="text-emerald-600">emKL</span></h1>
                    </Link>
              

                <nav className="space-x-2 sm:space-x-3 md:space-x-8 flex justify-center items-center">
                    <button 
                        onClick={scrollToServices}
                        className="flex justify-center items-center rounded-full gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 transition-all bg-emerald-100 text-emerald-700 hover:text-slate-500 text-xs sm:text-sm"
                        aria-label="Explorar serviços">
                        <HomeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="font-medium hidden xs:inline sm:inline">Explorar</span>
                    </button>
                    <Link href="/indique-um-servico" className="flex justify-center items-center rounded-full gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 transition-all bg-white text-slate-600  hover:text-slate-600 hover:bg-slate-100 text-xs sm:text-sm"
                    aria-label="Indicar serviço">
                     <PlusCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                     <span className="font-medium hidden xs:inline sm:inline">Indicar</span>
                     </Link>
                </nav>

            </div>

        </header>
    )
}