import { useRef } from 'react';
import type { DependencyList, useEffect, useLayoutEffect } from 'react';
import { depsEqual } from '../utils/depsEqual';

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

// 工厂函数，通过 createDeepCompareEffect(useEffect) 来创建 useDeepCompareEffect
// 为什么要这么做？因为还有 useLayoutEffect，那么可以使用同一个工厂函数创建 useDeepCompareLayoutEffect
export const createDeepCompareEffect: CreateUpdateEffect = (hook) => (effect, deps) => {
  // 通过 ref 来保存更新前的 deps
  const ref = useRef<DependencyList>();
  // 这个命名可以学习一下 signalRef 信号（更新信号）
  const signalRef = useRef<number>(0);

  // signalRef 来表示 deps 是否发生更新
  if (deps === undefined || !depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  // useDeepCompare 通过修改 signalRef.current 来决定是否执行 effect
  hook(effect, [signalRef.current]);
};
