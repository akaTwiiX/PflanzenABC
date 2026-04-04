export interface ListItem {
  id?: number;
  displayName: string;
  type: 'plant' | 'collection';
  path: '/plant' | '/collection';
}
