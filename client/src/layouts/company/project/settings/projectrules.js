export const projectRules = (role, optinalRole) => ({
  grantAll: role === 'admin',
  projectModerator: optinalRole,
  member: [''],
});
