import { createBaseApi } from './createBaseApi.js';

// Define API service names
const apiServiceNames = ['user', 'role', 'lead', 'contact', 'pipeline', 'stage', 'filter', 'apiGenerator'];

// Create containers
const apiServices = {};
const apiHooks = {};

// Generate all services and hooks in one loop
apiServiceNames.forEach(name => {
    // Generate entity name (capitalized)
    const entityName = name.charAt(0).toUpperCase() + name.slice(1);

    // Create and store API service
    apiServices[`${name}Api`] = createBaseApi({
        reducerPath: `${name}Api`,
        baseEndpoint: name,
        tagType: entityName,
        extraEndpoints: (builder) => ({})
    });

    // Get API instance
    const api = apiServices[`${name}Api`];

    // Define and store hooks
    apiHooks[`useGet${entityName}sQuery`] = api.useGetAllQuery;
    apiHooks[`useGet${entityName}Query`] = api.useGetByIdQuery;
    apiHooks[`useCreate${entityName}Mutation`] = api.useCreateMutation;
    apiHooks[`useUpdate${entityName}Mutation`] = api.useUpdateMutation;
    apiHooks[`useDelete${entityName}Mutation`] = api.useDeleteMutation;
});

// Extract individual API services
const userApi = apiServices.userApi;
const roleApi = apiServices.roleApi;
const leadApi = apiServices.leadApi;
const contactApi = apiServices.contactApi;
const pipelineApi = apiServices.pipelineApi;
const stageApi = apiServices.stageApi;
const filterApi = apiServices.filterApi;
const apiGeneratorApi = apiServices.apiGeneratorApi;

// Export everything
export {
    apiServices,
    apiHooks,
    userApi,
    roleApi,
    leadApi,
    contactApi,
    pipelineApi,
    stageApi,
    filterApi,
    apiGeneratorApi
}; 