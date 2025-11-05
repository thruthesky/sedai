# SEDAI CLI Production Test

This directory contains scripts for testing SEDAI CLI locally before publishing to NPM.

## Quick Test

```bash
# Run all tests
./test.sh
```

## Manual Testing

```bash
# From project root, run:
cd tests/prod

# Test help command
node ../../dist/cli.js --help

# Test version
node ../../dist/cli.js --version

# Test doctor command
node ../../dist/cli.js doctor

# Test init command
node ../../dist/cli.js init --name my-test-project

# Test validate command
node ../../dist/cli.js validate test-spec.md

# Test score command
node ../../dist/cli.js score test-spec.md
```

## Files

- `test.sh` - Automated test script
- `test-spec.md` - Example specification file for testing
- `README.md` - This file

## What Gets Tested

1. ✅ CLI help output
2. ✅ Version display
3. ✅ Doctor command (spec validation)
4. ✅ Init command (project initialization)
5. ✅ Validate command (single file validation)
6. ✅ Score command (spec scoring)

## Expected Output

The test script will:
- Build the TypeScript project
- Run each CLI command
- Display colored output showing test progress
- Report success or failure for each test

All tests should pass before publishing to NPM.
