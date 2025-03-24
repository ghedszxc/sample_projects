export default function usePermission() {
 

  interface TRole {
    permissions: TPermission[];
  }

  class MPermission implements TPermission {
    action: string;
    subject: string;
    constructor({ action = "", subject = "" } = {} as TPermission) {
      this.action = action;
      this.subject = subject;
    }
  }

  // Initialize permissions as an array of TPermission
  const permissions = useState("permissions", (): TPermission[] => []);

  // Update setPermissions to correctly handle TRole or default to an empty array
  function setPermissions(data?: TRole) {
    if (data && data.permissions) {
      permissions.value = data.permissions;
    } else {
      permissions.value = [];
    }
  }

  return {
    permissions,
    setPermissions,  // Ensure to return the setPermissions function for external use
  };
}
