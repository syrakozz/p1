import React, { ReactNode } from 'react';
import { H3 } from 'tamagui';

export default function Heading({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return (
    <H3 mt={first ? '$0' : '$3.5'} mb="$2" fontWeight="500">
      {children}
    </H3>
  );
}
