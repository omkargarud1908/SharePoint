import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ITeamAnnouncementsProps {
  title: string;
  description: string;
  context: WebPartContext;
}