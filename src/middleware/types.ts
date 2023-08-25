import { RouteParams, RouterContext, State } from 'oak';

export type RouterMiddleWareFunction = <
  R extends string,
  P extends RouteParams<R>,
  S extends State,
>(context: RouterContext<R, P, S>, next: () => Promise<unknown>) => void;
