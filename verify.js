#!/usr/bin/env node

/**
 * Simple verification script to test the package functionality
 * This runs without npm install to verify the core logic
 */

// Core encoding function
function encode(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string as input');
  }

  const { plusForSpace = false, strict = false } = options;
  let encoded = encodeURIComponent(str);

  if (!strict) {
    encoded = encoded
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }

  if (plusForSpace) {
    encoded = encoded.replace(/%20/g, '+');
  }

  return encoded;
}

// Core decoding function
function decode(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string as input');
  }

  const { plusAsSpace = false } = options;

  try {
    let decoded = str;
    if (plusAsSpace) {
      decoded = decoded.replace(/\+/g, ' ');
    }
    decoded = decodeURIComponent(decoded);
    return decoded;
  } catch (error) {
    console.warn('Failed to decode, returning original');
    return str;
  }
}

// Test suite
console.log('🧪 Running Universal URL Codec Tests\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assertEquals(actual, expected, context = '') {
  if (actual !== expected) {
    throw new Error(`Expected "${expected}", got "${actual}" ${context}`);
  }
}

// Run tests
console.log('\n📝 Basic Encoding Tests');
console.log('-'.repeat(50));

test('Encode basic text with space', () => {
  assertEquals(encode('Hello World'), 'Hello%20World');
});

test('Encode email address', () => {
  assertEquals(encode('test@example.com'), 'test%40example.com');
});

test('Encode special characters', () => {
  assertEquals(encode('100% sure!'), '100%25%20sure%21');
});

test('Encode plus sign', () => {
  assertEquals(encode('Hello+World'), 'Hello%2BWorld');
});

test('Encode parentheses', () => {
  assertEquals(encode('test(1)'), 'test%281%29');
});

test('Encode apostrophe', () => {
  assertEquals(encode("it's"), 'it%27s');
});

console.log('\n🌍 Unicode Language Tests');
console.log('-'.repeat(50));

test('Encode Chinese characters', () => {
  assertEquals(encode('你好世界'), '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
});

test('Encode Arabic characters', () => {
  assertEquals(encode('مرحبا'), '%D9%85%D8%B1%D8%AD%D8%A8%D8%A7');
});

test('Encode Hebrew characters', () => {
  assertEquals(encode('שלום'), '%D7%A9%D7%9C%D7%95%D7%9D');
});

test('Encode Japanese characters', () => {
  assertEquals(encode('こんにちは'), '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF');
});

test('Encode Russian characters', () => {
  assertEquals(encode('Привет'), '%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82');
});

console.log('\n😀 Emoji Tests');
console.log('-'.repeat(50));

test('Encode party emoji', () => {
  assertEquals(encode('🎉'), '%F0%9F%8E%89');
});

test('Encode rocket emoji', () => {
  assertEquals(encode('🚀'), '%F0%9F%9A%80');
});

test('Encode text with emoji', () => {
  assertEquals(encode('Hello 🌍'), 'Hello%20%F0%9F%8C%8D');
});

console.log('\n⚙️  Options Tests');
console.log('-'.repeat(50));

test('plusForSpace option', () => {
  assertEquals(encode('Hello World', { plusForSpace: true }), 'Hello+World');
});

console.log('\n🔄 Decoding Tests');
console.log('-'.repeat(50));

test('Decode basic text', () => {
  assertEquals(decode('Hello%20World'), 'Hello World');
});

test('Decode email', () => {
  assertEquals(decode('test%40example.com'), 'test@example.com');
});

test('Decode Chinese', () => {
  assertEquals(decode('%E4%BD%A0%E5%A5%BD'), '你好');
});

test('Decode emoji', () => {
  assertEquals(decode('%F0%9F%8E%89'), '🎉');
});

test('plusAsSpace option', () => {
  assertEquals(decode('Hello+World', { plusAsSpace: true }), 'Hello World');
});

console.log('\n🔁 Round-trip Tests');
console.log('-'.repeat(50));

const roundTripTests = [
  'Hello World',
  '你好世界',
  'test@example.com',
  '100% sure!',
  'Hello 🌍',
  'test(1)',
  "it's working"
];

roundTripTests.forEach(original => {
  test(`Round-trip: "${original.substring(0, 20)}..."`, () => {
    const encoded = encode(original);
    const decoded = decode(encoded);
    assertEquals(decoded, original);
  });
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed\n');
  process.exit(1);
}
