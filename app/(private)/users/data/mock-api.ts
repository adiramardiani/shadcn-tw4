import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

import { type Model, type ModelRole, modelSchema, type ModelStatus } from '../model/schema';
import { generateData } from './fake';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type SortConfig = { id: keyof Model; desc: boolean }[];

// Mock user data store
export const fakeUsers = {
  records: [] as Model[],

  // Initialize with sample data
  initialize(count = 100) {
    this.records = Array.from({ length: count }, generateData);
  },

  // Get all users with optional status, role filtering, search, and sorting
  async getAll({
    statuses = [],
    roles = [],
    search,
    sort
  }: {
    statuses?: ModelStatus[];
    roles?: ModelRole[];
    search?: string;
    sort?: SortConfig;
  }) {
    let users = [...this.records];

    // Filter users based on selected statuses
    if (statuses.length > 0) {
      users = users.filter((user) => statuses.includes(user.status));
    }

    // Filter users based on selected roles
    if (roles.length > 0) {
      users = users.filter((user) => roles.includes(user.role));
    }

    // Search functionality across multiple fields
    if (search) {
      users = matchSorter(users, search, {
        keys: ['first_name', 'last_name', 'email', 'username']
      });
    }

    // Apply sorting
    if (sort && sort.length > 0) {
      users.sort((a, b) => {
        for (const { id, desc } of sort) {
          if (a[id] == null || b[id] == null) continue;
          if (a[id] < b[id]) return desc ? 1 : -1;
          if (a[id] > b[id]) return desc ? -1 : 1;
        }
        return 0;
      });
    }

    return users;
  },

  // Get paginated results with optional status, role filtering, search, and sorting
  async getUsers({
    page = 1,
    limit = 10,
    statuses,
    roles,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    statuses?: string;
    roles?: string;
    search?: string;
    sort?: string;
  }) {
    await delay(1000);
    const statusesArray = statuses ? (statuses.split('.') as ModelStatus[]) : [];
    const rolesArray = roles ? (roles.split('.') as ModelRole[]) : [];
    const sortConfig: SortConfig = sort ? JSON.parse(sort) : [];

    const allUsers = await this.getAll({
      statuses: statusesArray,
      roles: rolesArray,
      search,
      sort: sortConfig
    });
    const totalUsers = allUsers.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample user data for testing and learning purposes',
      total_users: totalUsers,
      offset,
      limit,
      users: paginatedUsers
    };
  },

  // Get a specific user by their ID
  async getUserById(id: string) {
    await delay(1000); // Simulate a delay

    // Find the user by their ID
    const user = this.records.find((user) => user.id === id);

    if (!user) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `User with ID ${id} found`,
      user
    };
  },

  // Create a new user
  async createUser(userData: Omit<Model, 'id' | 'created_at' | 'updated_at'>) {
    await delay(1000); // Simulate a delay

    const newUser: Model = {
      ...userData,
      id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Validate the new user data
    const validatedUser = modelSchema.parse(newUser);

    this.records.push(validatedUser);

    return {
      success: true,
      message: 'User created successfully',
      user: validatedUser
    };
  },

  // Update an existing user
  async updateUser(id: string, userData: Partial<Omit<Model, 'id' | 'created_at' | 'updated_at'>>) {
    await delay(1000); // Simulate a delay

    const userIndex = this.records.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }

    const updatedUser: Model = {
      ...this.records[userIndex],
      ...userData,
      updated_at: new Date()
    };

    // Validate the updated user data
    const validatedUser = modelSchema.parse(updatedUser);

    this.records[userIndex] = validatedUser;

    return {
      success: true,
      message: 'User updated successfully',
      user: validatedUser
    };
  },

  // Delete a user
  async deleteUser(id: string) {
    await delay(1000); // Simulate a delay

    const userIndex = this.records.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }

    const deletedUser = this.records.splice(userIndex, 1)[0];

    return {
      success: true,
      message: 'User deleted successfully',
      user: deletedUser
    };
  }
};

// Initialize sample users
fakeUsers.initialize();
