import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Chewy } from "next/font/google";
import { Toaster } from "sonner";

const delius = Chewy({
  subsets: ["latin"],
  weight: ["400"],
});
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` ${delius.className} antialiased`}>
          <Provider>{children}</Provider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
