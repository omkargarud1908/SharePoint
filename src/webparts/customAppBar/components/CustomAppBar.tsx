import * as React from 'react';
import { useState } from 'react';
import type { ICustomAppBarProps } from './ICustomAppBarProps';
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

const styles: { [key: string]: string } = {
  appBarContainer: 'appBarContainer',
  appBar: 'appBar',
  appBarLeft: 'appBarLeft',
  hamburgerBtn: 'hamburgerBtn',
  appLogo: 'appLogo',
  appBarCenter: 'appBarCenter',
  navMenuItem: 'navMenuItem',
  navMenuBtn: 'navMenuBtn',
  navMenuChevron: 'navMenuChevron',
  appBarRight: 'appBarRight',
  iconBtn: 'iconBtn',
  userProfileBtn: 'userProfileBtn',
  userAvatarSmall: 'userAvatarSmall',
  contentWrapper: 'contentWrapper',
  sidebar: 'sidebar',
  open: 'open',
  closed: 'closed',
  sidebarNav: 'sidebarNav',
  sidebarItemContainer: 'sidebarItemContainer',
  sidebarItem: 'sidebarItem',
  active: 'active',
  sidebarIcon: 'sidebarIcon',
  sidebarLabel: 'sidebarLabel',
  dropdownIcon: 'dropdownIcon',
  userProfileSection: 'userProfileSection',
  userAvatar: 'userAvatar',
  userInfo: 'userInfo',
  userName: 'userName',
  profileBadge: 'profileBadge',
  mainContent: 'mainContent',
  contentPlaceholder: 'contentPlaceholder'
};

const componentStyles = `
.appBarContainer{display:flex;flex-direction:column;height:100vh;width:100%;background:#f5f5f5}
.appBar{display:flex;justify-content:space-between;align-items:center;padding:0 16px;height:56px;background:#1f1f1f;color:#fff;box-shadow:0 2px 12px rgba(0,0,0,.3);z-index:1000}
.appBarLeft{display:flex;align-items:center;gap:12px;min-width:280px}
.appBarCenter{display:flex;align-items:center;gap:24px;flex:1;justify-content:center}
.appBarRight{display:flex;align-items:center;gap:12px;justify-content:flex-end}
.hamburgerBtn,.iconBtn,.userProfileBtn{background:none;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease}
.hamburgerBtn,.iconBtn{padding:8px 12px;font-size:18px;border-radius:4px}
.hamburgerBtn{font-size:20px}
.hamburgerBtn:hover,.iconBtn:hover,.userProfileBtn:hover{background:rgba(255,255,255,.15)}
.appLogo{font-size:18px;font-weight:700;color:#fff;letter-spacing:.5px;white-space:nowrap}
.navMenuItem{position:relative}
.navMenuBtn{background:none;border:none;color:#fff;font-size:14px;font-weight:500;cursor:pointer;padding:8px 12px;display:flex;align-items:center;gap:6px;transition:all .2s ease;white-space:nowrap}
.navMenuBtn:hover{color:#0078d4}
.navMenuChevron{font-size:12px}
.userProfileBtn{padding:4px;border-radius:50%}
.userAvatarSmall{min-width:32px;width:32px;height:32px;border-radius:50%;background:#2b579a;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:12px}
.contentWrapper{display:flex;flex:1;overflow:hidden}
.sidebar{width:280px;background:#f5f5f5;border-right:1px solid #e5e5e5;overflow-y:auto;transition:all .3s ease;z-index:999;display:flex;flex-direction:column}
.sidebar.closed{width:64px}
.sidebar.closed .sidebarLabel,.sidebar.closed .userProfileSection{display:none}
.sidebar.open{width:280px}
.sidebarNav{padding:8px 0;list-style:none;margin:0;flex:1}
.sidebarItemContainer{display:flex;flex-direction:column}
.sidebarItem{display:flex;align-items:center;padding:10px 16px;cursor:pointer;color:#5a6c7d;transition:all .15s ease;gap:12px;border-left:3px solid transparent;font-size:13px;user-select:none}
.sidebarItem:hover,.sidebarItem.active{background:#ececec;color:#2b2b2b}
.sidebarItem.active{font-weight:500}
.sidebarIcon{font-size:16px;min-width:18px;display:flex;align-items:center;justify-content:center;color:inherit}
.sidebarLabel{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:inherit;flex:1}
.dropdownIcon{font-size:14px;margin-left:auto;color:#8a8a8a}
.userProfileSection{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid #e5e5e5;margin-top:auto}
.userAvatar{min-width:36px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:14px}
.userInfo{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.userName{font-size:13px;font-weight:500;color:#2b2b2b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.profileBadge{font-size:11px;background:#e8e8e8;color:#5a6c7d;padding:2px 6px;border-radius:3px;font-weight:500;width:fit-content}
.mainContent{flex:1;overflow-y:auto;padding:32px;background:#f5f5f5}
.contentPlaceholder{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;min-height:100%;color:#2b2b2b}
.contentPlaceholder>:first-child{font-weight:700;color:#1a1a1a;margin-bottom:8px}
.contentPlaceholder>:nth-child(2){color:#595959}
@media (max-width:768px){.appBar{padding:0 12px}.appTitle{display:none}.sidebar{position:absolute;height:100%;left:0;top:56px;box-shadow:2px 0 8px rgba(0,0,0,.15)}.sidebar.closed{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.mainContent{padding:16px}}
`;

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
      <style>{componentStyles}</style>
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
