import React, { useMemo, useState } from "react";
import styled from "styled-components";

// assets
import RLB from "../../../assets/images/Frame (60).svg";
import ERC from "../../../assets/images/Frame 160.svg";
import BTC from "../../../assets/images/IMAGE (1).svg";
import ETH from "../../../assets/images/IMAGE (2).svg";
import LTC from "../../../assets/images/IMAGE (3).svg";
import SOL from "../../../assets/images/IMAGE (4).svg";
import COIN from "../../../assets/images/IMAGE (5).svg";
import NFT from "../../../assets/images/svg.svg";
import ARROW from "../../../assets/modelImages/Frame (5).svg";

// scrollbar style
const ScrollWrap = styled.div`
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }
  &::-webkit-scrollbar-track {
    background: #1a1d29;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: rgba(203, 215, 255, 0.08);
  }
`;

const styles = {
  page: {
    width: 760,
    maxWidth: "100%",
    padding: 16,
  },

  title: {
    margin: "0 0 10px 0",
    color: "#fff",
    fontSize: 22,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  },

  cardPick: {
    background: "rgba(203, 215, 255, 0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "18px 12px",
    cursor: "pointer",
    display: "grid",
    justifyItems: "center",
    gap: 10,
    minHeight: 130,
  },

  pickLabel: {
    color: "#B1B6C6",
    fontSize: 14,
    textAlign: "center",
    lineHeight: "18px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 8px",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
  },

  headerTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    margin: 0,
    color: "#fff",
    fontSize: 22,
    fontWeight: 500,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  txLink: {
    marginLeft: "auto",
    fontSize: 14,
    color: "#FFB018",
    cursor: "pointer",
    whiteSpace: "nowrap",
    userSelect: "none",
  },

  panel: {
    marginTop: 16,
    background: "rgba(203, 215, 255, 0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 18,
  },

  info: {
    margin: 0,
    color: "#B1B6C6",
    fontSize: 14,
    lineHeight: "22px",
  },

  form: {
    marginTop: 14,
    display: "grid",
    gap: 14,
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#B1B6C6",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  required: { color: "#FF4949" },

  input: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15, 17, 26, 0.55)",
    padding: "0 14px",
    color: "#fff",
    outline: "none",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr auto",
    gap: 10,
    alignItems: "center",
  },

  inputWithIcon: {
    position: "relative",
    width: "100%",
  },

  icon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 20,
    height: 20,
    opacity: 0.9,
  },

  amountInput: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15, 17, 26, 0.55)",
    padding: "0 14px 0 42px",
    color: "#fff",
    outline: "none",
  },

  equals: { color: "#fff", fontSize: 18, opacity: 0.8, padding: "0 4px" },

  actionBtn: (disabled) => ({
    height: 52,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: disabled ? "rgba(255,255,255,0.06)" : "#86F454",
    boxShadow: disabled ? "none" : "0px 0px 10px rgba(118, 255, 25, 0.40)",
    color: disabled ? "rgba(255,255,255,0.55)" : "#141722",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
  }),

  foot: { marginTop: 12, display: "grid", gap: 6 },

  small: { margin: 0, color: "#B1B6C6", fontSize: 12, lineHeight: "18px" },

  fee: { display: "flex", gap: 8, alignItems: "center", color: "#B1B6C6", fontSize: 12 },

  pill: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#fff",
  },
};

// configs (um lugar só)
const WITHDRAW_COINS = {
  bitcoin: { key: "bitcoin", label: "Bitcoin", symbol: "BTC", icon: BTC, feeUsd: 1.13 },
  ethereum: { key: "ethereum", label: "Ethereum", symbol: "ETH", icon: ETH, feeUsd: 1.45 },
  litecoin: { key: "litecoin", label: "Litecoin", symbol: "LTC", icon: LTC, feeUsd: 1.45 },
  solana: { key: "solana", label: "Solana", symbol: "SOL", icon: SOL, feeUsd: 1.45 },
};

// validação leve (apenas UX)
function looksLikeAddress(coinKey, value) {
  const v = (value || "").trim();
  if (!v) return true;

  if (coinKey === "ethereum") return /^0x[a-fA-F0-9]{40}$/.test(v);

  // BTC/LTC/SOL variam, aqui é só “mínimo” pra não travar UX
  return v.length >= 24;
}

