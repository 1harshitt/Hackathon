import {
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
} from './apiServicesImpl.js';

export const apiServiceNames = ['user', 'role', 'lead', 'contact', 'pipeline', 'stage', 'filter', 'apiGenerator'];

export {
    userApi,
    roleApi,
    leadApi,
    contactApi,
    pipelineApi,
    stageApi,
    filterApi,
    apiGeneratorApi
};

export const {
    // Users
    useGetUsersQuery, useGetUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation,
    // Roles
    useGetRolesQuery, useGetRoleQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation,
    // Leads
    useGetLeadsQuery, useGetLeadQuery, useCreateLeadMutation, useUpdateLeadMutation, useDeleteLeadMutation,
    // Contacts
    useGetContactsQuery, useGetContactQuery, useCreateContactMutation, useUpdateContactMutation, useDeleteContactMutation,
    // Pipelines
    useGetPipelinesQuery, useGetPipelineQuery, useCreatePipelineMutation, useUpdatePipelineMutation, useDeletePipelineMutation,
    // Stages
    useGetStagesQuery, useGetStageQuery, useCreateStageMutation, useUpdateStageMutation, useDeleteStageMutation,
    // Filters
    useGetFiltersQuery, useGetFilterQuery, useCreateFilterMutation, useUpdateFilterMutation, useDeleteFilterMutation,
    // API Generator
    useGetApiGeneratorsQuery, useGetApiGeneratorQuery, useCreateApiGeneratorMutation, useUpdateApiGeneratorMutation, useDeleteApiGeneratorMutation
} = apiHooks;

export { apiServices, apiHooks };