import Nav from './components/Nav';
import Footer from './components/Footer';
import AOSInit from './components/AOSInit';
import './globals.css';
import './styles/bootstrap.min.css';
import './styles/bootstrap-grid.min.css';
import './styles/bootstrap-reboot.min.css';
import './styles/animate.css';
import './styles/magnific-popup.css';
import './styles/jquery.countdown.css';
// Import font CSS files before style.css
import './styles/fonts/font-awesome/css/font-awesome.css';
import './styles/fonts/elegant_font/HTML_CSS/style.css';
import './styles/fonts/et-line-font/style.css';
import './styles/style.css';
import './styles/colors/scheme-01.css';
import './styles/coloring.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const metadata = {
  title: 'NFT Marketplace',
  description: 'NFT Marketplace Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AOSInit />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

