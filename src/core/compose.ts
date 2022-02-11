/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 21:35:04
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2022-02-12 00:27:48
 */

/**
 * compose
 * Compose middleware function
 * 组合中间件方法
 * @param middleware
 * @returns
 */
function compose<T>(
  middleware: Array<Moineau.MiddlewareFunction<T>>
): Moineau.ComposeMiddleware<T> {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {T} context 上下文
   * @returns
   * @api public
   */
  return function (context: T) {
    let index: number = -1;
    function dispatch(i: number) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      const fn = middleware[i];
      if (i >= middleware.length) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return dispatch(0);
  }
}

export default compose;