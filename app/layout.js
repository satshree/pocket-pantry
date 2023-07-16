import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Pocket Pantry",
  description: "Recipe Organizer",
  viewport: "width=device-width, initial-scale=1, minimum-scale=1",
  "msapplication-TileColor": "#2d89ef",
  "theme-color": "#ffffff",
  manifest: "/site.webmanifest",
  icons: {
    "apple-touch-icon": "/apple-touch-icon.png",
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
