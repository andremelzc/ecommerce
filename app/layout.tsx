// app/layout.tsx
import "./globals.css";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />  
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

