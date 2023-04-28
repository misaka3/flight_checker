#!/bin/bash

# Make sure that the required file exists
if [ ! -f "./node_modules/@deck.gl/layers/dist/es5/text-layer/font-atlas-manager.js" ]; then
    echo "Error: font-atlas-manager.js not found!"
    exit 1
fi

# Replace the require statement
sed -i 's/var _tinySdf = _interopRequireDefault(require("@mapbox\/tiny-sdf"));/var _tinySdf;\n\nimport("@mapbox\/tiny-sdf").then((module) => {\n  _tinySdf = module.default || module;\n}).catch((error) => {\n  console.error(error);\n});/' ./node_modules/@deck.gl/layers/dist/es5/text-layer/font-atlas-manager.js
