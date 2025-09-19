import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Settings } from "lucide-react";
import { ThemeToggleButton } from "./theme-toggle-button";
import { RegionSelect } from "./RegionSelect";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Label } from "./ui/label";

export function SettingsMenu() {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const [isOpen, setIsOpen] = React.useState(false);

    if (isMobile) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
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
                        <div className="w-full max-w-xs mx-auto space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobile-region">Region</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                <RegionSelect />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Select your region to see local streaming providers</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <ThemeToggleButton />
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    return (
        <div className="flex items-center">
            <Menubar>
                <MenubarMenu value={isOpen ? "settings" : ""} onValueChange={(value) => setIsOpen(!!value)}>
                    <MenubarTrigger className="flex items-center justify-center gap-2 p-2 rounded-full hover:bg-muted focus:outline-none shadow">
                        <Settings className="h-5 w-5" />
                    </MenubarTrigger>
                    <MenubarContent align="center" className="flex justify-center">
                        <div className="w-full max-w-xs mx-auto p-4 space-y-4">
                            <div className="mb-4 text-xl font-bold text-foreground">Settings</div>
                            <div className="space-y-2">
                                <Label>Region</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                <RegionSelect />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Select your region to see local streaming providers</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <MenubarItem asChild>
                                    <ThemeToggleButton />
                                </MenubarItem>
                            </div>
                        </div>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}
