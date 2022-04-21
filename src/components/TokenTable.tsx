import React from "react";
import { NetworkType, tokenDataByNetwork } from "@gearbox-protocol/sdk";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "react-feather";

export interface TokenTableProps {
  network: NetworkType;
}

export function TokenTable({ network }: TokenTableProps) {
  console.log(tokenDataByNetwork[network]);

  const tokenLines = Object.entries(tokenDataByNetwork[network]).map(
    ([symbol, addr]) => (
      <tr>
        <td>{symbol}</td>
        <td>
          <a
            href={
              network === "Kovan"
                ? `https://kovan.etherscan.io/address/${addr}`
                : `https://etherscan.io/address/${addr}`
            }
            target="_blank"
            rel="noopener"
          >
            {addr}
          </a>
          {addr !== "" ? (
            <CopyToClipboard
              text={addr}
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              <Copy size={14} />
            </CopyToClipboard>
          ) : (
            <div />
          )}
        </td>
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
