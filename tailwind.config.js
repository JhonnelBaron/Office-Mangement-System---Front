// module.exports = {
//   content: [
//     // Example content paths...
//     './public/**/*.html',
//     './src/**/*.{js,jsx,ts,tsx,vue}',
//   ],
//   theme: {
//     // ...
//   }
//   // ...
// }

module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./node_modules/flowbite/**/*.{js,ts}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
        require('flowbite/plugin')
        ({
          charts: true,
      }),
    ],
  }