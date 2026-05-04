import * as React from 'react';
import type { ITeamAnnouncementsProps } from './ITeamAnnouncementsProps';

interface IAnnouncementItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  owner: string;
  date: string;
}

const announcementItems: IAnnouncementItem[] = [
  {
    id: 1,
    title: 'Sprint planning update',
    summary: 'Team schedule for the next sprint is finalized and ready for review.',
    category: 'Planning',
    owner: 'Satyam Singh',
    date: 'Apr 12, 2026'
  },
  {
    id: 2,
    title: 'New onboarding checklist',
    summary: 'A new checklist is available for onboarding and knowledge transfer sessions.',
    category: 'Process',
    owner: 'Satyam Singh',
    date: 'Apr 10, 2026'
  },
  {
    id: 3,
    title: 'Office hours reminder',
    summary: 'Weekly office hours are scheduled for Wednesdays at 2 PM in the main channel.',
    category: 'Reminder',
    owner: 'Omkar Garud',
    date: 'Apr 09, 2026'
  }
];

const styles: { [key: string]: string } = {
  dashboard: 'dashboard',
  headerSection: 'headerSection',
  pageTitle: 'pageTitle',
  pageDescription: 'pageDescription',
  dateBadge: 'dateBadge',
  statsGrid: 'statsGrid',
  statsCard: 'statsCard',
  statsValue: 'statsValue',
  statsLabel: 'statsLabel',
  summaryBanner: 'summaryBanner',
  summaryLabel: 'summaryLabel',
  summaryText: 'summaryText',
  listSection: 'listSection',
  sectionTitle: 'sectionTitle',
  announcementList: 'announcementList',
  announcementCard: 'announcementCard',
  announcementTopRow: 'announcementTopRow',
  categoryBadge: 'categoryBadge',
  announcementDate: 'announcementDate',
  announcementTitle: 'announcementTitle',
  announcementOwner: 'announcementOwner',
  announcementFooter: 'announcementFooter'
};

const componentStyles = `
.dashboard{padding:24px;background:#f7f9fc;border-radius:16px;font-family:"Segoe UI",Arial,sans-serif}
.headerSection{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:24px}
.pageTitle{margin:0 0 6px 0;font-size:32px;font-weight:700;color:#111827}
.pageDescription{margin:0;color:#6b7280;font-size:15px;line-height:1.6;max-width:620px}
.dateBadge{display:inline-flex;align-items:center;justify-content:center;min-width:110px;padding:10px 14px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:13px;font-weight:700}
.statsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:24px}
.statsCard{background:#fff;border-radius:16px;padding:20px;box-shadow:0 16px 30px rgba(15,23,42,.08);border:1px solid rgba(148,163,184,.16)}
.statsValue{font-size:30px;font-weight:700;color:#111827;margin-bottom:8px}
.statsLabel{font-size:13px;color:#6b7280;letter-spacing:.01em}
.summaryBanner{display:flex;align-items:center;justify-content:space-between;gap:16px;background:#fff;border-radius:16px;padding:18px 22px;margin-bottom:24px;border:1px solid rgba(148,163,184,.18)}
.summaryLabel{font-size:12px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.summaryText{margin:0;font-size:14px;color:#334155}
.listSection{margin-top:10px}
.sectionTitle{font-size:20px;font-weight:700;color:#111827;margin-bottom:16px}
.announcementList{display:grid;gap:14px}
.announcementCard{background:#fff;border-radius:16px;padding:20px;box-shadow:0 16px 30px rgba(15,23,42,.08);border:1px solid rgba(148,163,184,.18)}
.announcementTopRow{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
.categoryBadge{background:#eef2ff;color:#1d4ed8;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.announcementDate{font-size:12px;color:#475569}
.announcementTitle{font-size:18px;font-weight:700;color:#0f172a;margin-bottom:10px}
.announcementOwner{margin:0;font-size:14px;color:#475569;line-height:1.7}
.announcementFooter{margin-top:16px;font-size:13px;color:#64748b}
@media screen and (max-width:860px){.headerSection,.statsGrid{grid-template-columns:1fr}.headerSection{flex-direction:column;align-items:stretch}}
`;

const TeamAnnouncements: React.FC<ITeamAnnouncementsProps> = (props) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <section className={styles.dashboard}>
      <style>{componentStyles}</style>
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.pageTitle}>{props.title}</h1>
          <p className={styles.pageDescription}>
            Stay on top of team updates, milestones, and announcements with a clean summary
            layout.
          </p>
        </div>
        <span className={styles.dateBadge}>{today}</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.statsValue}>3</div>
          <div className={styles.statsLabel}>Latest announcements</div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsValue}>24</div>
          <div className={styles.statsLabel}>Team members active</div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsValue}>100%</div>
          <div className={styles.statsLabel}>Content coverage</div>
        </div>
      </div>

      <div className={styles.summaryBanner}>
        <div>
          <div className={styles.summaryLabel}>Web Part Status</div>
          <p className={styles.summaryText}>Ready, working successfully and fully responsive.</p>
        </div>
      </div>

      <div className={styles.listSection}>
        <h2 className={styles.sectionTitle}>Recent announcements</h2>
        <div className={styles.announcementList}>
          {announcementItems.map((item) => (
            <article key={item.id} className={styles.announcementCard}>
              <div className={styles.announcementTopRow}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <span className={styles.announcementDate}>{item.date}</span>
              </div>
              <h3 className={styles.announcementTitle}>{item.title}</h3>
              <p className={styles.announcementOwner}>{item.summary}</p>
              <div className={styles.announcementFooter}>
                <span>By {item.owner}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamAnnouncements;
