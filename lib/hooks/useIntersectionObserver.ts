import { useEffect, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): [
  (node: T | null) => void,
  IntersectionObserverEntry | undefined
] {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<T | null>(null);
  
  const frozen = entry?.isIntersecting && freezeOnceVisible;
  
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };
  
  useEffect(() => {
    if (!node || frozen) return;
    
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport) return;
    
    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [node, threshold, root, rootMargin, frozen]);
  
  return [setNode, entry];
}