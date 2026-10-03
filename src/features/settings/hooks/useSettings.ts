import { useCallback, useMemo, useState } from "react";
import { mockSettings } from "../data/mockData";
import type { SettingsState } from "../types/settings.types";

export function useSettings() {
    const [settings, setSettings] = useState<SettingsState>(() => structuredClone(mockSettings));
    const [savedSettings, setSavedSettings] = useState<SettingsState>(() => structuredClone(mockSettings));

    const isDirty = useMemo(
        () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
        [settings, savedSettings],
    );

    const updatePlatform = useCallback((key: keyof SettingsState["platform"], value: boolean) => {
        setSettings((current) => ({
            ...current,
            platform: { ...current.platform, [key]: value },
        }));
    }, []);

    const updateCommission = useCallback((key: keyof SettingsState["commission"], value: number) => {
        setSettings((current) => ({
            ...current,
            commission: { ...current.commission, [key]: value },
        }));
    }, []);

    const updateProfile = useCallback((key: keyof SettingsState["profile"], value: string) => {
        setSettings((current) => ({
            ...current,
            profile: { ...current.profile, [key]: value },
        }));
    }, []);

    const save = useCallback(() => {
        setSavedSettings(structuredClone(settings));
    }, [settings]);

    const reset = useCallback(() => {
        setSettings(structuredClone(savedSettings));
    }, [savedSettings]);

    return { settings, isDirty, updatePlatform, updateCommission, updateProfile, save, reset };
}