function WithdrawScreen({ coin, onBack, onViewTransactions }) {
  const [address, setAddress] = useState("");
  const [coins, setCoins] = useState("");
  const [assetAmount, setAssetAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const hasAddress = address.trim().length > 0;
    const hasAmount = (assetAmount || coins).toString().trim().length > 0;
    const isOk = looksLikeAddress(coin.key, address);
    return hasAddress && hasAmount && isOk && !loading;
  }, [address, assetAmount, coins, coin.key, loading]);

  const submit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);

      // TODO: ligar sua API aqui
      // await gameApi.payment.processWithdrawal({ asset: coin.symbol, address, amountAsset: assetAmount, amountCoins: coins })

      console.log("WITHDRAW:", { asset: coin.symbol, address, coins, assetAmount });
      alert("✅ Withdrawal request sent!");
      setCoins("");
      setAssetAmount("");
    } catch (e) {
      alert("❌ Failed to request withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className="fade-in">
      {/* Header */}
      <div style={styles.header}>
        <button type="button" style={styles.backBtn} onClick={onBack} aria-label="Go back" title="Back">
          <img src={ARROW} alt="" style={{ width: 9, height: 16 }} />
        </button>

        <div style={styles.headerTitleRow}>
          <img src={coin.icon} alt={coin.symbol} style={{ width: 32, height: 32 }} />
          <h2 style={styles.headerTitle}>
            Withdraw {coin.label}
          </h2>

          <span style={styles.txLink} onClick={onViewTransactions} role="button" tabIndex={0}>
            View Transactions
          </span>
        </div>
      </div>

      {/* Panel */}
      <div style={styles.panel} className="glow">
        <p style={styles.info}>
          Please enter the {coin.label} wallet address you wish to receive the funds on. Once confirmed,
          the withdrawal is usually processed within a few minutes.
        </p>

        <div style={styles.form}>
          {/* Address */}
          <div>
            <div style={styles.label}>
              Receiving {coin.label} address <span style={styles.required}>*</span>
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={coin.key === "ethereum" ? "0x..." : "Wallet address"}
              style={styles.input}
              autoComplete="off"
              spellCheck={false}
            />
            {address.trim().length > 0 && !looksLikeAddress(coin.key, address) && (
              <p style={{ ...styles.small, color: "#FFB018", marginTop: 8 }}>
                ⚠ This address doesn’t look valid for {coin.symbol}.
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <div style={styles.label}>
              Withdrawal amount <span style={styles.required}>*</span>
            </div>

            <div style={styles.row}>
              <div style={styles.inputWithIcon}>
                <img src={COIN} alt="" style={styles.icon} />
                <input
                  value={coins}
                  onChange={(e) => setCoins(e.target.value)}
                  placeholder="Amount in Coins"
                  style={styles.amountInput}
                  inputMode="decimal"
                />
              </div>

              <div style={styles.equals}>=</div>

              <div style={styles.inputWithIcon}>
                <img src={coin.icon} alt="" style={styles.icon} />
                <input
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
                  placeholder={`Amount in ${coin.symbol}`}
                  style={styles.amountInput}
                  inputMode="decimal"
                />
              </div>

              <button type="button" onClick={submit} disabled={!canSubmit} style={styles.actionBtn(!canSubmit)}>
                {loading ? "Processing..." : "Request withdrawal"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.foot}>
            <div style={styles.fee}>
              Network Fee: <span style={styles.pill}>${Number(coin.feeUsd).toFixed(2)}</span>
            </div>

            <p style={styles.small}>
              *You will receive the specified {coin.label} amount to your withdrawal address.
            </p>
            <p style={styles.small}>
              *The value subtracted from your balance may vary between now and the time we process your withdrawal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WModel1({ height = "25pc", onViewTransactions }) {
  const [selected, setSelected] = useState(null);

  const coin = selected ? WITHDRAW_COINS[selected] : null;

  return (
    <ScrollWrap style={{ height }}>
      {!coin ? (
        <div style={styles.page} className="fade-in">
          <p style={styles.title}>Withdraw options</p>

          <div style={styles.grid}>
            <div style={styles.cardPick} onClick={() => setSelected("bitcoin")}>
              <img src={BTC} alt="Bitcoin" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>Bitcoin (BTC)</div>
            </div>

            <div style={styles.cardPick} onClick={() => setSelected("ethereum")}>
              <img src={ETH} alt="Ethereum" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>Ethereum (ETH)</div>
            </div>

            <div style={styles.cardPick} onClick={() => setSelected("litecoin")}>
              <img src={LTC} alt="Litecoin" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>Litecoin (LTC)</div>
            </div>

            <div style={styles.cardPick} onClick={() => setSelected("solana")}>
              <img src={SOL} alt="Solana" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>Solana (SOL)</div>
            </div>
          </div>

          <div style={{ ...styles.grid, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginTop: 14 }}>
            <div style={{ ...styles.cardPick, cursor: "not-allowed", opacity: 0.6 }}>
              <img src={RLB} alt="RLB" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>Rollbit Coin (RLB)</div>
            </div>

            <div style={{ ...styles.cardPick, cursor: "not-allowed", opacity: 0.6 }}>
              <img src={ERC} alt="ERC-20" style={{ width: 44, height: 44 }} />
              <div style={styles.pickLabel}>
                ERC-20<br />
                <span style={{ fontSize: 12 }}>(UsDx, APE, and more)</span>
              </div>
            </div>

            <div style={{ ...styles.cardPick, cursor: "not-allowed", opacity: 0.6 }}>
              <img src={NFT} alt="NFT" style={{ width: 56, height: 56 }} />
              <div style={styles.pickLabel}>NFT</div>
            </div>
          </div>
        </div>
      ) : (
        <WithdrawScreen
          coin={coin}
          onBack={() => setSelected(null)}
          onViewTransactions={onViewTransactions}
        />
      )}
    </ScrollWrap>
  );
}
