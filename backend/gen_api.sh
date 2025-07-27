#!/bin/bash

echo "🚀 Generating Go API models from OpenAPI specification..."

# Make sure we're in the backend directory
cd /Users/koriyoshi/Desktop/assignment2/backend

# Clean up old generated files
rm -rf tmp
rm -rf api_models

# Create temporary directory
mkdir -p tmp

# Generate Go API models
openapi-generator-cli generate \
    -i ../openapi.yml \
    -g go-gin-server \
    -o ./tmp \
    --additional-properties=packageName=api_models \
    --global-property models,modelDocs=false \
    --skip-validate-spec

# Move only the models directory
mv tmp/go api_models

# Clean up temporary directory
rm -rf tmp

echo "✅ API models generated successfully in api_models/"
echo "📁 Generated files:"
ls -la api_models/
echo ""