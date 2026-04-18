import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR VALUES
const SUPABASE_URL = "https://wnddhjthqncqzlwnxuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_w_LFYA3vl63sPT5jhHwsmA_iUZtW0w2";

const supabase =
  SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_PUBLISHABLE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, rgba(20,184,166,0.05), #f1f5f9)",
    padding: "16px",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#0f172a",
  },
  shell: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: "14px",
  },
  primaryButton: {
    border: "none",
    background: "#0d9488",
    color: "white",
    borderRadius: "16px",
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(13, 148, 136, 0.18)",
  },
  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  twoColGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statInner: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "16px",
    background: "#ecfeff",
    color: "#0d9488",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: 700,
  },
  statTitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: 800,
    lineHeight: 1.15,
  },
  statSub: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
  tabsWrap: {
    display: "flex",
    gap: "8px",
    background: "#f1f5f9",
    borderRadius: "16px",
    padding: "6px",
    marginBottom: "16px",
  },
  tab: {
    flex: 1,
    borderRadius: "12px",
    border: "1px solid #99f6e4",
    background: "white",
    color: "#334155",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabActive: {
    background: "#0d9488",
    color: "white",
    borderColor: "#0d9488",
  },
  dayCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  dayInfo: {
    padding: "24px 24px 0",
  },
  contentPad: {
    padding: "0 24px 24px",
  },
  pills: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(72px, 1fr))",
    gap: "8px",
  },
  pill: {
    background: "#ecfeff",
    borderRadius: "14px",
    padding: "10px 12px",
    textAlign: "center",
  },
  pillLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  pillValue: {
    fontWeight: 700,
    color: "#134e4a",
  },
  feedCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "12px",
    background: "#ffffff",
  },
  feedTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  feedTime: {
    fontSize: "22px",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  feedTotal: {
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  muted: {
    color: "#64748b",
    fontSize: "14px",
  },
  feedDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
    marginBottom: "12px",
  },
  detailBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "10px 12px",
  },
  detailLabel: {
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "4px",
  },
  detailValue: {
    fontSize: "15px",
    fontWeight: 700,
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "12px",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  ghostButton: {
    border: "1px solid #dbeafe",
    background: "white",
    color: "#0f172a",
    borderRadius: "14px",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid #fecdd3",
    background: "white",
    color: "#be123c",
    borderRadius: "14px",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  summaryInner: {
    padding: "24px",
  },
  summaryValue: {
    fontSize: "30px",
    fontWeight: 800,
    marginTop: "8px",
  },
  emptyState: {
    textAlign: "center",
    padding: "56px 24px",
    color: "#64748b",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    zIndex: 50,
  },
  modalCard: {
    width: "100%",
    maxWidth: "640px",
    background: "white",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 24px 48px rgba(15, 23, 42, 0.22)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "24px 24px 0",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: 800,
    margin: 0,
  },
  modalBody: {
    padding: "24px",
  },
  progressRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  progressBar: {
    height: "8px",
    flex: 1,
    borderRadius: "999px",
    background: "#e2e8f0",
  },
  formGrid: {
    display: "grid",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "white",
    padding: "14px 16px",
    fontSize: "16px",
    outline: "none",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "white",
    padding: "14px 16px",
    fontSize: "16px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "110px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "white",
    padding: "14px 16px",
    fontSize: "16px",
    outline: "none",
    resize: "vertical",
  },
  noteBox: {
    background: "#ecfeff",
    color: "#115e59",
    borderRadius: "16px",
    padding: "14px 16px",
    fontSize: "14px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "0 24px 24px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
    borderRadius: "16px",
    padding: "14px 18px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  errorCard: {
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    color: "#92400e",
    borderRadius: "18px",
    padding: "14px 16px",
    marginBottom: "16px",
    fontSize: "14px",
  },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  });
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayNameFromKey(dateKey) {
  return new Date(dateKey).toLocaleDateString("en-IE", { weekday: "long" });
}

function timeNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function mapDbEntryToUi(entry) {
  return {
    id: entry.id,
    date: entry.date,
    time: entry.time,
    breastMl: entry.breast_ml ?? 0,
    formulaMl: entry.formula_ml ?? 0,
    totalMl: entry.total_ml ?? 0,
    wet: entry.wet ?? "No",
    dirty: entry.dirty ?? "No",
    downTime: entry.down_time ?? "",
    notes: entry.notes ?? "",
    createdAt: entry.created_at ?? null,
  };
}

