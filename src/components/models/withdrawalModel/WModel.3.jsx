import { useMemo, useState } from "react";

// assets
import ETH from "../../../assets/images/IMAGE (22).png";
import COIN from "../../../assets/images/IMAGE (5).svg";
import ARROW from "../../../assets/modelImages/Frame (5).svg";

const styles = {
  wrap: {
    width: 725,
    maxWidth: "100%",
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
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: 0.6,
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

  card: {
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

  required: {
    color: "#FF4949",
    fontSize: 12,
  },

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

  equals: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.8,
    padding: "0 4px",
  },

  actionBtn: (disabled) => ({
    height: 52,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: disabled ? "rgba(255,255,255,0.06)" : "#86F454",
    boxShadow: disabled ? "none" : "0px 0px 10px rgba(118, 255, 25, 0.40)",
    color: disabled ? "rgba(255,255,255,0.55)" : "#141722",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
  }),

  foot: {
    marginTop: 12,
    display: "grid",
    gap: 6,
  },

  small: {
    margin: 0,
    color: "#B1B6C6",
    fontSize: 12,
    lineHeight: "18px",
  },

  fee: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#B1B6C6",
    fontSize: 12,
  },

  pill: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#fff",
  },
};

function isEthAddress(value) {
  // validação simples (não é checksum), só pra UX
  return /^0x[a-fA-F0-9]{40}$/.test((value || "").trim());
}

export default function WModel3({
  onBack,
  onViewTransactions,
  networkFeeUsd = 1.45,
}) {
  const [address, setAddress] = useState("");
  const [coins, setCoins] = useState("");
  const [eth, setEth] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const hasAddress = address.trim().length > 0;
    const hasAmount = (eth || coins).toString().trim().length > 0;
    return hasAddress && hasAmount && isEthAddress(address) && !loading;
  }, [address, eth, coins, loading]);

  const submit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);

      // Aqui você liga na sua API depois:
      // await gameApi.payment.processWithdrawal({ address, amountEth: eth, amountCoins: coins, asset: "ETH" })

      console.log("WITHDRAW REQUEST:", { address, coins, eth });
      // feedback UX simples
      alert("✅ Withdrawal request sent!");
      setCoins("");
      setEth("");
    } catch (e) {
      alert("❌ Failed to request withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap} className="fade-in">
      {/* Header */}
      <div style={styles.header}>
        <button
          type="button"
          style={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
          title="Back"
        >
          <img src={ARROW} alt="" style={{ width: 9, height: 16 }} />
        </button>

        <div style={styles.titleRow}>
          <img src={ETH} alt="ETH" style={{ width: 32, height: 32 }} />
          <h2 style={styles.title}>Withdraw Ethereum</h2>

          <span
            style={styles.txLink}
            onClick={onViewTransactions}
            role="button"
            tabIndex={0}
          >
            View Transactions
          </span>
        </div>
      </div>

      {/* Card */}
      <div style={styles.card} className="glow">
        <p style={styles.info}>
          Please enter the Ethereum wallet address you wish to receive the funds
          on. Once confirmed, the withdrawal is usually processed within a few
          minutes.
        </p>

        <div style={styles.form}>
          {/* Address */}
          <div>
            <div style={styles.label}>
              Receiving Ethereum address <span style={styles.required}>*</span>
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              style={styles.input}
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
            />
            {address.trim().length > 0 && !isEthAddress(address) && (
              <p style={{ ...styles.small, color: "#FFB018", marginTop: 8 }}>
                ⚠ Looks like an invalid ETH address (expected 0x + 40 hex chars).
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
                <img src={ETH} alt="" style={styles.icon} />
                <input
                  value={eth}
                  onChange={(e) => setEth(e.target.value)}
                  placeholder="Amount in ETH"
                  style={styles.amountInput}
                  inputMode="decimal"
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                style={styles.actionBtn(!canSubmit)}
              >
                {loading ? "Processing..." : "Request withdrawal"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.foot}>
            <div style={styles.fee}>
              Network Fee: <span style={styles.pill}>${Number(networkFeeUsd).toFixed(2)}</span>
            </div>

            <p style={styles.small}>
              *You will receive the specified Ethereum amount to your withdrawal
              address.
            </p>
            <p style={styles.small}>
              *The value subtracted from your balance may vary between now and
              the time we process your withdrawal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
