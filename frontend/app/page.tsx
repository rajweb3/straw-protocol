"use client";

import { DynamicConnectButton, DynamicWidget } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import DynamicMethods from "@/app/components/Methods";
import "./page.css";

const checkIsDarkSchemePreferred = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;
  }
  return false;
};

export default function Main() {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkSchemePreferred);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleChange = () => setIsDarkMode(checkIsDarkSchemePreferred());

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={` ${isDarkMode ? "dark" : "light"}`}>
      <div className="header">
        <img
          className="logo"
          src={isDarkMode ? "/logo-light.png" : "/logo-dark.png"}
          alt="dynamic"
        />
        <div className="header-buttons">
          <DynamicConnectButton>
            <p className="btn btn-warning mt-5">Connect Wallet</p>
          </DynamicConnectButton>
        </div>
      </div>
      <div className="modal">
        <DynamicWidget />
        <DynamicMethods isDarkMode={isDarkMode} />
      </div>
      <div className="footer">
        <div className="footer-text">Made with ❤️ at ETHBangkok</div>
      </div>
    </div>
  );
}
