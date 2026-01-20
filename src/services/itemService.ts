import { Item, CreateItemDto, UpdateItemDto } from '../models/item';


function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class ItemService {
  private items: Item[] = [];

  getAllItems(): Item[] {
    return this.items;
  }

  getItemById(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  createItem(data: CreateItemDto): Item {
    const newItem: Item = {
      id: generateId(),
      name: data.name.trim(),
      quantity: data.quantity || 1,
      purchased: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(newItem);
    return newItem;
  }

  updateItem(id: string, data: UpdateItemDto): Item | undefined {
    const itemIndex = this.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return undefined;
    }

    const existingItem = this.items[itemIndex];
    const updatedItem: Item = {
      ...existingItem,
      name: data.name?.trim() ?? existingItem.name,
      quantity: data.quantity ?? existingItem.quantity,
      purchased: data.purchased ?? existingItem.purchased,
      updatedAt: new Date()
    };

    this.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  deleteItem(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }

  // Helper method to clear all items
  clearAllItems(): void {
    this.items = [];
  }
}

export const itemService = new ItemService();