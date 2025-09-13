export const generateColumns = (fields = [], options = {}) => {
    const {
        customRenders = {},
        customSorters = {},
        valueMappers = {},
        dateFields = []
    } = options;

    // Convert fields to columns
    return fields.map(field => {
        const {
            name,
            title,
            render,
            sorter = true,
            width,
            className,
            align = 'left'
        } = field;

        // Base column config
        const column = {
            title: title || name,
            dataIndex: name,
            key: name,
            className,
            width,
            align
        };

        // Add custom render function if provided
        if (render || customRenders[name]) {
            column.render = render || customRenders[name];
        }
        // Add value mapper if provided
        else if (valueMappers[name]) {
            column.render = (value) => valueMappers[name][value] || value;
        }
        // Add date formatting for date fields
        else if (dateFields.includes(name)) {
            column.render = (value) => {
                if (!value) return 'N/A';
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            };
        }

        // Add sorter if needed
        if (sorter) {
            if (customSorters[name]) {
                column.sorter = customSorters[name];
            } else if (dateFields.includes(name)) {
                column.sorter = (a, b) => new Date(a[name] || 0) - new Date(b[name] || 0);
            } else if (typeof sorter === 'function') {
                column.sorter = sorter;
            } else if (sorter === true) {
                // Default sorter based on data type
                column.sorter = (a, b) => {
                    const valueA = a[name];
                    const valueB = b[name];

                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA - valueB;
                    }

                    return String(valueA).localeCompare(String(valueB));
                };
            }
        }

        return column;
    });
};

export const generateActionItems = (actions = [], handlers = {}) => {
    return (record) => {
        return actions
            .filter(action => {
                // Check both condition and shouldShow properties for backward compatibility
                const { condition, shouldShow } = action;

                if (shouldShow !== undefined) {
                    return typeof shouldShow === 'function' ? shouldShow(record) : shouldShow;
                }

                return condition ? condition(record) : true;
            })
            .map(action => {
                const { key, label, icon, danger, disabled, handler } = action;

                return {
                    key,
                    label,
                    icon,
                    danger,
                    disabled: typeof disabled === 'function' ? disabled(record) : disabled,
                    onClick: () => {
                        if (handler) {
                            return handler(record);
                        }

                        if (handlers[key]) {
                            return handlers[key](record);
                        }
                    }
                };
            });
    };
}; 