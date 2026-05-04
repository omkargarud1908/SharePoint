import * as React from 'react';
import type { ITeamAnnouncementsProps } from './ITeamAnnouncementsProps';
import styles from './TeamAnnouncements.module.scss';

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

const TeamAnnouncements: React.FC<ITeamAnnouncementsProps> = (props) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <section className={styles.dashboard}>
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