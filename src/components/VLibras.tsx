"use client";

import VLibrasWidget from '@djpfs/react-vlibras';

export default function VLibras() {
  // A propriedade forceOnload={true} obriga o componente a carregar no Next.js
  return <VLibrasWidget forceOnload={true} />;
}