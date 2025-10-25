import { FONT_SCALES, FONT_SIZE_KEY, FontSizeSetting } from '@/constants/misc';
import { getItem } from '@/utils/asyncStorage';
import { useEffect, useState } from 'react';

const DEFAULT_FONT_SCALE = 1.0;

/**
 * Custom hook to retrieve the global font scale factor from AsyncStorage.
 * It defaults to 1.0 (Medium) while loading.
 *
 * @returns The numerical font scale factor.
 */
export function useFontScale(): number {
    // Start with the default scale until the actual value is loaded
    const [scale, setScale] = useState<number>(DEFAULT_FONT_SCALE);

    useEffect(() => {
        const loadFontSetting = async () => {
            try {
                // 1. Get the string value from AsyncStorage
                const storedSetting = await getItem(FONT_SIZE_KEY);

                // 2. Validate and map the stored string to a type
                let setting: FontSizeSetting = 'Medium';
                
                if (storedSetting && (storedSetting === 'Small' || storedSetting === 'Large')) {
                    setting = storedSetting;
                }
                
                // 3. Look up the corresponding scale factor
                const newScale = FONT_SCALES[setting];
                
                setScale(newScale);

            } catch (error) {
                // Handle the error (e.g., keep the default scale)
                console.error("Failed to load font size setting, using default.", error);
                setScale(DEFAULT_FONT_SCALE);
            }
        };

        loadFontSetting();
    }, []); // Empty dependency array means this runs only once on mount

    return scale;
}