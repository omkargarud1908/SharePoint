declare interface IChatBotWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  DescriptionFieldLabel: string;
  ApiBaseUrlFieldLabel: string;
}

declare module 'ChatBotWebPartStrings' {
  const strings: IChatBotWebPartStrings;
  export = strings;
}
