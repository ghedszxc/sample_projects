const { useLocalFetchUtil } = useUtils();

export default function useRole() {
  class MRole implements TRole {
    _id: string;
    roleName: string;
    name: string;
    permissions: Module[];
    createdBy: string;
    description?: string;
    organization?: string;
    site?: string;
    serviceProvider?: string;
    createdAt?: string;
    updatedAt?: string;
    status: string;
    constructor(
      {
        _id = "",
        roleName = "",
        name = "",
        permissions = [],
        description = "",
        status = "active",
        organization = "",
        site = "",
        serviceProvider = "",
        createdAt = "",
        updatedAt = "",
        createdBy = "",
      } = {} as TRole,
    ) {
      this._id = _id;
      this.roleName = roleName;
      this.name = name;
      this.description = description;
      this.permissions = permissions;
      this.status = status;
      this.organization = organization;
      this.site = site;
      this.serviceProvider = serviceProvider;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.createdBy = createdBy;
    }
  }

  const rolesApiUrl = "/api/roles/v1";
  const roles = useState("roles", (): TRole[] => []);
  const page = useState("rolePage", () => 1);
  const pages = useState("rolePages", () => 1);
  const searchRole = useState("roleSearch", () => "");
  const pageRange = useState("rolePageRange", () => "-- - -- of --");
  const permissionFilter = useState("isPermissionFilter", () => "main");
  const isRoleValid = useState("isRoleValid", () => false);
  const isRoleLoading = useState("isRoleLoading", () => false);
  const role = useState("role", (): TRole => new MRole());
  const roleName = useState<string>("roleName", () => "");
  // const permissions = ref([]);
  const permissions = ref<Module[]>([]);
  const permissionById = ref<Module[]>([]);
  const { currentUser } = useLocalAuth();
  const modifiedType =
    currentUser.value.type === "service-provider-member"
      ? "service-provider"
      : currentUser.value.type;

  function setRole(data?: TRole) {
    role.value = data || new MRole();
  }

  async function getRolesByRolePageSearch(
    {
      page = 1,
      limit = 10,
      search = "",
      type = "",
      organization = "",
      site = "",
      userId = "",
      serviceProvider = "",
    } = {} as ISearchRole,
  ) {
    const data = await useLocalFetchUtil<TRoleResponse>(rolesApiUrl, "GET", {
      page,
      limit,
      search,
      type,
      userId,
      serviceProvider,
      organization,
      site,
    });
    return data;
  }

  async function getRoleById(_id: string) {
    try {
      const { error, data } = await useLocalFetch(`/api/roles/v1/${_id}`);
      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message);
      }
      const roleData = data?.value as RoleData;
      if (roleData) {
        roleName.value = roleData.roleName;
        permissionById.value = roleData.modules;
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function setRoles(
    {
      search = "",
      type = "",
      organization = "",
      site = "",
      userId = "",
      serviceProvider = "",
      limit = 10,
    } = {} as ISearchRole,
  ) {
    try {
      isRoleLoading.value = true;
      const _role = (await getRolesByRolePageSearch({
        page: page.value,
        search: search || searchRole.value,
        type: type,
        organization: organization,
        site: site,
        userId: userId,
        serviceProvider: serviceProvider,
        limit: limit,
      })) as TDataRequestResponse;
      roles.value = _role.items as TRole[];
      pageRange.value = _role.pageRange;
      pages.value = _role.pages;
      isRoleLoading.value = false;
    } catch (error) {
      roles.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isRoleLoading.value = false;
    }
  }

  async function addRole(_role: TRole) {
    delete _role._id;

    const formattedRole = {
      userId: _role.createdBy,
      roleName: _role.name,
      organization: _role.organization,
      site: _role.site,
      serviceProvider: _role.serviceProvider,
      type: modifiedType,
      modules: _role.permissions.map((permission) => ({
        name: permission.name,
        moduleType: permission.moduleType,
        slug: permission.slug,
        read: permission.read.map((perm) => ({
          name: perm.name,
          slug: perm.slug,
          isEnabled: perm.isEnabled,
        })),
        create: permission.create?.map((perm) => ({
          name: perm.name,
          slug: perm.slug,
          isEnabled: perm.isEnabled,
        })),
        update: permission.update?.map((perm) => ({
          name: perm.name,
          slug: perm.slug,
          isEnabled: perm.isEnabled,
        })),
        delete: permission.delete?.map((perm) => ({
          name: perm.name,
          slug: perm.slug,
          isEnabled: perm.isEnabled,
        })),
        application: permission.application,
      })),
    };

    const { error, data } = await useLocalFetch("/api/roles/v1", {
      method: "POST",
      body: JSON.stringify(formattedRole),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateRole(_id: string, _role: TRole) {
    const formattedRole = {
      roleName: _role.name,
      modules: _role.permissions.map((permission) => ({
        name: permission.name,
        moduleType: permission.moduleType,
        slug: permission.slug,
        read: permission.read.map((perm) => ({
          name: perm.name,
          slug: perm.slug,
          isEnabled: perm.isEnabled,
        })),
        create:
          permission.create &&
          permission.create.map((perm) => ({
            name: perm.name,
            slug: perm.slug,
            isEnabled: perm.isEnabled,
          })),
        update:
          permission.update &&
          permission.update.map((perm) => ({
            name: perm.name,
            slug: perm.slug,
            isEnabled: perm.isEnabled,
          })),
        delete:
          permission.delete &&
          permission.delete.map((perm) => ({
            name: perm.name,
            slug: perm.slug,
            isEnabled: perm.isEnabled,
          })),
        application: permission.application,
      })),
    };

    const { error, data } = await useLocalFetch(`/api/roles/v1/${_id}`, {
      method: "PUT",
      body: JSON.stringify(formattedRole),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function deleteRole(_id: string) {
    const { error, data } = await useLocalFetch(`/api/roles/v1/${_id}`, {
      method: "DELETE",
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  async function nextPage(
    {
      search = "",
      type = "",
      organization = "",
      userId = "",
      site = "",
      serviceProvider = "",
    } = {} as ISearchRole,
  ) {
    page.value++;
    await setRoles({
      search: search || searchRole.value,
      type,
      site,
      serviceProvider,
    });
  }

  async function prevPage(
    {
      search = "",
      type = "",
      organization = "",
      userId = "",
      site = "",
      serviceProvider = "",
    } = {} as ISearchRole,
  ) {
    page.value--;
    await setRoles({
      search: search || searchRole.value,
      type,
      site,
      serviceProvider,
    });
  }

  async function fetchPermissions() {
    try {
      const response = await useLocalFetch("/api/module-list", {
        method: "GET",
        query: { type: modifiedType },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.error && response.error.value && response.error.value.data) {
        return Promise.reject(response.error.value.data.message as string);
      }

      const data = response.data as any;

      if (data && data.value) {
        permissions.value = data.value.modules as Module[];
        return Promise.resolve(permissions.value);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    role,
    roles,
    setRole,
    setRoles,
    isRoleValid,
    isRoleLoading,
    addRole,
    updateRole,
    getRoleById,
    searchRole,
    permissionById,
    page,
    pageRange,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    fetchPermissions,
    permissions,
    permissionFilter,
    getRandomColor,
    getRolesByRolePageSearch,
    roleName,
    deleteRole,
  };
}
