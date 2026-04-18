import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Baby, Droplets, BarChart3, Trash2, Moon, Pencil, Clock3 } from "lucide-react";

// REPLACE THESE WITH YOUR VALUES
const SUPABASE_URL = "https://wnddhjthqncqzlwnxuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_w_LFYA3vl63sPT5jhHwsmA_iUZtW0w2";

const supabase =
  SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_PUBLISHABLE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

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

export default function JackFeedingTracker() {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50/40 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jack Feeding Tracker</h1>
            <p className="mt-1 text-sm text-slate-600">Simple daily feed, nappy, and sleep logging.</p>
          </div>
          <Button onClick={openNewFeed} className="rounded-2xl bg-teal-600 px-5 py-6 text-base text-white hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            New Feed
          </Button>
        </div>

        {errorMessage && (
          <Card className="rounded-3xl border border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4 text-sm text-amber-800">{errorMessage}</CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Baby className="h-5 w-5" />} title="Today's Total" value={`${today?.totalMl ?? 0} ml`} sub={`${today?.feeds.length ?? 0} feeds`} />
          <StatCard icon={<Droplets className="h-5 w-5" />} title="Today's Nappies" value={`${today?.wetCount ?? 0} / ${today?.dirtyCount ?? 0}`} sub="wet / dirty" />
          <StatCard icon={<BarChart3 className="h-5 w-5" />} title="Avg per Day" value={`${summary.avgMlPerDay.toFixed(0)} ml`} sub={`${summary.avgFeedsPerDay.toFixed(1)} feeds`} />
          <StatCard icon={<Moon className="h-5 w-5" />} title="Tracked Days" value={`${summary.trackedDays}`} sub={`${summary.totalFeeds} total feeds`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Last Feed"
            value={lastFeedToday ? lastFeedToday.time : "—"}
            sub={lastFeedToday ? `${lastFeedToday.totalMl} ml today` : "No feeds logged today"}
          />
          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Next Due Around"
            value={nextDueDateTime ? formatClockTime(nextDueDateTime) : "—"}
            sub={nextDueDateTime ? "Based on a 3-hour gap" : "Will show after first feed"}
          />
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="daily" className="rounded-xl border border-teal-200 bg-white text-slate-700 data-[state=active]:border-teal-600 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Daily Log
            </TabsTrigger>
            <TabsTrigger value="summary" className="rounded-xl border border-teal-200 bg-white text-slate-700 data-[state=active]:border-teal-600 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="space-y-4">
              {dailyGroups.length === 0 && (
                <Card className="rounded-3xl border-dashed border-slate-200 bg-white shadow-sm">
                  <CardContent className="py-16 text-center text-slate-500">
                    No feeds logged yet. Start with <span className="font-semibold">New Feed</span>.
                  </CardContent>
                </Card>
              )}

              {dailyGroups.map((day) => (
                <Card key={day.date} className="rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>{day.day}</CardTitle>
                        <p className="text-sm text-slate-600">{formatDate(day.date)}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <MiniPill label="Total" value={`${day.totalMl} ml`} />
                        <MiniPill label="Wet" value={String(day.wetCount)} />
                        <MiniPill label="Dirty" value={String(day.dirtyCount)} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-slate-500">
                            <th className="pb-2 pr-4">Time</th>
                            <th className="pb-2 pr-4">Breast</th>
                            <th className="pb-2 pr-4">Formula</th>
                            <th className="pb-2 pr-4">Total</th>
                            <th className="pb-2 pr-4">Wet</th>
                            <th className="pb-2 pr-4">Dirty</th>
                            <th className="pb-2 pr-4">Down Time</th>
                            <th className="pb-2 pr-4">Notes</th>
                            <th className="pb-2 pr-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.feeds.map((feed) => (
                            <tr key={feed.id} className="border-b last:border-0">
                              <td className="py-3 pr-4">{feed.time}</td>
                              <td className="py-3 pr-4">{feed.breastMl || 0} ml</td>
                              <td className="py-3 pr-4">{feed.formulaMl || 0} ml</td>
                              <td className="py-3 pr-4 font-medium">{feed.totalMl} ml</td>
                              <td className="py-3 pr-4">{feed.wet}</td>
                              <td className="py-3 pr-4">{feed.dirty}</td>
                              <td className="py-3 pr-4">{feed.downTime || "—"}</td>
                              <td className="max-w-[220px] py-3 pr-4 truncate" title={feed.notes || ""}>
                                {feed.notes || "—"}
                              </td>
                              <td className="py-3 pr-0 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-teal-50" onClick={() => openEditFeed(feed)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-rose-50" onClick={() => deleteEntry(feed.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard title="Average ml per day" value={`${summary.avgMlPerDay.toFixed(0)} ml`} />
              <SummaryCard title="Average feeds per day" value={summary.avgFeedsPerDay.toFixed(1)} />
              <SummaryCard title="Average wet nappies" value={summary.avgWetPerDay.toFixed(1)} />
              <SummaryCard title="Average dirty nappies" value={summary.avgDirtyPerDay.toFixed(1)} />
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-3xl sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Feed" : "New Feed"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? "bg-teal-600" : "bg-slate-200"}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Input className="h-12 rounded-2xl" type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Time</Label>
                      <Input className="h-12 rounded-2xl" type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label>Breast (ml)</Label>
                      <Input
                        className="h-12 rounded-2xl"
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 50"
                        value={form.breastMl}
                        onChange={(e) => updateField("breastMl", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Formula (ml)</Label>
                      <Input
                        className="h-12 rounded-2xl"
                        type="number"
                        inputMode="numeric"
                        placeholder="e.g. 30"
                        value={form.formulaMl}
                        onChange={(e) => updateField("formulaMl", e.target.value)}
                      />
                    </div>
                    <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-700">
                      Total feed: <span className="font-semibold">{totalMlPreview} ml</span>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label>Wet nappy</Label>
                      <Select value={form.wet} onValueChange={(value) => updateField("wet", value)}>
                        <SelectTrigger className="h-12 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Dirty nappy</Label>
                      <Select value={form.dirty} onValueChange={(value) => updateField("dirty", value)}>
                        <SelectTrigger className="h-12 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Down Time</Label>
                      <Input className="h-12 rounded-2xl" type="time" value={form.downTime} onChange={(e) => updateField("downTime", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Notes</Label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Anything worth noting about this feed..."
                        className="min-h-24 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => (step === 1 ? setOpen(false) : setStep(step - 1))}>
                {step === 1 ? "Cancel" : "Back"}
              </Button>
              {step < 3 ? (
                <Button className="h-12 rounded-2xl bg-teal-600 px-5 text-white hover:bg-teal-700" onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button className="h-12 rounded-2xl bg-teal-600 px-5 text-white hover:bg-teal-700" onClick={saveEntry} disabled={isSaving}>
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Save Feed"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, sub }) {
  return (
    <Card className="rounded-3xl border border-slate-100 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          <p className="text-sm text-slate-500">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Card className="rounded-3xl border border-slate-100 bg-white shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function MiniPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-teal-50 px-3 py-2 text-center text-teal-700">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
