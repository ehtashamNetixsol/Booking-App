import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "./Footer";

const Layout = ({ children }: React.PropsWithChildren) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? "system" : theme;
  return (
    <div className="flex flex-col min-h-screen m-0 p-0">
      <Nav theme={theme} curTheme={currentTheme} setTheme={setTheme} />
      <div className="min-h-screen">{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
