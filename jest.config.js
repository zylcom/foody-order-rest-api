const config = {
  setupFilesAfterEnv: ["./__test__/setup.js"],
  verbose: true,
  testTimeout: 60000,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};

export default config;
