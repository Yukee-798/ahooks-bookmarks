import { useMemo, useRef } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  // 让每一次组件重新渲染时，fnRef.current 都保持为最新的 fn 引用，这么做是为了解决 react devtool 的 bug
  fnRef.current = useMemo(() => fn, [fn]);
  // 下面的代码等价
  // fnRef.current = fn;

  const memoizedFn = useRef<PickFunction<T>>();
  // 这里的 memoizedFn.current 为
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  // 思考一下下面两种实现方式有什么不同？
  // if (!memoizedFn.current) {
  //   memoizedFn.current = function (this, ...args) {
  //     return fnRef.current.apply(this, args);
  //   };
  // }

  // if (!memoizedFn.current) {
  //   memoizedFn.current = fnRef.current;
  // }

  return memoizedFn.current as T;
}

export default useMemoizedFn;
