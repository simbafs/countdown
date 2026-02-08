import { getProperty, setProperty } from "dot-prop";
import { useEffect, useState } from "react";

// Helper function to get all paths with dot notation from an object
function getAllPaths(obj: Record<string, any>, prefix = ''): string[] {
    const paths: string[] = [];
    
    for (const key of Object.keys(obj)) {
        const newPath = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            paths.push(...getAllPaths(value, newPath));
        } else {
            paths.push(newPath);
        }
    }
    
    return paths;
}

// useSetting is a custom hook that manages a settings object which will be saved to search parameter. It only saved options that are different from the default value, and it will automatically load the settings from search parameter when the component is mounted. It also provides a function to update the settings and save it to search parameter.
export function useSetting<T extends Record<string, any>>(defaultValue: T) {
    const [setting, setSetting] = useState<T>(defaultValue);

    // Load settings from URL search parameters on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const defaultPaths = getAllPaths(defaultValue);
        let loadedSettings: Partial<T> = {};
        
        for (const path of defaultPaths) {
            const value = urlParams.get(path);
            if (value !== null) {
                try {
                    // Try to parse as JSON for complex types
                    const parsedValue = JSON.parse(value);
                    loadedSettings = setProperty(loadedSettings, path, parsedValue) as Partial<T>;
                } catch {
                    // If parsing fails, use the string value directly
                    loadedSettings = setProperty(loadedSettings, path, value) as Partial<T>;
                }
            }
        }
        
        if (Object.keys(loadedSettings).length > 0) {
            setSetting(prev => ({ ...prev, ...loadedSettings }));
        }
    }, []);

    // Save settings to URL search parameters whenever they change
    useEffect(() => {
        const url = new URL(window.location.href);
        const defaultPaths = getAllPaths(defaultValue);
        
        for (const path of defaultPaths) {
            const currentValue = getProperty(setting, path);
            const defaultPathValue = getProperty(defaultValue, path);
            
            // Only save if different from default
            if (JSON.stringify(currentValue) !== JSON.stringify(defaultPathValue)) {
                url.searchParams.set(path, JSON.stringify(currentValue));
            } else {
                url.searchParams.delete(path);
            }
        }
        
        window.history.replaceState({}, '', url.toString());
    }, [setting]);

    // Function to update settings (supports both flat and nested updates)
    const updateSetting = (updates: Partial<T> | Record<string, any>) => {
        setSetting(prev => {
            let result = { ...prev };
            
            for (const [key, value] of Object.entries(updates)) {
                if (key.includes('.')) {
                    // Handle dot notation updates
                    result = setProperty(result, key, value) as T;
                } else {
                    // Handle regular updates
                    result[key as keyof T] = value;
                }
            }
            
            return result;
        });
    };

    return { setting, setSetting: updateSetting };
}
