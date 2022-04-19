import React from "react";
import { NetworkType, tokenDataByNetwork } from "@gearbox-protocol/sdk";

export interface TokenTableProps {
  network: NetworkType;
}

export function TokenTable({ network }: TokenTableProps) {

console.log(tokenDataByNetwork[network])

  const tokenLines = Object.entries(tokenDataByNetwork[network]).map(
    ([symbol, addr]) => (
      <tr>
        <td>{symbol}</td>
        <td>{addr}</td>
      </tr>
    )
  );

  return (
    <table style={{ width: "100%" }}>
      <thead>
        <td>Symbol</td>
        <td>Address</td>
      </thead>

      {tokenLines}
    </table>
  );
}
