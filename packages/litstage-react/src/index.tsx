import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode
} from "react";
import { createRunner, type FrameContext, type LitStageSketch, type Runner } from "@litsquare/litstage";

export interface LitStageContextValue {
  runner: Runner | null;
  frameContext: FrameContext | null;
  setFrameContext(nextContext: Partial<FrameContext>): Promise<FrameContext>;
}

export interface LitStageProviderProps {
  rootRef: MutableRefObject<HTMLElement | null>;
  sketch: LitStageSketch;
  initialContext?: Partial<FrameContext>;
  children: ReactNode;
}

const LitStageContext = createContext<LitStageContextValue | null>(null);

export function LitStageProvider({ rootRef, sketch, initialContext, children }: LitStageProviderProps) {
  const runnerRef = useRef<Runner | null>(null);
  const [frameContext, setFrameContextState] = useState<FrameContext | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const runner = createRunner({
      root,
      sketch,
      ...(initialContext === undefined ? {} : { initialContext })
    });
    runnerRef.current = runner;
    setFrameContextState(runner.getCurrentContext());

    return () => {
      runnerRef.current = null;
      void runner.destroy();
    };
  }, [initialContext, rootRef, sketch]);

  const setFrameContext = useCallback(async (nextContext: Partial<FrameContext>) => {
    if (!runnerRef.current) {
      throw new Error("litStage runner is not mounted.");
    }
    const context = await runnerRef.current.setFrameContext(nextContext);
    setFrameContextState(context);
    return context;
  }, []);

  const value = useMemo<LitStageContextValue>(() => ({
    runner: runnerRef.current,
    frameContext,
    setFrameContext
  }), [frameContext, setFrameContext]);

  return (
    <LitStageContext.Provider value={value}>
      {children}
    </LitStageContext.Provider>
  );
}

export function useLitStage(): LitStageContextValue {
  const value = useContext(LitStageContext);
  if (!value) {
    throw new Error("useLitStage must be used inside LitStageProvider.");
  }
  return value;
}

export function useLitStageFrame(): FrameContext | null {
  return useLitStage().frameContext;
}