function buildDailyGroups(entries) {
  const groups = {};

  for (const entry of entries) {
    if (!groups[entry.date]) {
      groups[entry.date] = {
        date: entry.date,
        day: dayNameFromKey(entry.date),
        feeds: [],
        totalMl: 0,
        wetCount: 0,
        dirtyCount: 0,
      };
    }

    groups[entry.date].feeds.push(entry);
    groups[entry.date].totalMl += toNumber(entry.totalMl);
    if (entry.wet === "Yes") groups[entry.date].wetCount += 1;
    if (entry.dirty === "Yes") groups[entry.date].dirtyCount += 1;
  }

  return Object.values(groups)
    .map((g) => ({
      ...g,
      feeds: g.feeds.sort((a, b) => a.time.localeCompare(b.time)),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const initialForm = {
  date: getTodayKey(),
  time: timeNow(),
  breastMl: "",
  formulaMl: "",
  wet: "No",
  dirty: "No",
  downTime: "",
  notes: "",
};

function toFormValues(entry) {
  return {
    date: entry.date,
    time: entry.time,
    breastMl: String(entry.breastMl ?? ""),
    formulaMl: String(entry.formulaMl ?? ""),
    wet: entry.wet ?? "No",
    dirty: entry.dirty ?? "No",
    downTime: entry.downTime ?? "",
    notes: entry.notes ?? "",
  };
}

function parseDateTime(dateKey, timeValue) {
  if (!dateKey || !timeValue) return null;
  const dt = new Date(`${dateKey}T${timeValue}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatClockTime(date) {
  return date.toLocaleTimeString("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function Card({ children, style }) {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
}

function StatCard({ icon, title, value, sub }) {
  return (
    <Card>
      <div style={styles.statInner}>
        <div style={styles.iconWrap}>{icon}</div>
        <div>
          <div style={styles.statTitle}>{title}</div>
          <div style={styles.statValue}>{value}</div>
          <div style={styles.statSub}>{sub}</div>
        </div>
      </div>
    </Card>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Card>
      <div style={styles.summaryInner}>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.summaryValue}>{value}</div>
      </div>
    </Card>
  );
}

function MiniPill({ label, value }) {
  return (
    <div style={styles.pill}>
      <div style={styles.pillLabel}>{label}</div>
      <div style={styles.pillValue}>{value}</div>
    </div>
  );
}

function Icon({ children }) {
  return <span aria-hidden="true">{children}</span>;
}

export default function JackFeedingTracker() {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("daily");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFeeds();
  }, []);

  async function fetchFeeds() {
    if (!supabase) return;

    const { data, error } = await supabase.from("feeds").select("*").order("date", { ascending: false }).order("time", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setEntries((data ?? []).map(mapDbEntryToUi));
    setErrorMessage("");
  }

  const dailyGroups = useMemo(() => buildDailyGroups(entries), [entries]);
  const todayKey = getTodayKey();
  const today = dailyGroups.find((d) => d.date === todayKey);

  const summary = useMemo(() => {
    const days = dailyGroups.length;
    const totalPerDay = dailyGroups.map((d) => d.totalMl);
    const feedsPerDay = dailyGroups.map((d) => d.feeds.length);
    const wetPerDay = dailyGroups.map((d) => d.wetCount);
    const dirtyPerDay = dailyGroups.map((d) => d.dirtyCount);

    return {
      trackedDays: days,
      avgMlPerDay: average(totalPerDay),
      avgFeedsPerDay: average(feedsPerDay),
      avgWetPerDay: average(wetPerDay),
      avgDirtyPerDay: average(dirtyPerDay),
      totalFeeds: entries.length,
    };
  }, [dailyGroups, entries.length]);

  const totalMlPreview = toNumber(form.breastMl) + toNumber(form.formulaMl);

  function openNewFeed() {
    setEditingId(null);
    setForm({ ...initialForm, date: getTodayKey(), time: timeNow() });
    setStep(1);
    setOpen(true);
    setErrorMessage("");
  }

  function openEditFeed(entry) {
    setEditingId(entry.id);
    setForm(toFormValues(entry));
    setStep(1);
    setOpen(true);
    setErrorMessage("");
  }

  async function saveEntry() {
    if (!supabase) {
      setErrorMessage("Add your Supabase URL and publishable key at the top of the file first.");
      return;
    }

    setIsSaving(true);

    const preparedEntry = {
      date: form.date,
      time: form.time,
      breast_ml: toNumber(form.breastMl),
      formula_ml: toNumber(form.formulaMl),
      total_ml: totalMlPreview,
      wet: form.wet,
      dirty: form.dirty,
      down_time: form.downTime || null,
      notes: form.notes || null,
    };

    const query = editingId
      ? supabase.from("feeds").update(preparedEntry).eq("id", editingId)
      : supabase.from("feeds").insert([preparedEntry]);

    const { error } = await query;

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    await fetchFeeds();
    setOpen(false);
    setStep(1);
    setEditingId(null);
    setIsSaving(false);
    setErrorMessage("");
  }

  async function deleteEntry(id) {
    if (!supabase) {
      setErrorMessage("Add your Supabase URL and publishable key at the top of the file first.");
      return;
    }

    const { error } = await supabase.from("feeds").delete().eq("id", id);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    await fetchFeeds();
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const lastFeedToday = today?.feeds?.length ? today.feeds[today.feeds.length - 1] : null;
  const lastFeedDateTime = lastFeedToday ? parseDateTime(lastFeedToday.date, lastFeedToday.time) : null;
  const nextDueDateTime = lastFeedDateTime ? addHours(lastFeedDateTime, 3) : null;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Jack Feeding Tracker</h1>
            <p style={styles.subtitle}>Simple daily feed, nappy, and sleep logging.</p>
          </div>
          <button onClick={openNewFeed} style={styles.primaryButton}>
            + New Feed
          </button>
        </div>

        {errorMessage ? <div style={styles.errorCard}>{errorMessage}</div> : null}

        <div style={styles.statGrid}>
          <StatCard icon={<Icon>🍼</Icon>} title="Today's Total" value={`${today?.totalMl ?? 0} ml`} sub={`${today?.feeds.length ?? 0} feeds`} />
          <StatCard icon={<Icon>💧</Icon>} title="Today's Nappies" value={`${today?.wetCount ?? 0} / ${today?.dirtyCount ?? 0}`} sub="wet / dirty" />
          <StatCard icon={<Icon>📊</Icon>} title="Avg per Day" value={`${summary.avgMlPerDay.toFixed(0)} ml`} sub={`${summary.avgFeedsPerDay.toFixed(1)} feeds`} />
          <StatCard icon={<Icon>🌙</Icon>} title="Tracked Days" value={`${summary.trackedDays}`} sub={`${summary.totalFeeds} total feeds`} />
        </div>

        <div style={styles.twoColGrid}>
          <StatCard
            icon={<Icon>🕒</Icon>}
            title="Last Feed"
            value={lastFeedToday ? lastFeedToday.time : "—"}
            sub={lastFeedToday ? `${lastFeedToday.totalMl} ml today` : "No feeds logged today"}
          />
          <StatCard
            icon={<Icon>⏰</Icon>}
            title="Next Due Around"
            value={nextDueDateTime ? formatClockTime(nextDueDateTime) : "—"}
            sub={nextDueDateTime ? "Based on a 3-hour gap" : "Will show after first feed"}
          />
        </div>

        <div style={styles.tabsWrap}>
          <button style={{ ...styles.tab, ...(activeTab === "daily" ? styles.tabActive : {}) }} onClick={() => setActiveTab("daily")}>
            Daily Log
          </button>
          <button style={{ ...styles.tab, ...(activeTab === "summary" ? styles.tabActive : {}) }} onClick={() => setActiveTab("summary")}>
            Summary
          </button>
        </div>

        {activeTab === "daily" && (
          <div>
            {dailyGroups.length === 0 ? (
              <Card>
                <div style={styles.emptyState}>
                  No feeds logged yet. Start with <strong>New Feed</strong>.
                </div>
              </Card>
            ) : (
              dailyGroups.map((day) => (
                <Card key={day.date} style={{ marginBottom: "16px" }}>
                  <div style={styles.dayInfo}>
                    <div style={styles.dayCardHeader}>
                      <div>
                        <div style={{ fontSize: "20px", fontWeight: 800 }}>{day.day}</div>
                        <div style={styles.muted}>{formatDate(day.date)}</div>
                      </div>
                      <div style={styles.pills}>
                        <MiniPill label="Total" value={`${day.totalMl} ml`} />
                        <MiniPill label="Wet" value={String(day.wetCount)} />
                        <MiniPill label="Dirty" value={String(day.dirtyCount)} />
                      </div>
                    </div>
                  </div>
                  <div style={styles.contentPad}>
                    {day.feeds.map((feed) => (
                      <div key={feed.id} style={styles.feedCard}>
                        <div style={styles.feedTop}>
                          <div>
                            <div style={styles.feedTime}>{feed.time}</div>
                            <div style={styles.muted}>Feed logged</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={styles.feedTotal}>{feed.totalMl} ml</div>
                            <div style={styles.muted}>total</div>
                          </div>
                        </div>

                        <div style={styles.feedDetails}>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Breast</div>
                            <div style={styles.detailValue}>{feed.breastMl || 0} ml</div>
                          </div>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Formula</div>
                            <div style={styles.detailValue}>{feed.formulaMl || 0} ml</div>
                          </div>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Wet</div>
                            <div style={styles.detailValue}>{feed.wet}</div>
                          </div>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Dirty</div>
                            <div style={styles.detailValue}>{feed.dirty}</div>
                          </div>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Down Time</div>
                            <div style={styles.detailValue}>{feed.downTime || "—"}</div>
                          </div>
                          <div style={styles.detailBox}>
                            <div style={styles.detailLabel}>Notes</div>
                            <div style={styles.detailValue}>{feed.notes || "—"}</div>
                          </div>
                        </div>

                        <div style={styles.actionRow}>
                          <div style={styles.muted}>Saved in shared tracker</div>
                          <div style={styles.actionButtons}>
                            <button style={styles.ghostButton} onClick={() => openEditFeed(feed)}>
                              Edit
                            </button>
                            <button style={styles.dangerButton} onClick={() => deleteEntry(feed.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "summary" && (
          <div style={styles.summaryGrid}>
            <SummaryCard title="Average ml per day" value={`${summary.avgMlPerDay.toFixed(0)} ml`} />
            <SummaryCard title="Average feeds per day" value={summary.avgFeedsPerDay.toFixed(1)} />
            <SummaryCard title="Average wet nappies" value={summary.avgWetPerDay.toFixed(1)} />
            <SummaryCard title="Average dirty nappies" value={summary.avgDirtyPerDay.toFixed(1)} />
          </div>
        )}

        {open && (
          <div style={styles.modalBackdrop} onClick={() => setOpen(false)}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{editingId ? "Edit Feed" : "New Feed"}</h2>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.progressRow}>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        ...styles.progressBar,
                        background: step >= n ? "#0d9488" : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>

                {step === 1 && (
                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Date</label>
                      <input style={styles.input} type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} />
                    </div>
                    <div>
                      <label style={styles.label}>Time</label>
                      <input style={styles.input} type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Breast (ml)</label>
                      <input style={styles.input} type="number" inputMode="numeric" placeholder="e.g. 50" value={form.breastMl} onChange={(e) => updateField("breastMl", e.target.value)} />
                    </div>
                    <div>
                      <label style={styles.label}>Formula (ml)</label>
                      <input style={styles.input} type="number" inputMode="numeric" placeholder="e.g. 30" value={form.formulaMl} onChange={(e) => updateField("formulaMl", e.target.value)} />
                    </div>
                    <div style={styles.noteBox}>
                      Total feed: <strong>{totalMlPreview} ml</strong>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Wet nappy</label>
                      <select style={styles.select} value={form.wet} onChange={(e) => updateField("wet", e.target.value)}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Dirty nappy</label>
                      <select style={styles.select} value={form.dirty} onChange={(e) => updateField("dirty", e.target.value)}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Down Time</label>
                      <input style={styles.input} type="time" value={form.downTime} onChange={(e) => updateField("downTime", e.target.value)} />
                    </div>
                    <div>
                      <label style={styles.label}>Notes</label>
                      <textarea style={styles.textarea} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Anything worth noting about this feed..." />
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.modalFooter}>
                <button style={styles.secondaryButton} onClick={() => (step === 1 ? setOpen(false) : setStep(step - 1))}>
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                {step < 3 ? (
                  <button style={styles.primaryButton} onClick={() => setStep(step + 1)}>
                    Next
                  </button>
                ) : (
                  <button style={styles.primaryButton} onClick={saveEntry} disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Save Changes" : "Save Feed"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
