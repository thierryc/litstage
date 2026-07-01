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
import { createRunner, type FrameContext, type LitSquareStageSketch, type Runner } from "@litsquare/stage";

export interface LitSquareStageContextValue {
  runner: Runner | null;
  frameContext: FrameContext | null;
  setFrameContext(nextContext: Partial<FrameContext>): Promise<FrameContext>;
}

export interface LitSquareStageProviderProps {
  rootRef: MutableRefObject<HTMLElement | null>;
  sketch: LitSquareStageSketch;
  initialContext?: Partial<FrameContext>;
  children: ReactNode;
}

const LitSquareStageContext = createContext<LitSquareStageContextValue | null>(null);

export function LitSquareStageProvider({ rootRef, sketch, initialContext, children }: LitSquareStageProviderProps) {
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
      throw new Error("LitSquare Stage runner is not mounted.");
    }
    const context = await runnerRef.current.setFrameContext(nextContext);
    setFrameContextState(context);
    return context;
  }, []);

  const value = useMemo<LitSquareStageContextValue>(() => ({
    runner: runnerRef.current,
    frameContext,
    setFrameContext
  }), [frameContext, setFrameContext]);

  return (
    <LitSquareStageContext.Provider value={value}>
      {children}
    </LitSquareStageContext.Provider>
  );
}

export function useLitSquareStage(): LitSquareStageContextValue {
  const value = useContext(LitSquareStageContext);
  if (!value) {
    throw new Error("useLitSquareStage must be used inside LitSquareStageProvider.");
  }
  return value;
}

export function useLitSquareStageFrame(): FrameContext | null {
  return useLitSquareStage().frameContext;
}
