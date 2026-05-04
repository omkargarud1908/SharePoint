import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import TeamAnnouncements from './components/TeamAnnouncements';
import type { ITeamAnnouncementsProps } from './components/ITeamAnnouncementsProps';

export interface ITeamAnnouncementsWebPartProps {
  title: string;
  description: string;
}

export default class TeamAnnouncementsWebPart extends BaseClientSideWebPart<ITeamAnnouncementsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ITeamAnnouncementsProps> = React.createElement(
      TeamAnnouncements,
      {
        title: this.properties.title || 'Team Announcements Dashboard',
        description: this.properties.description || 'A simple SPFx dashboard built with reusable React components.',
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Web Part Settings'
          },
          groups: [
            {
              groupName: 'Basic Settings',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Title'
                }),
                PropertyPaneTextField('description', {
                  label: 'Description'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}