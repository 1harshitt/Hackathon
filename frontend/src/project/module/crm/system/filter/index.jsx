import React, { useState, useEffect, useRef } from 'react';
import { message, Select } from 'antd';
import { RiFilterLine, RiFilterLine as FilterOutlined } from 'react-icons/ri';
import FilterList from './components/FilterList';
import FilterForm from './components/FilterForm';
import {
    useGetFiltersQuery,
    useDeleteFilterMutation,
    useCreateFilterMutation,
    useUpdateFilterMutation
} from '../../../../../config/api/apiServices';
import { SystemModule } from '../../system';
import './filter.scss';

const { Option } = Select;

// Filter types
const filterTypes = [
    { value: 'tag', label: 'Tag' },
    { value: 'status', label: 'Status' },
    { value: 'label', label: 'Label' },
    { value: 'source', label: 'Source' },
    { value: 'category', label: 'Category' },
];

// Separate component for type filter
const TypeFilter = ({ selectedType, handleTypeChange }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 576);
    const filterRef = useRef(null);

    // Check screen size on mount and resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 576);
            // Close filter dropdown when resizing up from mobile
            if (window.innerWidth > 576) {
                setIsFilterOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Handle click outside to close the filter on mobile
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        // Add click listener for outside clicks
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleFilter = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsFilterOpen(!isFilterOpen);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    return (
        <div className="filter-container">
            <div
                className={`module-filter ${isFilterOpen ? 'open' : ''}`}
                ref={filterRef}
            >
                {isMobileView && (
                    <div
                        className={`filter-icon ${isFilterOpen ? 'active' : ''}`}
                        onClick={toggleFilter}
                    >
                        <FilterOutlined />
                    </div>
                )}
                <Select
                    placeholder="All Types"
                    style={{ width: '100%' }}
                    value={selectedType}
                    onChange={(val) => {
                        handleTypeChange(val);
                        if (isMobileView) {
                            closeFilter();
                        }
                    }}
                    allowClear={false}
                    showSearch
                    optionFilterProp="children"
                    onBlur={isMobileView ? closeFilter : undefined}
                    onClick={(e) => isMobileView && e.stopPropagation()}
                    dropdownStyle={{ minWidth: '220px' }}
                    dropdownMatchSelectWidth={false}
                    className="filter-select"
                >
                    <Option value="all">All Types</Option>
                    {filterTypes.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

const Filter = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedType, setSelectedType] = useState('all');
    const [filterParams, setFilterParams] = useState({});

    const [formModal, setFormModal] = useState({ visible: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ visible: false, data: null });

    const { data: response, isLoading } = useGetFiltersQuery({
        page: currentPage,
        limit: pageSize,
        ...(selectedType !== 'all' ? { type: selectedType } : {})
    });

    const [deleteFilter, { isLoading: isDeleting }] = useDeleteFilterMutation();
    const [createFilter, { isLoading: isCreating }] = useCreateFilterMutation();
    const [updateFilter, { isLoading: isUpdating }] = useUpdateFilterMutation();

    const filters = response?.data?.items || [];
    const total = response?.data?.total || 0;
    const currentPageFromServer = response?.data?.currentPage || 1;

    useEffect(() => {
        const params = {};
        if (selectedType !== 'all') {
            params.type = selectedType;
        }
        setFilterParams(params);
        setCurrentPage(1);
    }, [selectedType]);

    const handleTypeChange = (value) => {
        setSelectedType(value);
    };

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleAdd = () => setFormModal({ visible: true, data: null });
    const handleEdit = (filter) => setFormModal({ visible: true, data: filter });
    const handleDelete = (filter) => setDeleteModal({ visible: true, data: filter });

    const handleFormCancel = () => setFormModal({ visible: false, data: null });
    const handleDeleteCancel = () => setDeleteModal({ visible: false, data: null });

    const handleFormSubmit = async (values) => {
        try {
            if (formModal.data) {
                await updateFilter({ id: formModal.data.id, data: values }).unwrap();
                message.success('Filter updated successfully');
            } else {
                await createFilter(values).unwrap();
                message.success('Filter created successfully');
            }
            setFormModal({ visible: false, data: null });
        } catch (error) {
            message.error(`Failed to ${formModal.data ? 'update' : 'create'} filter: ${error.data?.message || error.message}`);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteFilter(deleteModal.data.id).unwrap();
            message.success('Filter deleted successfully');
            setDeleteModal({ visible: false, data: null });
        } catch (error) {
            message.error('Failed to delete filter');
        }
    };

    return (
        <SystemModule
            title="Filters"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onAddClick={handleAdd}
            className="filter"
            extraHeaderContent={<TypeFilter selectedType={selectedType} handleTypeChange={handleTypeChange} />}
            formModal={formModal}
            deleteModal={deleteModal}
            onFormCancel={handleFormCancel}
            onDeleteCancel={handleDeleteCancel}
            onDeleteConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
            formTitle={formModal?.data ? 'Edit Filter' : 'Add Filter'}
            formIcon={<RiFilterLine />}
            deleteTitle="Delete Filter"
            deleteItemName="filter"
            formContent={
                <FilterForm
                    initialValues={formModal?.data}
                    isSubmitting={isCreating || isUpdating}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            }
        >
            <FilterList
                filters={filters}
                isLoading={isLoading}
                viewMode={viewMode}
                currentPage={currentPageFromServer}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </SystemModule>
    );
};

export default Filter;