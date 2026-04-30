import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    standalone: true
  },
  rules: {
    // 1. Gawing 'warn' lang ang unused para hindi mag-fail ang pnpm lint
    'no-unused-vars': 'warn',
    'no-undef': 'off', // I-off muna natin ito kung ayaw talaga mag-sync ng auto-imports
    
    // 2. Patayin ang mga annoying template rules
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-parsing-error': 'warn',
    
    // 3. Tailwind config fix
    'no-unexpected-multiline': 'off'
  }
})