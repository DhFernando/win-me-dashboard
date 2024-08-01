import {onCLS, onINP, onLCP, onFCP, onTTFB, onFID} from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onFID(onPerfEntry);
  }
};

export default reportWebVitals;
