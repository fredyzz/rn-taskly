// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-native"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        semi: true,
      },
    ],
    "react-native/no-unused-styles": "error",
  },
};
