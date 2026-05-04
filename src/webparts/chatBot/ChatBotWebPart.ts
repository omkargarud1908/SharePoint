import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import ChatBot from './components/ChatBot';
import type { IChatBotProps } from './components/IChatBotProps';

export interface IChatBotWebPartProps {
  title: string;
  description: string;
  apiBaseUrl: string;
}

export default class ChatBotWebPart extends BaseClientSideWebPart<IChatBotWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IChatBotProps> = React.createElement(
      ChatBot,
      {
        title: this.properties.title || 'SharePoint Support Assistant',
        description:
          this.properties.description ||
          'Ask questions about SharePoint navigation, troubleshooting, and support requests.',
        apiBaseUrl: this.properties.apiBaseUrl || 'http://localhost:4000'
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
            description: 'Chat Bot Settings'
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
                }),
                PropertyPaneTextField('apiBaseUrl', {
                  label: 'Backend API Base URL',
                  description: 'Example: http://localhost:4000 or your deployed backend URL'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
