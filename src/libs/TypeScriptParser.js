const ts = require('typescript');
const fs = require('node:fs/promises');
const path = require('node:path');
const _eval = require('eval');

/**
 *
 * @param {import('node:fs').PathLike} filePath
 * @param {import('node:fs').PathLike} pathToTsConfig
 */
async function parse(filePath, pathToTsConfig) {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');

    const tsconfigPath = path.resolve(pathToTsConfig);

    const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (error) {
      throw new Error(`Error reading tsconfig.json: ${error.messageText}`);
    }

    const { options, errors } = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      path.dirname(tsconfigPath)
    );
    if (errors.length > 0) {
      throw new Error(
        `Error parsing tsconfig.json: ${errors.map((e) => e.messageText).join('\n')}`
      );
    }

    const result = ts.transpileModule(fileContents, {
      compilerOptions: options,
      fileName: filePath,
    });

    if (result.diagnostics && result.diagnostics.length > 0) {
      const errors = result.diagnostics.map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        } else {
          return message;
        }
      });
      throw new Error(errors.join('\n'));
    }

    return result.outputText;
  } catch (error) {
    throw new Error(`TypeScript compilation error: ${error}`);
  }
}

/**
 *
 * @param {import('node:fs').PathLike} path
 * @returns {typeof object}
 */
async function importParse(path) {
  const code = await parse(path, 'tsconfig.json');
  const modules = _eval(code, true);

  return modules;
}

module.exports = {
  parse, importParse
};
