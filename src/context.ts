/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 11:47:15
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-29 01:22:34
 */

import util from 'util';
import { delegate } from './helpers';
import type Moineau from '../moineau';

const context: Moineau.Context | Record<string | symbol, any> = {

  inspect() {
    if (this === context) return this;
    return this.toJSON();
  },

  toJSON() {
    return {
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    }
  },

  onerror(err: Error | null) {
    if (err) {
      console.log('context.onerror', err);
    }
  }
}

context[util.inspect.custom] = context.inspect;

// function delegate(target: string, name: string) {
//   Object.defineProperty(context, name, {
//     get() {
//       return this[target][name];
//     }
//   });
// }

// delegate('request', 'header')


delegate(context, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('has')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

delegate(context, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .access('accept')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');

export default context;