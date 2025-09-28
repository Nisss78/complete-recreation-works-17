
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import logoImage from "@/assets/logo.png";

// Social Media Icons
const YouTubeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 256 180" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z" fill="#FF0000"/>
    <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z"/>
  </svg>
);

const TwitterIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 256 209" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M256 25.45c-9.42 4.177-19.542 7-30.166 8.27 10.845-6.5 19.172-16.793 23.093-29.057a105.183 105.183 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52 0 4.117.465 8.125 1.36 11.97-43.65-2.191-82.35-23.1-108.255-54.876-4.52 7.757-7.11 16.78-7.11 26.404 0 18.222 9.273 34.297 23.365 43.716a52.312 52.312 0 0 1-23.79-6.57c-.003.22-.003.44-.003.661 0 25.447 18.104 46.675 42.13 51.5a52.592 52.592 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475-17.975 14.086-40.622 22.483-65.228 22.483-4.24 0-8.42-.249-12.529-.734 23.243 14.902 50.85 23.597 80.51 23.597 96.607 0 149.434-80.031 149.434-149.435 0-2.278-.05-4.543-.152-6.795A106.748 106.748 0 0 0 256 25.45" fill="#1DA1F2"/>
  </svg>
);

const InstagramIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
    <defs>
      <radialGradient id="ig-gradient" cx="19%" cy="78%">
        <stop offset="0%" stopColor="#f9ce34"/>
        <stop offset="30%" stopColor="#ee2a7b"/>
        <stop offset="78%" stopColor="#6228d7"/>
      </radialGradient>
    </defs>
    <path fill="url(#ig-gradient)" d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"/>
  </svg>
);

const TikTokIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 290">
    <path fill="#FF004F" d="M189.72022 104.42148c18.67797 13.3448 41.55932 21.19661 66.27233 21.19661V78.08728c-4.67694.001-9.34196-.48645-13.91764-1.4554v37.41351c-24.71102 0-47.5894-7.85181-66.27232-21.19563v96.99656c0 48.5226-39.35537 87.85513-87.8998 87.85513-18.11308 0-34.94847-5.47314-48.93361-14.85978 15.96175 16.3122 38.22162 26.4315 62.84826 26.4315 48.54742 0 87.90477-39.33253 87.90477-87.85712v-96.99457h-.00199Zm17.16896-47.95275c-9.54548-10.4231-15.81283-23.89299-17.16896-38.78453v-6.11347h-13.18894c3.31982 18.92715 14.64335 35.09738 30.3579 44.898ZM69.67355 225.60685c-5.33316-6.9891-8.21517-15.53882-8.20226-24.3298 0-22.19236 18.0009-40.18631 40.20915-40.18631 4.13885-.001 8.2529.6324 12.19716 1.88328v-48.59308c-4.60943-.6314-9.26154-.89945-13.91167-.80117v37.82253c-3.94726-1.25089-8.06328-1.88626-12.20313-1.88229-22.20825 0-40.20815 17.99196-40.20815 40.1873 0 15.6937 8.99747 29.28075 22.1189 35.89954Z"/>
    <path d="M175.80259 92.84876c18.68293 13.34382 41.5613 21.19563 66.27232 21.19563V76.63088c-13.79353-2.93661-26.0046-10.14114-35.18573-20.16215-15.71554-9.80162-27.03808-25.97185-30.3579-44.898H141.8876v189.84333c-.07843 22.1318-18.04855 40.05229-40.20915 40.05229-13.05889 0-24.66039-6.22169-32.00788-15.8595-13.12044-6.61879-22.1179-20.20683-22.1179-35.89854 0-22.19336 17.9999-40.1873 40.20815-40.1873 4.255 0 8.35614.66217 12.20312 1.88229v-37.82254c-47.69165.98483-86.0473 39.93316-86.0473 87.83429 0 23.91184 9.55144 45.58896 25.05353 61.4276 13.98514 9.38565 30.82053 14.85978 48.9336 14.85978 48.54544 0 87.89981-39.33452 87.89981-87.85612V92.84876h-.00099Z"/>
    <path fill="#00F2EA" d="M242.07491 76.63088V66.51456c-12.4384.01886-24.6326-3.46278-35.18573-10.04683 9.34196 10.22255 21.64336 17.27121 35.18573 20.16315Zm-65.54363-65.06015a67.7881 67.7881 0 0 1-.72869-5.45726V0h-47.83362v189.84531c-.07644 22.12883-18.04557 40.04931-40.20815 40.04931-6.50661 0-12.64987-1.54375-18.09025-4.28677 7.34749 9.63681 18.949 15.8575 32.00788 15.8575 22.15862 0 40.13171-17.9185 40.20915-40.0503V11.57073h34.64368ZM99.96593 113.58077V102.8112c-3.9969-.54602-8.02655-.82003-12.06116-.81805C39.35537 101.99315 0 141.32669 0 189.84531c0 30.41846 15.46735 57.22621 38.97116 72.99536-15.5021-15.83765-25.05353-37.51576-25.05353-61.42661 0-47.90014 38.35466-86.84847 86.0483-87.8333Z"/>
  </svg>
);

const DiscordIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg viewBox="0 0 256 199" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" fill="#5865F2"/>
  </svg>
);

export const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer className="border-t bg-gray-50/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-1">
            <h3 className="font-bold mb-3 sm:mb-4 text-gray-900">About Protoduct</h3>
            <p className="text-sm text-gray-600 mb-4">
              A tech company mainly focused on building, acquiring and managing cool projects.
            </p>
            {/* Small Logos */}
            <div className="flex items-center gap-1 mt-2">
              <img
                src="/lovable-uploads/2b4f768d-73fc-4ad4-a297-fbd2600a520c.png"
                alt="Our Logo"
                className="h-12 w-auto"
              />
              <Link to="/" className="flex items-center">
                <img
                  src={logoImage}
                  alt="Protoduct"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 sm:mb-4 text-gray-900">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  プロダクト
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  記事
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  ニュース
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 sm:mb-4 text-gray-900">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#10c876] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 sm:mb-4 text-gray-900">Social</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="YouTube"
              >
                <YouTubeIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Twitter"
              >
                <TwitterIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Instagram"
              >
                <InstagramIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="TikTok"
              >
                <TikTokIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Discord"
              >
                <DiscordIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 pt-6 sm:pt-8 border-t">
          © 2025 Protoduct. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
