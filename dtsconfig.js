module.exports = {
    entries: [
        {
            filePath: "./src/index.ts",
            outFile: "./dist/index.d.ts",
            libraries: {
                importedLibraries: [
                    "ajv",
                    "express",
                    "fs"
                ],
            }
        }
    ]
};