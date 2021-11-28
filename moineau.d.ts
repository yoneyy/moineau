/// <reference types="node" />

import net from 'net';
import http from 'http';
import http2 from 'http2';
import EventEmitter from "events";

/**
 * @class Moineau
 * @public
 */
declare class Moineau extends EventEmitter {
  private env;
  private maxIpsCount;
  private context;
  private request;
  private response;
  private middleware;
  constructor(options?: Moineau.MoineauOptions);

  use(fn: Moineau.MiddlewareFunction<Moineau.Context>): Moineau;

  /**
   * Moineau HTTP Servier listener
   */
  listen(handle: any, listeningListener?: () => void): http.Server;
  listen(path: string, listeningListener?: () => void): http.Server;
  listen(port: number, listeningListener?: () => void): http.Server;
  listen(options: net.ListenOptions, listeningListener?: () => void): http.Server;
  listen(handle: any, backlog?: number, listeningListener?: () => void): http.Server;
  listen(port: number, backlog?: number, listeningListener?: () => void): http.Server;
  listen(path: string, backlog?: number, listeningListener?: () => void): http.Server;
  listen(port: number, hostname?: string, listeningListener?: () => void): http.Server;
  listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): http.Server;

  callback(): (
    req: http.IncomingMessage | http2.Http2ServerRequest,
    res: http.ServerResponse | http2.Http2ServerResponse
  ) => Promise<void>;

  private handleRequest(
    ctx: Moineau.Context,
    middlewareFn: Moineau.ComposeMiddleware<Moineau.Context>
  ): Promise<void>;

  /**
   * create Moineau Context
   * @param req
   * @param res
   */
  createContext(
    req: http.IncomingMessage | http2.Http2ServerRequest,
    res: http.ServerResponse | http2.Http2ServerResponse
  ): any;

  onerror(error: any): void;

  static get default(): typeof Moineau;
}

/**
 * @namespace Moineau
 */
declare namespace Moineau {
  type Next = () => Promise<any>;
  type MiddlewareFunction<T> = (context: T, next: Next) => any;
  type ComposeMiddleware<T> = (context: T, next?: Next) => Promise<void>;
  type ParameterizedContext<StateT = DefaultState, ContextT = DefaultContext, ResBodyT = unknown> = ExtendableContext
    & ContextT
    & { state: StateT; }
    & { body: ResBodyT; response: { body: ResBodyT } };

  /**
   * Context delegate request object
   */
  interface ContextDelegatedRequest {
    /**
     * Retrun request header
     */
    header: http.IncomingHttpHeaders;

    /**
     * Return request headers, alias as request.header
     */
    headers: http.IncomingHttpHeaders;

    /**
     * Return request url
     */
    url: string | undefined;

    /**
     * Get origin of URL
     */
    origin: string;

    /**
     * Get full request URL
     */
    href: string;

    /**
     * Get request method
     */
    method: string;

    /**
     * Get request pathname
     */
    path: string;

  }

  /**
   * Context delegate response object
   */
  interface ContextDelegatedResponse {

  }

  type DefaultStateExtends = any;
  /**
   * This interface can be augmented by users to add types to Moineau default state
   */
  interface DefaultState extends DefaultStateExtends { }

  type DefaultContextExtends = {};
  /**
   * This interface can be augmented by users to add types to Moineau default context
   */
  interface DefaultContext extends DefaultContextExtends {
    /**
     * Moineau Context Custom properties.
     */
    [key: string]: any;
  }

  interface MoineauOptions {
    evn?: string;
    maxIpsCount?: number;
  }

  interface BaseContext extends ContextDelegatedRequest, ContextDelegatedResponse {
    /**
     * util.inspect() implementation, which
     * just returns the JSON output.
     */
    inspect(): any;

    /**
     * Return JSON representation.
     *
     * Here we explicitly invoke .toJSON() on each
     * object, as iteration will otherwise fail due
     * to the getters and cause utilities such as
     * clone() to fail.
     */
    toJSON(): any;

    onerror: (err: Error | null) => void;
  }

  interface BaseRequest extends ContextDelegatedRequest { }

  interface BaseResponse extends ContextDelegatedResponse { }

  interface ExtendableContext extends BaseContext {
    env: string;

    app: Moineau;
    request: Request;
    response: Response;
    res: http.ServerResponse;
    req: http.IncomingMessage;

    maxIpsCount: number;
    originalUrl: string;
  }

  interface Context extends ParameterizedContext { }

  interface Request extends BaseRequest {
    ip: string;

    app: Moineau;
    res: http.ServerOptions;
    req: http.IncomingMessage;
    ctx: Context;
    response?: Response;

    originalUrl?: string;
  }

  export interface Response extends BaseResponse {
    app: Moineau;
    res: http.ServerResponse;
    req: http.IncomingMessage;
    ctx: Context;
    request: Request;
  }
}

export = Moineau;