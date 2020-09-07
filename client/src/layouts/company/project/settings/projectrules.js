export const projectRules = (role, optinalRole) => ({
  grantAll: role === 'admin' ? true : false,
  projectModerator: optinalRole,
  member: [''],
});
