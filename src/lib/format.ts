export const DEFAULT_LOCALE = 'th-TH'

/**
 * Format price from cents to localized currency string
 * @param priceCents - Price in cents (smallest currency unit)
 * @param locale - Locale to use for formatting (defaults to th-TH)
 * @returns Formatted price string with 2 decimal places
 */
export const formatPrice = (
    priceCents: number,
    locale = DEFAULT_LOCALE
): string => {
    return (priceCents / 100).toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

/**
 * Format date string to localized date-time string
 * @param dateString - ISO date string
 * @param locale - Locale to use for formatting (defaults to th-TH)
 * @returns Formatted date-time string
 */
export const formatDate = (
    dateString: string,
    locale = DEFAULT_LOCALE
): string => {
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Format date string to short localized date string (without time)
 * @param dateString - ISO date string
 * @param locale - Locale to use for formatting (defaults to th-TH)
 * @returns Formatted date string
 */
export const formatShortDate = (
    dateString: string,
    locale = DEFAULT_LOCALE
): string => {
    return new Date(dateString).toLocaleDateString(locale, {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
    })
}
