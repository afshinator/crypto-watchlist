import { DEFAULT_FONT_SETTING, FONT_SCALES, FONT_SIZE_KEY, FontSizeSetting } from '@/constants/misc';
import { getItem, setItem } from '@/utils/asyncStorage';
import { useCallback, useEffect, useState } from 'react';
 
// Create a custom hook to manage the font size state and scale factor
export function useFontScaleState() {
    // State to hold the currently active setting (e.g., 'Medium')
    const [activeSetting, setActiveSetting] = useState<FontSizeSetting>(DEFAULT_FONT_SETTING);
    // State to hold the actual numerical scale factor
    const [scaleFactor, setScaleFactor] = useState<number>(FONT_SCALES[DEFAULT_FONT_SETTING]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to update the setting and store it
    const setFontSize = useCallback(async (newSetting: FontSizeSetting) => {
        try {
            await setItem(FONT_SIZE_KEY, newSetting);
            setActiveSetting(newSetting);
            setScaleFactor(FONT_SCALES[newSetting]);
        } catch (error) {
            console.error("Failed to save font size setting.", error);
        }
    }, []);

    // Effect to load the initial setting from AsyncStorage
    useEffect(() => {
        const loadInitialSetting = async () => {
            try {
                const storedValue = await getItem(FONT_SIZE_KEY);
                let setting: FontSizeSetting = DEFAULT_FONT_SETTING;

                if (storedValue && FONT_SCALES.hasOwnProperty(storedValue)) {
                    setting = storedValue as FontSizeSetting;
                }
                
                setActiveSetting(setting);
                setScaleFactor(FONT_SCALES[setting]);

            } catch (error) {
                console.error("Failed to load initial font size setting.", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialSetting();
    }, []);

    return { activeSetting, scaleFactor, setFontSize, isLoading };
}

// Separate hook for ThemedText to consume ONLY the scale factor
export function useFontScale(): number {
    // NOTE: In a real app, you'd wrap the app in a FontScaleProvider context
    // and this hook would consume that context. For simplicity, we'll assume 
    // you integrate useFontScaleState into a Provider pattern or use it globally 
    // at the top level and pass props down, or simply use a global state manager.
    // We'll proceed with the assumption that your ThemedText will get the final 
    // scale factor somehow. (The previous approach of just calling the async logic 
    // directly in useFontScale is fine if you don't need instant updates.)
    
    // For the Settings screen, we will use the stateful hook:
    return useFontScaleState().scaleFactor;
}