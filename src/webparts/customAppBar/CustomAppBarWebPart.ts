import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import CustomAppBar from './components/CustomAppBar';
import type { ICustomAppBarProps } from './components/ICustomAppBarProps';

export interface ICustomAppBarWebPartProps {
  title: string;
}

export default class CustomAppBarWebPart extends BaseClientSideWebPart<ICustomAppBarWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICustomAppBarProps> = React.createElement(
      CustomAppBar,
      {
        title: this.properties.title || 'Custom App Bar'
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
          header: { description: "AppBar Settings" },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'AppBar Title'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
