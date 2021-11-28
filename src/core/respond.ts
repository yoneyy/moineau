/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-28 15:30:08
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-29 01:04:02
 */

import type Moineau from "../../moineau";

function respond(ctx: Moineau.Context) {
  ctx.res.end('HELLO WORLD')
}

export default respond;