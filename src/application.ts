/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-22 20:45:47
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-29 01:25:32
 */

import net from 'net';
import http from 'http';
import http2 from 'http2';
import debug from "debug";
import * as core from './core';
import context from './context';
import request from './request';
import response from './response';
import EventEmitter from "events";
import onFinished from 'on-finished';
import type Moineau from '../moineau';

interface MoineauOptions {
  evn?: string;
  maxIpsCount?: number;
}

class Application extends EventEmitter {

  private env: string;
  private maxIpsCount: number;
  private context: typeof context;
  private request: typeof request;
  private response: typeof response;
  private middleware: Array<Moineau.MiddlewareFunction<Moineau.Context>>;

  constructor(options?: MoineauOptions) {
    super();

    this.env = options?.evn
      ?? process.env.NODE_ENV
      ?? 'development';

    this.maxIpsCount = options?.maxIpsCount ?? 0;

    this.middleware = [];
    this.context = Object.assign(context);
    this.request = Object.assign(request);
    this.response = Object.assign(response);
  }

  use(
    fn: Moineau.MiddlewareFunction<Moineau.Context>
  ): this {
    if (typeof fn !== 'function') throw new TypeError('params must be a function!');
    this.middleware.push(fn);
    return this;
  }

  listen(handle: any, listeningListener?: () => void): http.Server;
  listen(path: string, listeningListener?: () => void): http.Server;
  listen(port: number, listeningListener?: () => void): http.Server;
  listen(options: net.ListenOptions, listeningListener?: () => void): http.Server;
  listen(handle: any, backlog?: number, listeningListener?: () => void): http.Server;
  listen(port: number, backlog?: number, listeningListener?: () => void): http.Server;
  listen(path: string, backlog?: number, listeningListener?: () => void): http.Server;
  listen(port: number, hostname?: string, listeningListener?: () => void): http.Server;
  listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): http.Server;
  listen(): http.Server {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...arguments);
  }

  callback() {
    const fn = core.compose(this.middleware);
    const handleRequest = (
      req: http.IncomingMessage | http2.Http2ServerRequest,
      res: http.ServerResponse | http2.Http2ServerResponse
    ) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    }
    return handleRequest;
  }

  /**
   * handleRequest
   * handle In comming Request
   * 处理进来的请求
   * @param ctx
   * @param middlewareFn
   */
  private async handleRequest(
    ctx: Moineau.Context,
    middlewareFn: Moineau.ComposeMiddleware<Moineau.Context>
  ) {
    try {
      const res = ctx.res;
      res.statusCode = 404;
      const onerror = (err: Error | null) => ctx.onerror(err);
      const handleResponse = () => core.respond(ctx);
      onFinished(res, onerror);
      await middlewareFn(ctx);
      handleResponse();
    } catch (error) {
      this.onerror(error);
    }
  }

  /**
   * create Moineau Context
   * @param req
   * @param res
   * @returns
   */
  createContext(
    req: http.IncomingMessage | http2.Http2ServerRequest,
    res: http.ServerResponse | http2.Http2ServerResponse
  ) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.env = this.env;
    context.maxIpsCount = this.maxIpsCount;
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * onerror
   * @todo 完善onerror
   * @param error
   */
  onerror(error: any) {
    console.log('moineau.onerror', error);
  }

  static get default() {
    return Application;
  }

}

export default Application;