export interface Product {
  PartitionKey: string;
  RowKey: string;
  Name: string;
  Price: number;
  Stock: number;
  Category: string;
  ImageUrl: string;
  quantity: number;
  size?: string;
  AdditionalImages: string[];
}

export const mockedProducts: Product[] = [
  // Christmas
  {
    PartitionKey: 'partition1',
    RowKey: '1',
    Name: 'Christmas Art Print 1',
    Category: 'Christmas',
    Price: 20.00,
    ImageUrl: 'src/assets/moon.jpg',
    Stock: 10,
    quantity: 1,
    AdditionalImages: ['src/assets/moon.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  {
    PartitionKey: 'partition1',
    RowKey: '2',
    Name: 'Christmas Art Print 2',
    Category: 'Christmas',
    Price: 25.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 15,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  // Autumnal
  {
    PartitionKey: 'partition2',
    RowKey: '3',
    Name: 'Autumnal Art Print 1',
    Category: 'Autumnal',
    Price: 30.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 5,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  {
    PartitionKey: 'partition2',
    RowKey: '4',
    Name: 'Autumnal Art Print 2',
    Category: 'Autumnal',
    Price: 15.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 8,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  // Summer
  {
    PartitionKey: 'partition3',
    RowKey: '5',
    Name: 'Summer Art Print 1',
    Category: 'Summer',
    Price: 22.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 12,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  {
    PartitionKey: 'partition3',
    RowKey: '6',
    Name: 'Summer Art Print 2',
    Category: 'Summer',
    Price: 28.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 7,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  // Mermaid Legends
  {
    PartitionKey: 'partition4',
    RowKey: '7',
    Name: 'Mermaid Legends Art Print 1',
    Category: 'Mermaid Legends',
    Price: 18.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 9,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  {
    PartitionKey: 'partition4',
    RowKey: '8',
    Name: 'Mermaid Legends Art Print 2',
    Category: 'Mermaid Legends',
    Price: 35.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 6,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  // Digital
  {
    PartitionKey: 'partition5',
    RowKey: '9',
    Name: 'Digital Art Print 1',
    Category: 'Digital',
    Price: 19.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 11,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  },
  {
    PartitionKey: 'partition5',
    RowKey: '10',
    Name: 'Digital Art Print 2',
    Category: 'Digital',
    Price: 27.00,
    ImageUrl: 'src/assets/joann.jpg',
    Stock: 13,
    quantity: 1,
    AdditionalImages: ['src/assets/joann1.jpg', 'src/assets/moon.jpg', 'src/assets/moon1.jpg']
  }
];
