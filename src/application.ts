/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-22 20:45:47
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-26 01:41:38
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

export interface MoineauOptions {
  evn?: string;
  maxIpsCount?: number;
}

export default class Moineau extends EventEmitter {

  private env: string;
  private maxIpsCount: number;
  private context: typeof context;
  private request: typeof request;
  private response: typeof response;
  private middleware: Array<Moineau.MiddlewareFunction<any>>;

  constructor(options: MoineauOptions) {
    super();

    this.env = options.evn
      ?? process.env.NODE_ENV
      ?? 'development';

    this.maxIpsCount = options.maxIpsCount ?? 0;

    this.middleware = [];
    this.context = Object.assign(context);
    this.request = Object.assign(request);
    this.response = Object.assign(response);
  }

  use(fn: Moineau.MiddlewareFunction<any>) {
    if (typeof fn !== 'function') throw new TypeError('params must be a function!');
    this.middleware.push(fn);
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
   * @todo 完善 handleRequest 方法
   * @param ctx
   * @param fn
   */
  handleRequest(ctx: any, fn: any) {
    console.log(ctx, fn)
  }

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

}