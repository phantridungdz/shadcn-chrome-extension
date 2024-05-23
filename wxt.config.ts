import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs"],
    action: {},
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
  },
  vite: () => ({
    plugins: [react()],
  }),
});
