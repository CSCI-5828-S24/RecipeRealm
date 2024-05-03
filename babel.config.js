module.exports = {
  presets: [
    '@babel/preset-env',  // Transforms modern JavaScript to ES5 for compatibility
    '@babel/preset-react', // Transforms JSX for React applications
  ],
  plugins: [
    '@babel/plugin-transform-runtime',  // Helps with async/await and other transformations
  ],
};

