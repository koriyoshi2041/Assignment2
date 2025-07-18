#!/bin/bash

echo "🚀 Generating TypeScript API client from OpenAPI specification..."

# Clean up old generated files
rm -rf tmp
rm -rf src/api

# Create temporary directory
mkdir -p tmp

# Generate TypeScript API client
openapi-generator-cli generate \
    -i ../openapi.yml \
    -g typescript-fetch \
    -o ./tmp \
    --additional-properties=supportsES6=true,npmName=@assignment2/api-client,typescriptThreePlus=true

# Move generated code to src/api
mv tmp/src src/api

# Clean up temporary directory
rm -rf tmp

echo "✅ API client generated successfully in src/api/"
echo "📁 Generated files:"
echo "   - src/api/apis/DefaultApi.ts"
echo "   - src/api/models/"
echo "   - src/api/runtime.ts"
echo ""
echo "🔧 You can now import and use the API client:"
echo "   import { DefaultApi, Configuration } from './api';"
echo ""