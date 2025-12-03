const { Jimp } = require('jimp');

/**
 * Convert an sRGB channel (0–255) into linear light (0–1).
 * sRGB values are gamma-corrected, meaning they are not stored in true brightness.
 * WCAG luminance calculations require linear values, so we must "undo" gamma correction.
 */
function srgbToLinear(c) {
  c /= 255; // Convert from 0–255 range to 0–1 range

  // Apply the official inverse sRGB gamma formula
  return c <= 0.03928
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the relative luminance (brightness) of an RGB color.
 * Uses WCAG's luminance formula, which weights R, G, B differently
 * based on human visual sensitivity.
 */
function luminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);

  // Weighted sum of linear RGB values (official WCAG formula)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate the WCAG contrast ratio between two RGB colors.
 * Takes luminance of both colors, finds which is lighter and darker,
 * then applies contrast ratio formula:
 * (lighter + 0.05) / (darker + 0.05)
 */
function contrastRatio(color1, color2) {
  const L1 = luminance(color1);
  const L2 = luminance(color2);

  return (Math.max(L1, L2) + 0.05) /
         (Math.min(L1, L2) + 0.05);
}



generateHeatmap()