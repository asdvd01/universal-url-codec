/**
 * Universal URL Codec - RFC 3986 compliant URL encoding/decoding
 * Handles any Unicode character including emoji, special characters, and all languages
 */

/**
 * Configuration options for encoding
 */
export interface EncodeOptions {
  /**
   * Use plus signs (+) for spaces instead of %20 (application/x-www-form-urlencoded style)
   * @default false
   */
  plusForSpace?: boolean;

  /**
   * Encode ALL characters except alphanumeric, hyphen, and underscore (ultra-safe mode)
   * @default false
   */
  strict?: boolean;

  /**
   * Additional characters to NOT encode (beyond the safe defaults)
   * @default []
   */
  allowedChars?: string[];
}

/**
 * Configuration options for decoding
 */
export interface DecodeOptions {
  /**
   * Treat plus signs (+) as spaces (application/x-www-form-urlencoded style)
   * @default false
   */
  plusAsSpace?: boolean;
}

/**
 * Encodes a string for safe use in URLs with full Unicode support
 * 
 * This function handles:
 * - All Unicode characters (any language: Chinese, Arabic, Hebrew, etc.)
 * - Emoji and special symbols
 * - RFC 3986 compliance
 * - Proper handling of reserved characters
 * 
 * @param str - The string to encode
 * @param options - Encoding options
 * @returns URL-safe encoded string
 * 
 * @example
 * ```typescript
 * encode('Hello World!');        // 'Hello%20World%21'
 * encode('你好世界');             // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
 * encode('test@email.com');      // 'test%40email.com'
 * encode('Hello World', { plusForSpace: true }); // 'Hello+World'
 * ```
 */
export function encode(str: string, options: EncodeOptions = {}): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string as input');
  }

  const { plusForSpace = false, strict = false, allowedChars = [] } = options;

  // Start with standard encodeURIComponent which handles all Unicode
  let encoded = encodeURIComponent(str);

  if (strict) {
    // Ultra-strict mode: only allow alphanumeric, hyphen, and underscore
    encoded = Array.from(str)
      .map(char => {
        // Allow only A-Z, a-z, 0-9, -, _, and any explicitly allowed chars
        if (/[A-Za-z0-9\-_]/.test(char) || allowedChars.includes(char)) {
          return char;
        }
        
        // Encode everything else - need to apply RFC 3986 encoding too
        let charEncoded = encodeURIComponent(char);
        // Apply RFC 3986 encoding for characters that encodeURIComponent misses
        charEncoded = charEncoded
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A');
        return charEncoded;
      })
      .join('');
  } else {
    // Standard mode: RFC 3986 compliance
    // encodeURIComponent doesn't encode: - _ . ! ~ * ' ( )
    // We need to encode: ! ' ( ) *
    encoded = encoded
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }

  // Handle space encoding preference
  if (plusForSpace) {
    encoded = encoded.replace(/%20/g, '+');
  }

  return encoded;
}

/**
 * Decodes a URL-encoded string back to its original form
 * 
 * Handles:
 * - All percent-encoded sequences
 * - Unicode characters
 * - Malformed sequences (returns original if decode fails)
 * 
 * @param str - The URL-encoded string to decode
 * @param options - Decoding options
 * @returns Decoded string
 * 
 * @example
 * ```typescript
 * decode('Hello%20World%21');                    // 'Hello World!'
 * decode('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'); // '你好世界'
 * decode('Hello+World', { plusAsSpace: true });  // 'Hello World'
 * ```
 */
export function decode(str: string, options: DecodeOptions = {}): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string as input');
  }

  const { plusAsSpace = false } = options;

  try {
    let decoded = str;

    // Handle plus signs as spaces if requested
    if (plusAsSpace) {
      decoded = decoded.replace(/\+/g, ' ');
    }

    // Decode the string
    decoded = decodeURIComponent(decoded);

    return decoded;
  } catch (error) {
    // If decoding fails (malformed input), return original string
    // This is safer than throwing an error for partially encoded strings
    console.warn('Failed to decode URL string, returning original:', error);
    return str;
  }
}

/**
 * Encodes a full URL while preserving the URL structure
 * Only encodes the query string and hash parameters
 * 
 * @param url - The full URL to encode
 * @returns URL with encoded query parameters
 * 
 * @example
 * ```typescript
 * encodeUrl('https://example.com/path?name=John Doe&email=test@example.com');
 * // 'https://example.com/path?name=John%20Doe&email=test%40example.com'
 * ```
 */
export function encodeUrl(url: string): string {
  if (typeof url !== 'string') {
    throw new TypeError('Expected a string as input');
  }

  try {
    const urlObj = new URL(url);
    
    // Build new query string from decoded parameters
    const newParams: string[] = [];
    urlObj.searchParams.forEach((value, key) => {
      newParams.push(`${encode(key)}=${encode(value)}`);
    });
    
    // Reconstruct the URL
    const base = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    const query = newParams.length > 0 ? `?${newParams.join('&')}` : '';
    
    // Decode hash first to prevent double-encoding, then encode it
    let hash = '';
    if (urlObj.hash) {
      try {
        const decodedHash = decodeURIComponent(urlObj.hash.substring(1));
        hash = `#${encode(decodedHash)}`;
      } catch {
        // If decode fails, just encode the original
        hash = `#${encode(urlObj.hash.substring(1))}`;
      }
    }
    
    return base + query + hash;
  } catch (error) {
    // If URL parsing fails, encode the entire string
    return encode(url);
  }
}

/**
 * Encodes an object into URL query string format
 * 
 * @param params - Object with key-value pairs
 * @param options - Encoding options
 * @returns URL-encoded query string (without leading ?)
 * 
 * @example
 * ```typescript
 * encodeQuery({ name: 'John Doe', email: 'test@example.com' });
 * // 'name=John%20Doe&email=test%40example.com'
 * ```
 */
export function encodeQuery(
  params: Record<string, string | number | boolean>,
  options: EncodeOptions = {}
): string {
  return Object.entries(params)
    .map(([key, value]) => {
      const encodedKey = encode(String(key), options);
      const encodedValue = encode(String(value), options);
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');
}

/**
 * Decodes a URL query string into an object
 * 
 * @param queryString - Query string (with or without leading ?)
 * @param options - Decoding options
 * @returns Object with decoded key-value pairs
 * 
 * @example
 * ```typescript
 * decodeQuery('name=John%20Doe&email=test%40example.com');
 * // { name: 'John Doe', email: 'test@example.com' }
 * ```
 */
export function decodeQuery(
  queryString: string,
  options: DecodeOptions = {}
): Record<string, string> {
  // Remove leading ? if present
  const cleanQuery = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  
  const result: Record<string, string> = {};
  
  if (!cleanQuery) {
    return result;
  }
  
  const pairs = cleanQuery.split('&');
  
  for (const pair of pairs) {
    const [key, value = ''] = pair.split('=');
    const decodedKey = decode(key, options);
    const decodedValue = decode(value, options);
    result[decodedKey] = decodedValue;
  }
  
  return result;
}

// Default export with all functions
export default {
  encode,
  decode,
  encodeUrl,
  encodeQuery,
  decodeQuery
};
