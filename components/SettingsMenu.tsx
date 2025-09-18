import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Settings } from "lucide-react";
import { ThemeToggleButton } from "./theme-toggle-button";

export function SettingsMenu() {
    const isMobile = useMediaQuery("(max-width: 640px)");

    if (isMobile) {
        return (
            <Drawer.Root>
                <Drawer.Trigger asChild>
                    <button
                        className="flex items-center justify-center gap-2 p-2 rounded-full hover:bg-muted focus:outline-none shadow"
                        aria-label="Open settings"
                        title="Settings"
                    >
                        <Settings className="h-5 w-5" /> Settings
                    </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[100]" />
                    <Drawer.Content
                        className="fixed bottom-0 left-0 right-0 w-full z-[101] bg-background/95 rounded-t-xl p-6 flex flex-col items-center gap-4 h-fit outline-none shadow-2xl"
                        aria-describedby="settings-drawer-desc"
                    >
                        <Drawer.Title className="mb-4 text-xl font-bold text-foreground">Settings</Drawer.Title>
                        <span id="settings-drawer-desc" className="sr-only">Configure your theme and other settings here.</span>
                        <div className="w-full max-w-xs mx-auto">
                            <ThemeToggleButton />
                        </div>
                        {/* Add more settings here if needed */}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    return (
        <div className="flex items-center">
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger className="flex items-center justify-center gap-2 p-2 rounded-full hover:bg-muted focus:outline-none shadow">
                        <Settings className="h-5 w-5" />
                    </MenubarTrigger>
                    <MenubarContent align="center" className="flex justify-center">
                        <div className="w-full max-w-xs mx-auto">
                            <div className="mb-4 text-xl font-bold text-foreground">Settings</div>
                            <MenubarItem asChild className="mx-auto">
                                <ThemeToggleButton />
                            </MenubarItem>
                        </div>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}
