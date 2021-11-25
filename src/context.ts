/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 11:47:15
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-26 01:39:40
 */

import { delegate } from './helpers';

const context = {

}

delegate(context, 'request')
  .method('remove')
  .access('type')
  .access('body')
  .access('etag')
  .access('status')
  .access('length')
  .access('message')
  .access('lastModified')
  .getter('headerSent');

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