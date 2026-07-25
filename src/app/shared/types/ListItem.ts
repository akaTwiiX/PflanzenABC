export interface ListItem {
  id?: number;
  displayName: string;
  nameGerman: string;
  type: 'plant' | 'collection';
  path: '/plant' | '/collection';
}
