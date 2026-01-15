/**
 * Universal URL Codec - Usage Examples
 * 
 * This file contains practical examples of how to use the library
 */

import { encode, decode, encodeUrl, encodeQuery, decodeQuery } from 'universal-url-codec';

// ==========================================
// Basic Encoding Examples
// ==========================================

console.log('=== Basic Encoding ===');

// Simple text
console.log(encode('Hello World'));
// Output: Hello%20World

// Email address
console.log(encode('user@example.com'));
// Output: user%40example.com

// Special characters
console.log(encode('100% sure!'));
// Output: 100%25%20sure%21

// ==========================================
// Unicode Language Support
// ==========================================

console.log('\n=== Unicode Languages ===');

// Chinese
console.log(encode('你好世界'));
// Output: %E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C

// Arabic
console.log(encode('مرحبا'));
// Output: %D9%85%D8%B1%D8%AD%D8%A8%D8%A7

// Hebrew
console.log(encode('שלום'));
// Output: %D7%A9%D7%9C%D7%95%D7%9D

// Japanese
console.log(encode('こんにちは'));
// Output: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF

// Russian
console.log(encode('Привет'));
// Output: %D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82

// ==========================================
// Emoji Support
// ==========================================

console.log('\n=== Emoji Support ===');

console.log(encode('🎉'));
// Output: %F0%9F%8E%89

console.log(encode('Hello 🌍 World 🚀'));
// Output: Hello%20%F0%9F%8C%8D%20World%20%F0%9F%9A%80

// Complex emoji (family)
console.log(encode('👨‍👩‍👧‍👦'));
// Output: %F0%9F%91%A8%E2%80%8D%F0%9F%91%A9%E2%80%8D%F0%9F%91%A7%E2%80%8D%F0%9F%91%A6

// ==========================================
// Encoding Options
// ==========================================

console.log('\n=== Encoding Options ===');

// Use plus signs for spaces (form-encoded style)
console.log(encode('Hello World', { plusForSpace: true }));
// Output: Hello+World

// Strict mode (maximum encoding)
console.log(encode('Hello.World!', { strict: true }));
// Output: Hello%2EWorld%21

// ==========================================
// Decoding Examples
// ==========================================

console.log('\n=== Decoding ===');

console.log(decode('Hello%20World%21'));
// Output: Hello World!

console.log(decode('%E4%BD%A0%E5%A5%BD'));
// Output: 你好

console.log(decode('Hello+World', { plusAsSpace: true }));
// Output: Hello World

// ==========================================
// Full URL Encoding
// ==========================================

console.log('\n=== Full URL Encoding ===');

const url = 'https://example.com/search?q=Hello World&category=tech';
console.log(encodeUrl(url));
// Output: https://example.com/search?q=Hello%20World&category=tech

const unicodeUrl = 'https://example.com?name=张三&city=北京';
console.log(encodeUrl(unicodeUrl));
// Properly encodes Chinese characters in query parameters

// ==========================================
// Query String Encoding/Decoding
// ==========================================

console.log('\n=== Query String Operations ===');

// Encode object to query string
const params = {
  name: 'John Doe',
  email: 'test@example.com',
  greeting: '你好',
  emoji: '🎉'
};

const queryString = encodeQuery(params);
console.log(queryString);
// Output: name=John%20Doe&email=test%40example.com&greeting=%E4%BD%A0%E5%A5%BD&emoji=%F0%9F%8E%89

// Decode query string to object
const decodedParams = decodeQuery(queryString);
console.log(decodedParams);
// Output: { name: 'John Doe', email: 'test@example.com', greeting: '你好', emoji: '🎉' }

// ==========================================
// Real-world Use Cases
// ==========================================

console.log('\n=== Real-world Use Cases ===');

// Building search URLs
function buildSearchUrl(baseUrl: string, query: string, filters: Record<string, string>) {
  const params = { q: query, ...filters };
  return `${baseUrl}?${encodeQuery(params)}`;
}

const searchUrl = buildSearchUrl(
  'https://api.example.com/search',
  'machine learning 机器学习',
  { category: 'AI & ML', lang: 'en' }
);
console.log(searchUrl);

// Parsing URL parameters
function parseUrlParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  return decodeQuery(urlObj.search);
}

const parsedParams = parseUrlParams('https://example.com?name=%E5%BC%A0%E4%B8%89&age=25');
console.log(parsedParams);
// Output: { name: '张三', age: '25' }

// Building API requests with international data
function buildApiUrl(endpoint: string, data: Record<string, any>) {
  return `${endpoint}?${encodeQuery(data)}`;
}

const apiUrl = buildApiUrl('https://api.example.com/users', {
  username: '用户123',
  bio: 'Developer from 北京 🚀',
  website: 'https://example.com'
});
console.log(apiUrl);

// ==========================================
// Error Handling
// ==========================================

console.log('\n=== Error Handling ===');

// Type errors
try {
  encode(123 as any);
} catch (error) {
  console.log('Type error caught:', error.message);
}

// Malformed decode (graceful handling)
console.log(decode('Hello%2'));
// Output: Hello%2 (returns original string instead of throwing)

// ==========================================
// Performance Test
// ==========================================

console.log('\n=== Performance ===');

const testStrings = [
  'Simple ASCII text',
  '复杂的中文字符串包含很多汉字',
  'مرحبا بك في عالم البرمجة',
  'Testing with emoji 🎉🚀💯🌍',
  'Mixed content: Hello 世界 مرحبا 🌟'
];

console.time('Encoding performance');
for (let i = 0; i < 10000; i++) {
  testStrings.forEach(str => encode(str));
}
console.timeEnd('Encoding performance');

console.time('Decoding performance');
const encoded = testStrings.map(str => encode(str));
for (let i = 0; i < 10000; i++) {
  encoded.forEach(str => decode(str));
}
console.timeEnd('Decoding performance');

// ==========================================
// Round-trip Testing
// ==========================================

console.log('\n=== Round-trip Verification ===');

const roundTripTests = [
  'Hello World!',
  '你好世界',
  'test@example.com',
  '100% guaranteed',
  'Path/to/resource',
  'Complex: (data) + [test] = {result}',
  'Emoji: 🎉🚀💯',
  'Mixed: Hello 世界 مرحبا 🌍'
];

let allPassed = true;
roundTripTests.forEach(original => {
  const encoded = encode(original);
  const decoded = decode(encoded);
  const passed = original === decoded;
  
  if (!passed) {
    console.log(`❌ Failed: ${original}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('✅ All round-trip tests passed!');
}

export {};
