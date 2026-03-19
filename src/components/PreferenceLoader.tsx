"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/theme-provider";

export function PreferenceLoader() {
    const { user, isLoggedIn } = useAuth();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        let isMounted = true;

        const loadPreferences = async () => {
            if (!isLoggedIn || !user?.email) return;

            try {
                const res = await fetch(`/api/user/display?email=${encodeURIComponent(user.email)}`);
                if (res.ok && isMounted) {
                    const data = await res.json();
                    if (data.preferences) {
                        const prefs = data.preferences;

                        // Only apply theme from DB if it's different from current state
                        // and we haven't already set a local preference in this session
                        if (prefs.theme && prefs.theme !== theme) {
                            setTheme(prefs.theme);
                        }

                        // Apply Other Visual Prefs
                        if (prefs.font_size) {
                            document.documentElement.style.fontSize = `${prefs.font_size}px`;
                        }
                        if (prefs.compact_mode !== undefined) {
                            document.documentElement.classList.toggle('compact', !!prefs.compact_mode);
                        }
                        if (prefs.reduced_motion !== undefined) {
                            document.documentElement.classList.toggle('motion-reduce', !!prefs.reduced_motion);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load preferences:", error);
            }
        };

        if (isLoggedIn && user?.email) {
            loadPreferences();
        } else {
            document.documentElement.style.fontSize = '';
            document.documentElement.classList.remove('compact');
            document.documentElement.classList.remove('motion-reduce');
        }

        return () => { isMounted = false; };
    }, [isLoggedIn, user?.email, setTheme]);

    return null;
}
