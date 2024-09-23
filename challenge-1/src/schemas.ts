import { Knex } from "knex";

export interface Customer {
  Index: number;
  CustomerId: string;
  FirstName: string;
  LastName: string;
  Company: string;
  City: string;
  Country: string;
  Phone1: string;
  Phone2: string;
  Email: string;
  SubscriptionDate: string;
  Website: string;
}

export interface Organization {
  Index: number;
  OrganizationId: string;
  Name: string;
  Website: string;
  Country: string;
  Description: string;
  Founded: number;
  Industry: string;
  NumberOfEmployees: number;
}

export const schemas = {
  customers: (table: Knex.CreateTableBuilder) => {
    table.increments("Index").primary();
    table.string("Customer Id").notNullable();
    table.string("First Name").notNullable();
    table.string("Last Name").notNullable();
    table.string("Company").notNullable();
    table.string("City").notNullable();
    table.string("Country").notNullable();
    table.string("Phone 1").notNullable();
    table.string("Phone 2").notNullable();
    table.string("Email").notNullable();
    table.date("Subscription Date").notNullable();
    table.string("Website").notNullable();
    // table.index(['Customer Id', 'Email', 'City']);  // commenting out for performance
  },
  organizations: (table: Knex.CreateTableBuilder) => {
    table.increments("Index").primary();
    table.string("Organization Id").notNullable();
    table.string("Name").notNullable();
    table.string("Website").notNullable();
    table.string("Country").notNullable();
    table.string("Description").notNullable();
    table.integer("Founded").notNullable();
    table.string("Industry").notNullable();
    table.integer("Number Of Employees").notNullable();
    // table.index(['Organization Id', 'Name', 'Industry']); // commenting out for performance
  },
};
