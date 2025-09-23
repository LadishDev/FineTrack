import { APP_VERSION } from '../version';

const Footer = () => (
    <footer className="w-full text-center py-4 text-xs text-gray-500 bg-gray-50 border-t border-gray-200 mt-8">
        <div>
            FineTrack v{APP_VERSION} &copy; {new Date().getFullYear()} | By <a href="https://github.com/LadishDev" target="_blank" rel="noopener" className="text-blue-800 underline">@LadishDev</a>
        </div>
        <div className="mt-1 space-x-2">
            <a href="/privacy-policy" className="underline hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-and-conditions" className="underline hover:text-blue-600 transition-colors">Terms &amp; Conditions</a>
        </div>
    </footer>
);

export default Footer;
