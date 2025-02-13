const ENTITY = 'User' as const;
const BASE_PATH = '/users' as const;

export const identity = {
  entity: ENTITY,
  basePath: BASE_PATH,
  index: {
    title: `${ENTITY} List`,
    description: `Manage your ${ENTITY.toLowerCase()}s.`
  },
  detail: {
    title: `${ENTITY} Details`,
    description: `View ${ENTITY.toLowerCase()} information.`
  },
  create: {
    title: `Create ${ENTITY}`,
    description: `Add a new ${ENTITY.toLowerCase()} to the system.`,
    success: `${ENTITY} created successfully.`,
    error: `Error creating ${ENTITY.toLowerCase()}.`
  },
  update: {
    title: `Edit ${ENTITY}`,
    description: `Update ${ENTITY.toLowerCase()} information.`,
    success: `${ENTITY} updated successfully.`,
    error: `Error updating ${ENTITY.toLowerCase()}.`
  },

  delete: {
    title: `Delete ${ENTITY}`,
    description: `Are you sure you want to delete this ${ENTITY.toLowerCase()}?`,
    success: `${ENTITY} deleted successfully.`,
    error: `Error deleting ${ENTITY.toLowerCase()}.`
  }
};
