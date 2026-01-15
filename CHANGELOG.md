# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added
- Initial release
- `encode()` function with RFC 3986 compliance
- `decode()` function with malformed input handling
- `encodeUrl()` function for full URL encoding
- `encodeQuery()` function for object to query string conversion
- `decodeQuery()` function for query string to object conversion
- Full Unicode support for all languages
- Emoji support including complex sequences
- TypeScript definitions
- Comprehensive test suite with 90%+ coverage
- Complete documentation and examples

### Features
- Support for Chinese, Arabic, Hebrew, Japanese, Korean, Russian, and all other Unicode languages
- Proper handling of special characters: `! ' ( ) *`
- Configurable options: `plusForSpace`, `plusAsSpace`, `strict`, `allowedChars`
- Graceful error handling for malformed input
- Zero dependencies
- Full TypeScript support
