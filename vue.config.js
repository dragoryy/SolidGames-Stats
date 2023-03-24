module.exports = {
  chainWebpack: (config) => {
    if (
      process.env.NODE_ENV == "development" ||
      process.env.NODE_ENV == "production"
    ) {
      config.plugin("copy").tap((args) => {
        args[0] = [
          {
            from: "C:\\Users\\Iliya\\Desktop\\WORK\\solid-stats\\public",
            to: "C:\\Users\\Iliya\\Desktop\\WORK\\solid-stats\\dist",
            toType: "dir",
            ignore: [
              ".DS_Store",
              "/stats/",
              "/stats/**/*",
              "*.json",
              {
                glob: "index.html",
                matchBase: false,
              },
            ],
          },
        ];
        return args;
      });
    }
  },
};

// module.exports = {
//   plugins: [
//     new CopyPlugin({
//       options: [ concurrency: 50 ],
//     }),
//   ],
// };
