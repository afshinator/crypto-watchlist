
export const FONT_SIZE_KEY = 'app-font-size';


export type FontSizeSetting = 'Small' | 'Medium' | 'Large';

// Define the scale factors based on the user research (e.g., Small is 15% smaller, Large is 25% larger)
export const FONT_SCALES: Record<FontSizeSetting, number> = {
    'Small': 0.85,
    'Medium': 1.0, // Default
    'Large': 1.25,
};