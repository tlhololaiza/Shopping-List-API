export interface Item {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemDto {
  name: string;
  quantity?: number;
}

export interface UpdateItemDto {
  name?: string;
  quantity?: number;
  purchased?: boolean;
}

export class ItemValidator {
  static validateCreateItem(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity < 0)) {
      errors.push('Quantity must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateItem(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
      errors.push('Name must be a non-empty string');
    }

    if (data.quantity !== undefined && (typeof data.quantity !== 'number' || data.quantity < 0)) {
      errors.push('Quantity must be a positive number');
    }

    if (data.purchased !== undefined && typeof data.purchased !== 'boolean') {
      errors.push('Purchased must be a boolean value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}