declare module 'react-qr-code' {
  import * as React from 'react';

  export interface QrCodeProps extends React.SVGProps<SVGSVGElement> {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    title?: string;
  }

  const QrCode: React.FC<QrCodeProps>;
  export default QrCode;
}
