'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentInfo {
  id: string;
  name: string;
  level: string;
  targetLanguage: string;
  nativeLanguage: string;
  ageGroup: string;
  archived: boolean;
  createdAt: string;
  _count: {
    lessons: number;
    learningPlans: number;
  };
}

interface LessonInfo {
  id: string;
  title: string;
  createdAt: string;
  isRefined: boolean;
  studentId: string;
  student: {
    name: string;
  };
}

interface UserDetail {
  id: string;
  username: string | null;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  bio: string | null;
  isAdmin: boolean;
  dailyLimit: number;
  dailyGenerationCount: number;
  lastGenerationDate: string | null;
  youtubeGenerationCount: number;
  lastYoutubeGenerationDate: string | null;
  paddleCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlanId: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  subscriptionCancelAt: string | null;
  students: StudentInfo[];
}

type Tab = 'overview' | 'students' | 'lessons' | 'edit';

const SUBSCRIPTION_STATUSES = ['active', 'canceled', 'past_due', 'paused', 'trialing'];

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    dailyLimit: 20,
    isAdmin: false,
    subscriptionStatus: '' as string,
    subscriptionPlanId: '' as string,
    subscriptionCurrentPeriodEnd: '' as string,
    subscriptionCancelAt: '' as string,
  });

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLessons(data.recentLessons);
        setTotalLessons(data.totalLessons);

        // Populate edit form
        setEditForm({
          name: data.user.name || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          dailyLimit: data.user.dailyLimit,
          isAdmin: data.user.isAdmin,
          subscriptionStatus: data.user.subscriptionStatus || '',
          subscriptionPlanId: data.user.subscriptionPlanId || '',
          subscriptionCurrentPeriodEnd: data.user.subscriptionCurrentPeriodEnd
            ? new Date(data.user.subscriptionCurrentPeriodEnd).toISOString().split('T')[0]
            : '',
          subscriptionCancelAt: data.user.subscriptionCancelAt
            ? new Date(data.user.subscriptionCancelAt).toISOString().split('T')[0]
            : '',
        });
      } else if (res.status === 404) {
        router.push('/admin/users');
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');

    try {
      const payload: Record<string, unknown> = {
        name: editForm.name || null,
        username: editForm.username || null,
        bio: editForm.bio || null,
        dailyLimit: editForm.dailyLimit,
        isAdmin: editForm.isAdmin,
        subscriptionStatus: editForm.subscriptionStatus || null,
        subscriptionPlanId: editForm.subscriptionPlanId || null,
        subscriptionCurrentPeriodEnd: editForm.subscriptionCurrentPeriodEnd || null,
        subscriptionCancelAt: editForm.subscriptionCancelAt || null,
      };

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveMessage('Changes saved successfully.');
        fetchUser();
      } else {
        const data = await res.json();
        setSaveMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch {
      setSaveMessage('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-brand-primary/20 border-t-brand-primary mx-auto"></div>
          <p className="text-sm text-slate-500 mt-4">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'students', label: 'Students', count: user.students.length },
    { key: 'lessons', label: 'Lessons', count: totalLessons },
    { key: 'edit', label: 'Edit' },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-brand-primary transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {user.name || user.username || user.email}
              </h1>
              {user.isAdmin && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded-md">
                  Admin
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1.5 text-xs text-slate-400">{t.count}</span>
              )}
              {tab === t.key && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'overview' && <OverviewTab user={user} totalLessons={totalLessons} />}
      {tab === 'students' && <StudentsTab students={user.students} />}
      {tab === 'lessons' && <LessonsTab lessons={lessons} totalLessons={totalLessons} />}
      {tab === 'edit' && (
        <EditTab
          form={editForm}
          setForm={setEditForm}
          onSave={handleSave}
          saving={saving}
          saveMessage={saveMessage}
        />
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ user, totalLessons }: { user: UserDetail; totalLessons: number }) {
  const stats = [
    { label: 'Students', value: user.students.length, icon: '👥' },
    { label: 'Total Lessons', value: totalLessons, icon: '📚' },
    {
      label: 'Generations Today',
      value: `${user.dailyGenerationCount} / ${user.dailyLimit}`,
      icon: '⚡',
    },
    {
      label: 'Subscription',
      value: user.subscriptionStatus
        ? user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)
        : 'Free',
      icon: '💳',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Account Details</h3>
          <dl className="space-y-3">
            <DetailRow label="User ID" value={user.id} mono />
            <DetailRow label="Username" value={user.username || '—'} />
            <DetailRow label="Name" value={user.name || '—'} />
            <DetailRow label="Email Verified" value={user.emailVerified ? new Date(user.emailVerified).toLocaleDateString() : 'No'} />
            <DetailRow label="Bio" value={user.bio || '—'} />
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Subscription & Billing</h3>
          <dl className="space-y-3">
            <DetailRow label="Status" value={user.subscriptionStatus || 'Free'} />
            <DetailRow label="Plan ID" value={user.subscriptionPlanId || '—'} mono />
            <DetailRow label="Paddle Customer" value={user.paddleCustomerId || '—'} mono />
            <DetailRow label="Subscription ID" value={user.subscriptionId || '—'} mono />
            <DetailRow
              label="Period End"
              value={
                user.subscriptionCurrentPeriodEnd
                  ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()
                  : '—'
              }
            />
            <DetailRow
              label="Cancel At"
              value={
                user.subscriptionCancelAt
                  ? new Date(user.subscriptionCancelAt).toLocaleDateString()
                  : '—'
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-sm text-slate-500 shrink-0">{label}</dt>
      <dd className={`text-sm text-slate-900 text-right ${mono ? 'font-mono text-xs break-all' : ''}`}>
        {value}
      </dd>
    </div>
  );
}

// ── Students Tab ──────────────────────────────────────────────────────────────

function StudentsTab({ students }: { students: StudentInfo[] }) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <p className="text-slate-400 text-sm">No students yet.</p>
      </div>
    );
  }

  const active = students.filter((s) => !s.archived);
  const archived = students.filter((s) => s.archived);

  return (
    <div className="space-y-6">
      {/* Active Students */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Active Students ({active.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {active.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>

      {/* Archived */}
      {archived.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Archived ({archived.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archived.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student }: { student: StudentInfo }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 ${student.archived ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{student.name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {student.targetLanguage} • {student.nativeLanguage}
          </p>
        </div>
        <span className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded-lg">
          {student.level}
        </span>
      </div>
      <div className="flex gap-4 text-xs text-slate-500">
        <span>Age: {student.ageGroup}</span>
        <span>{student._count.lessons} lesson{student._count.lessons !== 1 ? 's' : ''}</span>
        <span>{student._count.learningPlans} plan{student._count.learningPlans !== 1 ? 's' : ''}</span>
      </div>
      <div className="text-xs text-slate-400 mt-2">
        Added {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}

// ── Lessons Tab ───────────────────────────────────────────────────────────────

function LessonsTab({ lessons, totalLessons }: { lessons: LessonInfo[]; totalLessons: number }) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <p className="text-slate-400 text-sm">No lessons generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Showing {lessons.length} of {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} (most recent)
      </p>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Refined</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">{lesson.title}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{lesson.student.name}</td>
                <td className="px-6 py-4 text-sm">
                  {lesson.isRefined ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/lessons/${lesson.id}`} target="_blank" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Edit Tab ──────────────────────────────────────────────────────────────────

function EditTab({
  form,
  setForm,
  onSave,
  saving,
  saveMessage,
}: {
  form: {
    name: string;
    username: string;
    bio: string;
    dailyLimit: number;
    isAdmin: boolean;
    subscriptionStatus: string;
    subscriptionPlanId: string;
    subscriptionCurrentPeriodEnd: string;
    subscriptionCancelAt: string;
  };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
  saveMessage: string;
}) {
  return (
    <form onSubmit={onSave} className="max-w-2xl space-y-6">
      {saveMessage && (
        <div
          className={`p-4 rounded-xl text-sm ${
            saveMessage.startsWith('Error')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Profile section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Profile</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>

          <FieldGroup label="Username">
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Bio">
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
          />
        </FieldGroup>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup label="Daily Generation Limit">
            <input
              type="number"
              value={form.dailyLimit}
              onChange={(e) => setForm((f) => ({ ...f, dailyLimit: parseInt(e.target.value) || 0 }))}
              min={0}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>

          <FieldGroup label="Admin">
            <div className="flex items-center h-[42px]">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAdmin}
                  onChange={(e) => setForm((f) => ({ ...f, isAdmin: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                <span className="ml-3 text-sm text-slate-600">{form.isAdmin ? 'Yes' : 'No'}</span>
              </label>
            </div>
          </FieldGroup>
        </div>
      </div>

      {/* Subscription section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subscription</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup label="Status">
            <select
              value={form.subscriptionStatus}
              onChange={(e) => setForm((f) => ({ ...f, subscriptionStatus: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            >
              <option value="">None (Free)</option>
              {SUBSCRIPTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Plan ID">
            <input
              type="text"
              value={form.subscriptionPlanId}
              onChange={(e) => setForm((f) => ({ ...f, subscriptionPlanId: e.target.value }))}
              placeholder="Paddle price ID"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>

          <FieldGroup label="Period End">
            <input
              type="date"
              value={form.subscriptionCurrentPeriodEnd}
              onChange={(e) =>
                setForm((f) => ({ ...f, subscriptionCurrentPeriodEnd: e.target.value }))
              }
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>

          <FieldGroup label="Cancel At">
            <input
              type="date"
              value={form.subscriptionCancelAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, subscriptionCancelAt: e.target.value }))
              }
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </FieldGroup>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            saving
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-brand-primary text-white hover:bg-brand-dark shadow-sm shadow-brand-primary/20'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
