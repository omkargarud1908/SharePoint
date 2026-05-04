import * as React from 'react';
import { useState } from 'react';
import type { ICustomAppBarProps } from './ICustomAppBarProps';
import styles from './CustomAppBar.module.scss';
import { Icon, Text } from '@fluentui/react';

interface ISidebarItem {
  id: string;
  label: string;
  icon: string;
  hasDropdown?: boolean;
  selected?: boolean;
}

interface IUserProfile {
  name: string;
  initials: string;
  avatar: string;
}

const CustomAppBar: React.FC<ICustomAppBarProps> = ({ title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>('activity');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['activity']));

  const navMenuItems = [
    { id: 'explore', label: 'Explore', hasDropdown: true },
    { id: 'connect', label: 'Connect', hasDropdown: true },
    { id: 'resources', label: 'Resources', hasDropdown: true }
  ];

  const sidebarItems: ISidebarItem[] = [
    { id: 'activity', label: 'Activity Feed', icon: 'Home', hasDropdown: true },
    { id: 'foryou', label: 'For You', icon: 'Heart' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
    { id: 'recent', label: 'Recently Updated', icon: 'History' },
    { id: 'spotlight', label: 'Spotlight', icon: 'Lightbulb' },
    { id: 'spaces', label: 'Spaces', icon: 'Tiles', hasDropdown: true }
  ];

  const userProfile: IUserProfile = {
    name: 'Singh, Satyam',
    initials: 'SS',
    avatar: '#2b579a'
  };

  const handleSidebarToggle = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemSelect = (itemId: string): void => {
    setSelectedItem(itemId);
  };

  const toggleDropdown = (itemId: string): void => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={styles.appBarContainer}>
      {/* App Bar Header */}
      <div className={styles.appBar}>
        <div className={styles.appBarLeft}>
          <button
            className={styles.hamburgerBtn}
            onClick={handleSidebarToggle}
            title="Toggle Sidebar"
          >
            <Icon iconName={isSidebarOpen ? 'CollapseMenu' : 'ExpandMenu'} />
          </button>
          <Text className={styles.appLogo}>{title}</Text>
        </div>

        <div className={styles.appBarCenter}>
          {navMenuItems.map((item) => (
            <div key={item.id} className={styles.navMenuItem}>
              <button
                className={styles.navMenuBtn}
                onClick={() => toggleDropdown(item.id)}
              >
                {item.label}
                {item.hasDropdown && (
                  <Icon 
                    iconName="ChevronDown" 
                    className={styles.navMenuChevron}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.appBarRight}>
          <button className={styles.iconBtn} title="Search">
            <Icon iconName="Search" />
          </button>
          <button className={styles.iconBtn} title="Apps">
            <Icon iconName="GridViewSmall" />
          </button>
          <button className={styles.iconBtn} title="Notifications">
            <Icon iconName="Bell" />
          </button>
          <button className={styles.userProfileBtn} title="User Profile">
            <div className={styles.userAvatarSmall}>
              {userProfile.initials}
            </div>
          </button>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
          <nav className={styles.sidebarNav}>
            {sidebarItems.map((item) => (
              <div key={item.id} className={styles.sidebarItemContainer}>
                <div
                  className={`${styles.sidebarItem} ${selectedItem === item.id ? styles.active : ''}`}
                  onClick={() => handleItemSelect(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleItemSelect(item.id);
                    }
                  }}
                >
                  <Icon iconName={item.icon} className={styles.sidebarIcon} />
                  {isSidebarOpen && (
                    <>
                      <span className={styles.sidebarLabel}>{item.label}</span>
                      {item.hasDropdown && (
                        <Icon 
                          iconName={expandedItems.has(item.id) ? 'ChevronDown' : 'ChevronRight'} 
                          className={styles.dropdownIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.id);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          {isSidebarOpen && (
            <div className={styles.userProfileSection}>
              <div className={styles.userAvatar} style={{ backgroundColor: userProfile.avatar }}>
                {userProfile.initials}
              </div>
              <div className={styles.userInfo}>
                <Text className={styles.userName}>{userProfile.name}</Text>
                <span className={styles.profileBadge}>Profile</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.contentPlaceholder}>
            <Text variant="xLarge">Welcome to {title}</Text>
            <Text variant="medium" block style={{ marginTop: '16px' }}>
              Select an item from the sidebar to get started.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAppBar;
