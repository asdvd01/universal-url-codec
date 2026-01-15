# Universal URL Codec

[![npm version](https://img.shields.io/npm/v/universal-url-codec.svg)](https://www.npmjs.com/package/universal-url-codec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> A bulletproof URL encoder/decoder that handles **any Unicode character**, emoji, and special characters with RFC 3986 compliance.

## 🌟 Features

- ✅ **Universal Unicode Support** - Handles any language (Chinese, Arabic, Hebrew, Korean, etc.)
- ✅ **Emoji Support** - Works with all emoji including complex sequences
- ✅ **RFC 3986 Compliant** - Proper encoding of reserved characters
- ✅ **TypeScript First** - Full type definitions included
- ✅ **Zero Dependencies** - Lightweight and fast
- ✅ **Battle Tested** - Comprehensive test suite with 90%+ coverage
- ✅ **Flexible Options** - Customizable encoding behavior
- ✅ **Safe Decoding** - Graceful handling of malformed input

## 📦 Installation

```bash
npm install universal-url-codec
```

```bash
yarn add universal-url-codec
```

```bash
pnpm add universal-url-codec
```

## 🚀 Quick Start

```typescript
import { encode, decode } from 'universal-url-codec';

// Basic encoding
encode('Hello World!');
// => 'Hello%20World%21'

// Unicode support
encode('你好世界');
// => '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'

// Emoji support
encode('Hello 🌍');
// => 'Hello%20%F0%9F%8C%8D'

// Decoding
decode('Hello%20World%21');
// => 'Hello World!'
```

## 📖 API Documentation

### `encode(str: string, options?: EncodeOptions): string`

Encodes a string for safe use in URLs with full Unicode support.

#### Parameters

- `str` (string): The string to encode
- `options` (EncodeOptions, optional): Encoding configuration

#### Options

```typescript
interface EncodeOptions {
  plusForSpace?: boolean;  // Use + for spaces instead of %20 (default: false)
  strict?: boolean;        // Ultra-strict mode (default: false)
  allowedChars?: string[]; // Additional characters to not encode (default: [])
}
```

#### Examples

```typescript
// Standard encoding
encode('test@example.com');
// => 'test%40example.com'

// Plus signs for spaces (form-encoded style)
encode('Hello World', { plusForSpace: true });
// => 'Hello+World'

// Strict mode (only alphanumeric, hyphen, underscore allowed)
encode('Hello.World!', { strict: true });
// => 'Hello%2EWorld%21'

// All languages supported
encode('مرحبا');           // Arabic
encode('שלום');            // Hebrew
encode('こんにちは');      // Japanese
encode('안녕하세요');      // Korean
encode('Привет');          // Russian
```

### `decode(str: string, options?: DecodeOptions): string`

Decodes a URL-encoded string back to its original form.

#### Parameters

- `str` (string): The URL-encoded string to decode
- `options` (DecodeOptions, optional): Decoding configuration

#### Options

```typescript
interface DecodeOptions {
  plusAsSpace?: boolean;  // Treat + as space (default: false)
}
```

#### Examples

```typescript
// Standard decoding
decode('Hello%20World%21');
// => 'Hello World!'

// Plus signs as spaces
decode('Hello+World', { plusAsSpace: true });
// => 'Hello World'

// Unicode decoding
decode('%E4%BD%A0%E5%A5%BD');
// => '你好'

// Emoji decoding
decode('%F0%9F%8E%89');
// => '🎉'
```

### `encodeUrl(url: string): string`

Encodes a full URL while preserving the URL structure. Only encodes query parameters and hash fragments.

#### Examples

```typescript
encodeUrl('https://example.com/path?name=John Doe&email=test@example.com');
// => 'https://example.com/path?name=John%20Doe&email=test%40example.com'

encodeUrl('https://example.com?query=你好');
// => 'https://example.com?query=%E4%BD%A0%E5%A5%BD'
```

### `encodeQuery(params: Record<string, string | number | boolean>, options?: EncodeOptions): string`

Encodes an object into a URL query string format.

#### Examples

```typescript
encodeQuery({ name: 'John Doe', email: 'test@example.com' });
// => 'name=John%20Doe&email=test%40example.com'

encodeQuery({ greeting: '你好', emoji: '🎉' });
// => 'greeting=%E4%BD%A0%E5%A5%BD&emoji=%F0%9F%8E%89'

encodeQuery({ text: 'Hello World' }, { plusForSpace: true });
// => 'text=Hello+World'
```

### `decodeQuery(queryString: string, options?: DecodeOptions): Record<string, string>`

Decodes a URL query string into an object.

#### Examples

```typescript
decodeQuery('name=John%20Doe&email=test%40example.com');
// => { name: 'John Doe', email: 'test@example.com' }

decodeQuery('?greeting=%E4%BD%A0%E5%A5%BD');
// => { greeting: '你好' }

decodeQuery('text=Hello+World', { plusAsSpace: true });
// => { text: 'Hello World' }
```

## 🌍 Language Support

This library supports **all Unicode characters**, including:

| Language | Example | Encoded |
|----------|---------|---------|
| Chinese | 你好世界 | %E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C |
| Arabic | مرحبا | %D9%85%D8%B1%D8%AD%D8%A8%D8%A7 |
| Hebrew | שלום | %D7%A9%D7%9C%D7%95%D7%9D |
| Japanese | こんにちは | %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF |
| Korean | 안녕하세요 | %EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94 |
| Russian | Привет | %D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82 |
| Emoji | 🎉🚀💯 | %F0%9F%8E%89%F0%9F%9A%80%F0%9F%92%AF |

## 🔒 Why Use This Library?

### Problem with Native `encodeURIComponent()`

JavaScript's built-in `encodeURIComponent()` has limitations:

```typescript
// Native function doesn't encode these RFC 3986 reserved characters:
encodeURIComponent("Hello!") // "Hello!" - should be "Hello%21"
encodeURIComponent("test(1)") // "test(1)" - should be "test%281%29"
encodeURIComponent("it's") // "it's" - should be "it%27s"
```

### Solution: Universal URL Codec

```typescript
import { encode } from 'universal-url-codec';

encode("Hello!") // "Hello%21" ✅
encode("test(1)") // "test%281%29" ✅
encode("it's") // "it%27s" ✅
```

## 🛡️ Error Handling

The library handles errors gracefully:

```typescript
// Invalid input types throw TypeError
try {
  encode(123);
} catch (error) {
  console.error(error); // TypeError: Expected a string as input
}

// Malformed decode input returns original string
decode('Hello%2'); // => 'Hello%2' (doesn't throw)
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

The library maintains 90%+ code coverage across:
- Basic ASCII characters
- Special characters and symbols
- Unicode characters (all languages)
- Emoji (including complex sequences)
- Edge cases and error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Inspired by RFC 3986 URI specification
- Built with TypeScript for type safety
- Tested with Jest for reliability

## 📮 Support

If you have any questions or issues, please [open an issue](https://github.com/yourusername/universal-url-codec/issues) on GitHub.

---

Made with ❤️ for the developer community
