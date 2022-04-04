// {
//     "env": {
//         "browser": true,
//         "es6": true,
//         "node": true
//     },
//     "extends": [
//         "plugin:react/recommended",
//         "airbnb",
//         "react-app"
//     ],
//     "parser": "babel-eslint",
//     "parserOptions": {
//         "ecmaFeatures": {
//             "jsx": true,
//             "legacyDecorators": true
//         },
//         "ecmaVersion": 12,
//         "sourceType": "module"
//     },
//     "plugins": [
//         "react"
//     ],
//     "rules": {
//         "indent": ["error", 4],
//         "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0 }],
//         "react/jsx-indent": ["error" , 4],
//         "react/jsx-indent-props": ["error" , 4],
//         "react/state-in-constructor": "off",
//         "jsx-a11y/no-static-element-interactions": "off",
//         "jsx-a11y/click-events-have-key-events": "off",
//         "jsx-a11y/no-noninteractive-element-interactions": "off",
//         "jsx-a11y/label-has-associated-control": "off",
//         "no-underscore-dangle": "off",
//         "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }],


//         "max-len": "off",
//         "no-return-assign": "off",
//         "no-console": "error",
//         "object-curly-newline": "off",
//         "arrow-parens": "off",
//         "camelcase": "off",
//         "no-extra-boolean-cast": "off",
//         "react/jsx-filename-extension": "off",
//         "react/jsx-no-bind": "off",
//         "react/no-unused-state": "off",
//         "react/require-default-props": "off",
//         "react/destructuring-assignment": "off",
//         "no-shadow": "off",
//         "import/prefer-default-export": "off",
//         "react/forbid-prop-types": "off",
//         "no-useless-constructor": "off",
//         "no-use-before-define": "off",
//         "react-hooks/exhaustive-deps": "off",
//         "import/no-unresolved": "off",
//         "react/jsx-props-no-spreading": "off",
//         "no-unused-expressions": "off",
//         "no-unused-vars": "error",
//         "react/jsx-one-expression-per-line": "off"
//     }
// }

module.exports = {
  root: true,
  extends: ['react-app'],
};