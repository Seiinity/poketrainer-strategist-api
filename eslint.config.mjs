import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config
(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    {
        plugins:
        {
            "@stylistic": stylistic,
        },
        rules:
        {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
            "no-unexpected-multiline": "off",

            "@stylistic/array-bracket-spacing": ["error", "never"],
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
            "@stylistic/block-spacing": ["error", "always"],
            "@stylistic/brace-style": ["error", "allman"],
            "@stylistic/comma-dangle": ["error", { objects: "always-multiline" }],
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/comma-style": ["error", "last"],
            "@stylistic/computed-property-spacing": ["error", "never"],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/eol-last": ["error", "always"],
            "@stylistic/function-paren-newline": ["error", "multiline"],
            "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/jsx-quotes": ["error", "prefer-double"],
            "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true, mode: "strict" }],
            "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
            "@stylistic/lines-between-class-members": ["error", { enforce: [{ blankLine: "always", prev: "*", next: "*" }] }, { exceptAfterSingleLine: true }],
            "@stylistic/max-statements-per-line": ["error", { max: 1 }],
            "@stylistic/member-delimiter-style": ["error"],
            "@stylistic/multiline-ternary": ["error", "always-multiline"],
            "@stylistic/new-parens": ["error", "always"],
            "@stylistic/newline-per-chained-call": ["error"],
            "@stylistic/no-confusing-arrow": ["error"],
            "@stylistic/no-extra-parens": ["error", "all", { ternaryOperandBinaryExpressions: false }],
            "@stylistic/no-extra-semi": ["error"],
            "@stylistic/no-floating-decimal": ["error"],
            "@stylistic/no-mixed-spaces-and-tabs": ["error"],
            "@stylistic/no-multi-spaces": ["error"],
            "@stylistic/no-multiple-empty-lines": ["error"],
            "@stylistic/no-trailing-spaces": ["error"],
            "@stylistic/no-whitespace-before-property": ["error"],
            "@stylistic/nonblock-statement-body-position": ["error", "beside"],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/one-var-declaration-per-line": ["error"],
            "@stylistic/operator-linebreak": ["error", "after", { overrides: { "?": "before", ":": "before" } }],
            "@stylistic/padded-blocks": ["error", "never"],
            "@stylistic/quote-props": ["error", "consistent-as-needed"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/rest-spread-spacing": ["error"],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/semi-spacing": ["error", { before: false, after: true }],
            "@stylistic/semi-style": ["error", "last"],
            "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
            "@stylistic/space-in-parens": ["error", "never"],
            "@stylistic/space-infix-ops": ["error", { int32Hint: true }],
            "@stylistic/space-unary-ops": ["error", { words: true, nonwords: false }],
            "@stylistic/spaced-comment": ["error", "always"],
            "@stylistic/switch-colon-spacing": ["error", { after: true, before: false }],
            "@stylistic/template-curly-spacing": ["error", "never"],
            "@stylistic/type-annotation-spacing": ["error", { before: false, after: true }],
            "@stylistic/wrap-regex": ["error"],
        },
    }
);
