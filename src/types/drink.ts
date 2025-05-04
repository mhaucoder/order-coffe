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

export type UpdateDrink = {
  _id: string; // required for identification
  name?: string;
  price?: number;
  description?: string;
};