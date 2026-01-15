# Bug Fixes - Version 1.0.1

## Issues Fixed

### 1. Strict Mode Not Encoding Special Characters (FIXED)
**Problem:** In strict mode, the exclamation mark (!) and other special characters were not being encoded because `encodeURIComponent()` doesn't encode them by default.

**Fix:** 
- Applied RFC 3986 encoding rules within strict mode as well
- Now properly encodes `! ' ( ) *` even in strict mode
- Strict mode truly only allows: `A-Z a-z 0-9 - _`

**Before:**
```javascript
encode('Hello World!', { strict: true })
// Result: 'Hello%20World!' ❌ (! not encoded)
```

**After:**
```javascript
encode('Hello World!', { strict: true })
// Result: 'Hello%20World%21' ✅ (! properly encoded)
```

### 2. encodeUrl Double-Encoding Hash Fragments (FIXED)
**Problem:** Hash fragments in URLs were being double-encoded. The URL constructor keeps hash fragments encoded, so when we called `encode()` on them again, they got encoded twice.

**Fix:**
- Decode the hash fragment first using `decodeURIComponent()`
- Then re-encode it properly with our `encode()` function
- Added try-catch to handle already-encoded or malformed hashes

**Before:**
```javascript
encodeUrl('https://example.com/page#section name')
// Result: 'https://example.com/page#section%2520name' ❌ (double encoded)
```

**After:**
```javascript
encodeUrl('https://example.com/page#section name')
// Result: 'https://example.com/page#section%20name' ✅ (correctly encoded)
```

## Technical Details

### Strict Mode Fix (src/index.ts)
```typescript
if (strict) {
  encoded = Array.from(str).map(char => {
    if (/[A-Za-z0-9\-_]/.test(char) || allowedChars.includes(char)) {
      return char;
    }
    // Apply RFC 3986 encoding for special characters
    let charEncoded = encodeURIComponent(char);
    charEncoded = charEncoded
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
    return charEncoded;
  }).join('');
}
```

### Hash Fragment Fix (src/index.ts)
```typescript
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
```

## Test Results

✅ All 50 tests now pass:
- Basic encoding tests (6 passed)
- Unicode language tests (5 passed)
- Emoji tests (3 passed)
- Options tests including strict mode (1 passed)
- Decoding tests (5 passed)
- encodeUrl tests (5 passed) - including hash test
- Query string tests (6 passed)
- Round-trip tests (7 passed)
- Integration tests (12 passed)

## Verification

Run this to test locally:
```bash
cd universal-url-codec
npm install
npm test
```

Expected output:
```
Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        ~2s
```

## Changes Summary

**Files Modified:**
- `src/index.ts` - Fixed strict mode encoding and hash handling in encodeUrl
- `BUGFIXES.md` - This file

**Lines Changed:**
- Strict mode implementation: ~10 lines
- encodeUrl hash handling: ~12 lines

All fixes maintain backward compatibility and improve correctness!
