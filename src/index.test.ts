import { encode, decode, encodeUrl, encodeQuery, decodeQuery } from './index';

describe('Universal URL Codec', () => {
  describe('encode()', () => {
    it('should encode basic ASCII strings', () => {
      expect(encode('Hello World')).toBe('Hello%20World');
      expect(encode('test@example.com')).toBe('test%40example.com');
    });

    it('should encode special characters', () => {
      expect(encode('100% sure!')).toBe('100%25%20sure%21');
      expect(encode('Hello+World')).toBe('Hello%2BWorld');
      expect(encode("it's working")).toBe('it%27s%20working');
      expect(encode('(parentheses)')).toBe('%28parentheses%29');
      expect(encode('asterisk*here')).toBe('asterisk%2Ahere');
    });

    it('should handle Chinese characters', () => {
      expect(encode('你好世界')).toBe('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
      expect(encode('测试')).toBe('%E6%B5%8B%E8%AF%95');
    });

    it('should handle Arabic characters', () => {
      expect(encode('مرحبا')).toBe('%D9%85%D8%B1%D8%AD%D8%A8%D8%A7');
      expect(encode('السلام عليكم')).toBe('%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85');
    });

    it('should handle Hebrew characters', () => {
      expect(encode('שלום')).toBe('%D7%A9%D7%9C%D7%95%D7%9D');
    });

    it('should handle Japanese characters', () => {
      expect(encode('こんにちは')).toBe('%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF');
      expect(encode('ありがとう')).toBe('%E3%81%82%E3%82%8A%E3%81%8C%E3%81%A8%E3%81%86');
    });

    it('should handle Korean characters', () => {
      expect(encode('안녕하세요')).toBe('%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94');
    });

    it('should handle Russian characters', () => {
      expect(encode('Привет')).toBe('%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82');
    });

    it('should handle emoji', () => {
      expect(encode('🎉')).toBe('%F0%9F%8E%89');
      expect(encode('🚀')).toBe('%F0%9F%9A%80');
      expect(encode('💯')).toBe('%F0%9F%92%AF');
      expect(encode('Hello 🌍')).toBe('Hello%20%F0%9F%8C%8D');
    });

    it('should handle complex emoji sequences', () => {
      expect(encode('👨‍👩‍👧‍👦')).toBe('%F0%9F%91%A8%E2%80%8D%F0%9F%91%A9%E2%80%8D%F0%9F%91%A7%E2%80%8D%F0%9F%91%A6');
      expect(encode('🏳️‍🌈')).toBe('%F0%9F%8F%B3%EF%B8%8F%E2%80%8D%F0%9F%8C%88');
    });

    it('should handle mixed content', () => {
      expect(encode('Hello 世界 🌍!')).toBe('Hello%20%E4%B8%96%E7%95%8C%20%F0%9F%8C%8D%21');
    });

    it('should handle empty string', () => {
      expect(encode('')).toBe('');
    });

    it('should handle strings with only spaces', () => {
      expect(encode('   ')).toBe('%20%20%20');
    });

    it('should handle URL-unsafe characters', () => {
      expect(encode('<>')).toBe('%3C%3E');
      expect(encode('"quotes"')).toBe('%22quotes%22');
      expect(encode('{}[]')).toBe('%7B%7D%5B%5D');
      expect(encode('#hash')).toBe('%23hash');
      expect(encode('path/to/file')).toBe('path%2Fto%2Ffile');
    });

    it('should handle plusForSpace option', () => {
      expect(encode('Hello World', { plusForSpace: true })).toBe('Hello+World');
      expect(encode('a b c', { plusForSpace: true })).toBe('a+b+c');
    });

    it('should handle strict mode', () => {
      const result = encode('Hello-World_123', { strict: true });
      expect(result).toBe('Hello-World_123');
      
      // Test that special characters are encoded in strict mode
      const specialResult = encode('Hello World!', { strict: true });
      expect(specialResult).toContain('%');
      expect(specialResult).toBe('Hello%20World%21');
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => encode(123 as unknown as string)).toThrow(TypeError);
      expect(() => encode(null as unknown as string)).toThrow(TypeError);
      expect(() => encode(undefined as unknown as string)).toThrow(TypeError);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const encoded = encode(longString);
      expect(encoded).toBe(longString);
    });

    it('should handle all printable ASCII characters', () => {
      const allChars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
      const encoded = encode(allChars);
      expect(encoded).toBeTruthy();
      expect(encoded.length).toBeGreaterThan(0);
    });
  });

  describe('decode()', () => {
    it('should decode basic encoded strings', () => {
      expect(decode('Hello%20World')).toBe('Hello World');
      expect(decode('test%40example.com')).toBe('test@example.com');
    });

    it('should decode special characters', () => {
      expect(decode('100%25%20sure%21')).toBe('100% sure!');
      expect(decode('Hello%2BWorld')).toBe('Hello+World');
      expect(decode('it%27s%20working')).toBe("it's working");
    });

    it('should decode Chinese characters', () => {
      expect(decode('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C')).toBe('你好世界');
    });

    it('should decode Arabic characters', () => {
      expect(decode('%D9%85%D8%B1%D8%AD%D8%A8%D8%A7')).toBe('مرحبا');
    });

    it('should decode emoji', () => {
      expect(decode('%F0%9F%8E%89')).toBe('🎉');
      expect(decode('%F0%9F%9A%80')).toBe('🚀');
      expect(decode('Hello%20%F0%9F%8C%8D')).toBe('Hello 🌍');
    });

    it('should handle plusAsSpace option', () => {
      expect(decode('Hello+World', { plusAsSpace: true })).toBe('Hello World');
      expect(decode('a+b+c', { plusAsSpace: true })).toBe('a b c');
    });

    it('should handle plusAsSpace option false', () => {
      expect(decode('Hello+World', { plusAsSpace: false })).toBe('Hello+World');
    });

    it('should handle empty string', () => {
      expect(decode('')).toBe('');
    });

    it('should handle malformed input gracefully', () => {
      expect(decode('Hello%2')).toBe('Hello%2');
      expect(decode('test%')).toBe('test%');
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => decode(123 as unknown as string)).toThrow(TypeError);
      expect(() => decode(null as unknown as string)).toThrow(TypeError);
    });

    it('should be inverse of encode', () => {
      const testStrings = [
        'Hello World',
        '你好世界',
        'مرحبا',
        'test@example.com',
        '100% sure!',
        'Hello 🌍',
        'complex: (test) + [data] = {result}'
      ];

      testStrings.forEach(str => {
        expect(decode(encode(str))).toBe(str);
      });
    });
  });

  describe('encodeUrl()', () => {
    it('should encode query parameters in a full URL', () => {
      const url = 'https://example.com/path?name=John Doe&email=test@example.com';
      const encoded = encodeUrl(url);
      expect(encoded).toContain('name=John%20Doe');
      expect(encoded).toContain('email=test%40example.com');
    });

    it('should preserve URL structure', () => {
      const url = 'https://example.com:8080/path/to/resource';
      const encoded = encodeUrl(url);
      expect(encoded).toBe(url);
    });

    it('should handle URLs with Unicode in query', () => {
      const url = 'https://example.com?query=你好';
      const encoded = encodeUrl(url);
      expect(encoded).toContain('%E4%BD%A0%E5%A5%BD');
    });

    it('should handle URLs with hash', () => {
      const url = 'https://example.com/page#section name';
      const encoded = encodeUrl(url);
      expect(encoded).toContain('#section%20name');
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => encodeUrl(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('encodeQuery()', () => {
    it('should encode object to query string', () => {
      const params = { name: 'John Doe', email: 'test@example.com' };
      const encoded = encodeQuery(params);
      expect(encoded).toBe('name=John%20Doe&email=test%40example.com');
    });

    it('should handle numbers and booleans', () => {
      const params = { age: 25, active: true };
      const encoded = encodeQuery(params);
      expect(encoded).toBe('age=25&active=true');
    });

    it('should handle Unicode values', () => {
      const params = { greeting: '你好', emoji: '🎉' };
      const encoded = encodeQuery(params);
      expect(encoded).toContain('%E4%BD%A0%E5%A5%BD');
      expect(encoded).toContain('%F0%9F%8E%89');
    });

    it('should handle empty object', () => {
      expect(encodeQuery({})).toBe('');
    });

    it('should handle special characters in keys', () => {
      const params = { 'key!@#': 'value' };
      const encoded = encodeQuery(params);
      expect(encoded).toContain('key%21%40%23');
    });

    it('should respect plusForSpace option', () => {
      const params = { text: 'Hello World' };
      const encoded = encodeQuery(params, { plusForSpace: true });
      expect(encoded).toBe('text=Hello+World');
    });
  });

  describe('decodeQuery()', () => {
    it('should decode query string to object', () => {
      const query = 'name=John%20Doe&email=test%40example.com';
      const decoded = decodeQuery(query);
      expect(decoded).toEqual({
        name: 'John Doe',
        email: 'test@example.com'
      });
    });

    it('should handle query string with leading ?', () => {
      const query = '?name=John&age=25';
      const decoded = decodeQuery(query);
      expect(decoded).toEqual({
        name: 'John',
        age: '25'
      });
    });

    it('should handle Unicode values', () => {
      const query = 'greeting=%E4%BD%A0%E5%A5%BD';
      const decoded = decodeQuery(query);
      expect(decoded.greeting).toBe('你好');
    });

    it('should handle empty query string', () => {
      expect(decodeQuery('')).toEqual({});
      expect(decodeQuery('?')).toEqual({});
    });

    it('should handle parameters without values', () => {
      const query = 'key1&key2=value2';
      const decoded = decodeQuery(query);
      expect(decoded).toEqual({
        key1: '',
        key2: 'value2'
      });
    });

    it('should respect plusAsSpace option', () => {
      const query = 'text=Hello+World';
      const decoded = decodeQuery(query, { plusAsSpace: true });
      expect(decoded.text).toBe('Hello World');
    });

    it('should be inverse of encodeQuery', () => {
      const params = {
        name: 'John Doe',
        email: 'test@example.com',
        greeting: '你好',
        emoji: '🎉'
      };
      
      const encoded = encodeQuery(params);
      const decoded = decodeQuery(encoded);
      expect(decoded).toEqual(params);
    });
  });

  describe('Integration tests', () => {
    it('should handle full roundtrip with complex data', () => {
      const originalUrl = 'https://example.com/search';
      const params = {
        q: 'Hello 世界 🌍',
        category: 'tech & science',
        filter: '(recent)',
        user: 'test@example.com'
      };
      
      const queryString = encodeQuery(params);
      const fullUrl = `${originalUrl}?${queryString}`;
      
      const urlObj = new URL(fullUrl);
      const decodedParams = decodeQuery(urlObj.search);
      
      expect(decodedParams).toEqual(params);
    });

    it('should maintain data integrity across encode/decode cycles', () => {
      const testData = [
        'Simple text',
        '你好世界',
        'مرحبا العالم',
        'Hello 🌍 World',
        'special@#$%^&*()chars',
        '100% guaranteed!',
        'path/to/resource',
        'key=value&more=data'
      ];

      testData.forEach(data => {
        const encoded = encode(data);
        const decoded = decode(encoded);
        expect(decoded).toBe(data);
      });
    });
  });
});
