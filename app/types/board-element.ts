const ELEMENT_CLASS = {
  CLA: 'cla',
  CLB: 'clb'
}

export type BoardElementClass = typeof ELEMENT_CLASS[keyof typeof ELEMENT_CLASS];
export type BoardElement = {
  id: string;
  class: BoardElementClass;
  data: any;
  index?: number;
  minHeight?: number;
  minWidth?: number;
  bounds?: { t: number; r: number; b: number; l: number };
  position?: { x: number; y: number };
  classBasedData?: any;
  style?: React.CSSProperties;
}