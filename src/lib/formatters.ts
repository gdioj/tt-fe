/**
 * Utility functions for formatting various data types
 */

/**
 * Formats a number as currency with thousands separators
 * @param value - The number to format
 * @param currency - The currency symbol (default: ₱)
 * @param locale - The locale for formatting (default: en-PH)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = "₱",
  locale: string = "en-PH"
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `${currency}0.00`;
  }

  // Use Intl.NumberFormat for proper locale-aware formatting
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${formatter.format(value)}`;
}

/**
 * Formats a number with thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - The locale for formatting (default: en-PH)
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 2,
  locale: string = "en-PH"
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00";
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

/**
 * Formats a date string to a localized date
 * @param dateString - The date string to format
 * @param locale - The locale for formatting (default: en-PH)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined,
  locale: string = "en-PH",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString(locale, options);
  } catch (_error) {
    return "Invalid Date";
  }
}

/**
 * Formats a percentage value
 * @param value - The decimal value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - The locale for formatting (default: en-PH)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1,
  locale: string = "en-PH"
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.0%";
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}
