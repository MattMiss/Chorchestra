module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }]  // NativeWind JSX support
      ],
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true
        }],
        'react-native-reanimated/plugin'  // Must be last in the list
      ]
    };
  };
  