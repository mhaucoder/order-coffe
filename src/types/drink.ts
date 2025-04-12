export type Drink = {
    _id?: string;
    name: string;
    price?: number;
    description?: string;
  };
  
  export type CreateDrink = {
      name: string;
      price?: number;
      description?: string;
    };
    