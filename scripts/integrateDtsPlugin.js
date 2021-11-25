/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-10-21 02:39:18
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-25 21:59:09
 */

const fs = require('fs');
const path = require('path');

/**
 * integrateDtsPlugin
 * @param {string} targetFile
 * @param {string} context
 */
export default function integrateDtsPlugin(targetFile, tofile) {
  return {
    name: 'integrateDtsPlugin',
    writeBundle() {
      const toDts = path.resolve(tofile);
      const targetDts = path.resolve(targetFile);

      const toCtx = fs.readFileSync(toDts, { encoding: 'utf8' });
      const targetCtx = fs.readFileSync(targetDts, { encoding: 'utf8' });
      const content = `${toCtx}\n${targetCtx}\n export = Moineau;`;
      fs.writeFileSync(toDts, content);
    }
  }
}