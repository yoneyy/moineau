import http from 'http';

export type MethodsList = string[];

/**
 * getCurrentHttpMethods
 * Get current node HTTP methods
 * @returns
 */
function getCurrentHttpMethods(): MethodsList | undefined {
  return http.METHODS || (<MethodsList>http.METHODS).length === 0
    ? http.METHODS.map(method => {
      return method.toLocaleLowerCase();
    }) : undefined;
}

/**
 * getBasicHttpMethods
 * Get basic HTTP methods
 * 获取基础/常见的请求方法
 * @returns
 */
function getBasicHttpMethods(): MethodsList {
  return [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect'
  ];
}

export default getCurrentHttpMethods() ?? getBasicHttpMethods();