import { APP_VERSION } from '../version';

interface FooterProps {
    navigateTo: (view: string, replace?: boolean, category?: string | null) => void;
}


const Footer = ({ navigateTo }: FooterProps) => (
    <footer className="w-full text-center py-4 text-xs text-gray-500 bg-gray-50 border-t border-gray-200 mt-8">
        <div>
            FineTrack v{APP_VERSION} &copy; {new Date().getFullYear()} | By <a href="https://github.com/LadishDev" target="_blank" rel="noopener" className="text-blue-800 underline">@LadishDev</a>
        </div>
        <div className="mt-1 space-x-2">
            <button onClick={() => navigateTo('privacy-policy')} className="underline hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 m-0">Privacy Policy</button>
            <span>|</span>
            <button onClick={() => navigateTo('terms-and-conditions')} className="underline hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 m-0">Terms &amp; Conditions</button>
        </div>
    </footer>
);

export default Footer;
