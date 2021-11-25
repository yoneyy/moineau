declare namespace Moineau {
  export type Next = () => Promise<any>;
  export type MiddlewareFunction<T> = (context: T, next: Next) => any;
  export type ComposeMiddleware<T> = (context: T, next?: Next) => Promise<void>;
}