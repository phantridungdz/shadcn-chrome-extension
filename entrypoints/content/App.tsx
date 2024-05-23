import React, { useEffect, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import { Home } from "@/entrypoints/content/home.tsx";
import { SettingsPage } from "@/entrypoints/content/settings.tsx";
import Sidebar, { SidebarType } from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import Header from "@/entrypoints/content/header.tsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider.tsx";
import { useTransition, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default () => {
  const [showContent, setShowContent] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("home");
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  function domLoaded() {
    console.log("dom loaded");
  }

  useEffect(() => {
    if (document.readyState === "complete") {
      console.log("dom complete");
      domLoaded();
    } else {
      window.addEventListener("load", () => {
        console.log("content load:");
        console.log(window.location.href);
        domLoaded();
      });
    }

    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        console.log("content:");
        console.log(message);
        if (message.messageType == MessageType.clickExtIcon) {
          setShowContent(true);
        } else if (message.messageType == MessageType.changeLocale) {
          i18n.changeLanguage(message.content);
        } else if (message.messageType == MessageType.changeTheme) {
          toggleTheme(message.content);
        }
      }
    );

    initI18n();
  }, []);

  const transitions = useTransition(showContent, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
  });

  return (
    <div className={theme}>
      <Card>
        <Button
          onClick={() => setShowContent(true)}
          className="p-2 !bg-background rounded-l-sm fixed top-2 right-0 z-[10000000000001]"
        >
          <Label className="text-white">Open</Label>
        </Button>
      </Card>
      {transitions((style, item) =>
        item ? (
          <animated.div
            style={style}
            className="fixed top-0 right-0 h-screen w-[400px] bg-background z-[1000000000000] rounded-l-xl shadow-2xl"
          >
            <Header headTitle={headTitle} />
            <Sidebar
              closeContent={() => setShowContent(false)}
              sideNav={(sidebarType: SidebarType) => {
                setSidebarType(sidebarType);
                setHeadTitle(sidebarType);
              }}
            />
            <main className="mr-14 grid gap-4 p-4">
              {sidebarType === SidebarType.home && <Home />}
              {sidebarType === SidebarType.settings && <SettingsPage />}
            </main>
          </animated.div>
        ) : null
      )}
    </div>
  );
};
