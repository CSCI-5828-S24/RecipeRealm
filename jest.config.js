module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transforms JS and JSX files using Babel
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)', // Ensures that Jest transforms specific node_modules
  ],
};

